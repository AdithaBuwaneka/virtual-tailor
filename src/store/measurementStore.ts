// src/store/measurementStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BasicMeasurements, CompleteMeasurements, MeasurementPrediction, MeasurementProfile } from '@/types/measurement'

interface MeasurementState {
  currentProfile: MeasurementProfile | null
  predictions: MeasurementPrediction | null
  isProcessing: boolean
  error: string | null
  step: 'input' | 'processing' | 'review' | 'complete'
  profiles: MeasurementProfile[]
  
  // Actions
  setBasicMeasurements: (measurements: BasicMeasurements) => void
  startAIProcessing: () => Promise<void>
  adjustMeasurement: (field: keyof CompleteMeasurements, value: number) => Promise<void>
  saveProfile: () => Promise<void>
  loadProfiles: () => Promise<void>
  setStep: (step: 'input' | 'processing' | 'review' | 'complete') => void
  resetMeasurement: () => void
  clearError: () => void
}

// Mock AI Service for measurement completion
class MeasurementAIService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  
  // Simulate AI measurement prediction with ANSUR II data patterns
  async predictMeasurements(basic: BasicMeasurements): Promise<MeasurementPrediction> {
    await this.delay(2000) // Simulate AI processing time
    
    const { height, chest, waist, gender = 'male' } = basic
    
    // Simulate AI prediction using anthropometric relationships
    const heightCm = height
    const chestCm = chest
    const waistCm = waist
    
    // Gender-based adjustments
    const genderMultiplier = gender === 'female' ? 0.92 : 1.0
    
    // Calculate derived measurements using realistic anthropometric ratios
    const hip = waistCm * 1.25 * genderMultiplier + (Math.random() - 0.5) * 4
    const thigh = chestCm * 0.58 * genderMultiplier + (Math.random() - 0.5) * 3
    const inseam = heightCm * 0.47 + (Math.random() - 0.5) * 6
    const sleeveLength = heightCm * 0.36 + (Math.random() - 0.5) * 4
    const shoulderWidth = chestCm * 0.48 + (Math.random() - 0.5) * 3
    const neck = heightCm * 0.21 + (Math.random() - 0.5) * 2
    const ankle = heightCm * 0.13 + (Math.random() - 0.5) * 2
    const wrist = heightCm * 0.095 + (Math.random() - 0.5) * 1
    const bicep = chestCm * 0.36 + (Math.random() - 0.5) * 2
    const forearm = heightCm * 0.16 + (Math.random() - 0.5) * 2
    const calf = thigh * 0.72 + (Math.random() - 0.5) * 2
    
    const predictions: CompleteMeasurements = {
      height: heightCm,
      chest: chestCm,
      waist: waistCm,
      hip: Math.round(hip),
      thigh: Math.round(thigh),
      inseam: Math.round(inseam),
      sleeveLength: Math.round(sleeveLength),
      shoulderWidth: Math.round(shoulderWidth),
      neck: Math.round(neck),
      ankle: Math.round(ankle),
      wrist: Math.round(wrist),
      bicep: Math.round(bicep),
      forearm: Math.round(forearm),
      calf: Math.round(calf)
    }
    
    // Generate confidence scores based on measurement type and input quality
    const baseConfidence = 0.85 + Math.random() * 0.1
    const confidenceScores = {
      hip: Math.min(0.97, baseConfidence + 0.1), // High confidence for hip
      thigh: Math.min(0.95, baseConfidence + 0.08),
      inseam: Math.min(0.94, baseConfidence + 0.07),
      sleeveLength: Math.min(0.96, baseConfidence + 0.09),
      shoulderWidth: Math.min(0.93, baseConfidence + 0.06),
      neck: Math.min(0.91, baseConfidence + 0.04),
      ankle: Math.min(0.89, baseConfidence + 0.02),
      wrist: Math.min(0.87, baseConfidence),
      bicep: Math.min(0.92, baseConfidence + 0.05),
      forearm: Math.min(0.88, baseConfidence + 0.01),
      calf: Math.min(0.90, baseConfidence + 0.03)
    }
    
    return {
      measurements: predictions,
      confidenceScores,
      modelVersion: '1.0.0',
      processingTime: 2000
    }
  }
  
  // Simulate smart re-prediction when user edits measurements
  async smartReprediction(
    currentMeasurements: CompleteMeasurements,
    editedField: keyof CompleteMeasurements,
    newValue: number
  ): Promise<Partial<CompleteMeasurements>> {
    await this.delay(500) // Quick adjustment
    
    const adjustments: Partial<CompleteMeasurements> = {}
    
    // Define measurement correlations for smart adjustments
    const correlations: Record<string, Array<{ field: keyof CompleteMeasurements; factor: number }>> = {
      hip: [
        { field: 'thigh', factor: 0.7 },
        { field: 'waist', factor: 0.8 }
      ],
      thigh: [
        { field: 'calf', factor: 0.72 },
        { field: 'hip', factor: 1.3 }
      ],
      chest: [
        { field: 'bicep', factor: 0.36 },
        { field: 'shoulderWidth', factor: 0.48 }
      ],
      shoulderWidth: [
        { field: 'chest', factor: 2.0 },
        { field: 'sleeveLength', factor: 0.75 }
      ]
    }
    
    // Calculate smart adjustments based on correlations
    const fieldCorrelations = correlations[editedField]
    if (fieldCorrelations) {
      const changeRatio = typeof currentMeasurements[editedField] === 'number' && currentMeasurements[editedField] !== 0
        ? newValue / (currentMeasurements[editedField] as number)
        : 1;
      
      fieldCorrelations.forEach(({ field, factor }) => {
        if (field !== editedField) {
          const currentValue = typeof currentMeasurements[field] === 'number' ? (currentMeasurements[field] as number) : 0;
          const adjustment = (changeRatio - 1) * currentValue * factor;
          (adjustments as Partial<Record<keyof CompleteMeasurements, number>>)[field] = Math.round(currentValue + adjustment) as number;
        }
      })
    }
    
    return adjustments
  }
}

