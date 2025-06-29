// src/hooks/useMeasurement.ts
import { useMeasurementStore } from '@/store/measurementStore'

export const useMeasurement = () => {
  const {
    currentProfile,
    predictions,
    isProcessing,
    error,
    step,
    profiles,
    setBasicMeasurements,
    startAIProcessing,
    adjustMeasurement,
    saveProfile,
    loadProfiles,
    setStep,
    resetMeasurement,
    clearError
  } = useMeasurementStore()
  
  return {
    // State
    currentProfile,
    predictions,
    isProcessing,
    error,
    step,
    profiles,
    
    // Computed
    hasBasicMeasurements: !!currentProfile?.basicMeasurements,
    hasPredictions: !!predictions,
    isComplete: step === 'complete',
    
    // Actions
    setBasicMeasurements,
    startAIProcessing,
    adjustMeasurement,
    saveProfile,
    loadProfiles,
    setStep,
    resetMeasurement,
    clearError
  }
}