const aiService = new MeasurementAIService()

export const useMeasurementStore = create<MeasurementState>()(
  persist(
    (set, get) => ({
      currentProfile: null,
      predictions: null,
      isProcessing: false,
      error: null,
      step: 'input',
      profiles: [],
      
      setBasicMeasurements: (measurements: BasicMeasurements) => {
        set({ 
          currentProfile: {
            id: Date.now().toString(),
            userId: 'current_user',
            basicMeasurements: measurements,
            aiPredictions: {} as CompleteMeasurements,
            confidenceScores: {},
            tailorVerified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        })
      },
      
      startAIProcessing: async () => {
        const { currentProfile } = get()
        if (!currentProfile?.basicMeasurements) return
        
        try {
          set({ isProcessing: true, error: null, step: 'processing' })
          
          const prediction = await aiService.predictMeasurements(currentProfile.basicMeasurements)
          
          set({ 
            predictions: prediction,
            currentProfile: {
              ...currentProfile,
              aiPredictions: prediction.measurements,
              confidenceScores: prediction.confidenceScores
            },
            isProcessing: false,
            step: 'review'
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'AI processing failed',
            isProcessing: false,
            step: 'input'
          })
        }
      },
      
      adjustMeasurement: async (field: keyof CompleteMeasurements, value: number) => {
        const { currentProfile, predictions } = get()
        if (!currentProfile || !predictions) return
        
        try {
          set({ isProcessing: true })
          
          // Get smart adjustments from AI
          const adjustments = await aiService.smartReprediction(
            currentProfile.aiPredictions,
            field,
            value
          )
          
          // Update measurements with user edit and AI adjustments
          const updatedMeasurements = {
            ...currentProfile.aiPredictions,
            [field]: value,
            ...adjustments
          }
          
          set({
            currentProfile: {
              ...currentProfile,
              aiPredictions: updatedMeasurements,
              userAdjustments: {
                ...currentProfile.userAdjustments,
                [field]: value
              }
            },
            predictions: {
              ...predictions,
              measurements: updatedMeasurements
            },
            isProcessing: false
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Adjustment failed',
            isProcessing: false
          })
        }
      },
      
      saveProfile: async () => {
        const { currentProfile } = get()
        if (!currentProfile) return
        
        try {
          set({ isProcessing: true })
          
          // Simulate API save
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const savedProfile = {
            ...currentProfile,
            updatedAt: new Date().toISOString()
          }
          
          set(state => ({
            profiles: [...state.profiles.filter(p => p.id !== savedProfile.id), savedProfile],
            currentProfile: savedProfile,
            isProcessing: false,
            step: 'complete'
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Save failed',
            isProcessing: false
          })
        }
      },
      
      loadProfiles: async () => {
        try {
          set({ isProcessing: true })
          
          // Simulate API load
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Mock profiles would be loaded here
          set({ isProcessing: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Load failed',
            isProcessing: false
          })
        }
      },
      
      setStep: (step) => set({ step }),
      
      resetMeasurement: () => {
        set({
          currentProfile: null,
          predictions: null,
          isProcessing: false,
          error: null,
          step: 'input'
        })
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'measurement-storage',
      partialize: (state) => ({ 
        profiles: state.profiles 
      })
    }
  )
)