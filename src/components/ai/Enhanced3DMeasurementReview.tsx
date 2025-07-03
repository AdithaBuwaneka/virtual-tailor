// src/components/ai/Enhanced3DMeasurementReview.tsx
import React, { useState, Suspense } from 'react'
import { Check, RotateCcw, Save, ChevronDown, ChevronUp, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { useMeasurement } from '@/hooks/useMeasurement'
import { ConfidenceIndicator } from './ConfidenceIndicator'
import { MeasurementCard } from './MeasurementCard'
const ThreeScene = React.lazy(() => import('@/components/measurement/ThreeScene'))
import { validateMeasurement } from '@/utils/measurementHelpers'
import type { CompleteMeasurements } from '@/types'

export const Enhanced3DMeasurementReview: React.FC = () => {
  const { currentProfile, predictions, adjustMeasurement, saveProfile, isProcessing } = useMeasurement()
  const [editingField, setEditingField] = useState<keyof CompleteMeasurements | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const [expandedSection, setExpandedSection] = useState<string>('basic')
  const [show3D, setShow3D] = useState(true)
  const [activePoint, setActivePoint] = useState<string | null>(null)
  const [is3DFullscreen, setIs3DFullscreen] = useState(false)
  
  if (!currentProfile || !predictions) return null
  
  const handleEdit = (field: keyof CompleteMeasurements) => {
    setEditingField(field)
    setEditValue(currentProfile.aiPredictions[field]?.toString() || '')
    setActivePoint(field)
  }
  
  const handleSaveEdit = async () => {
    if (!editingField) return
    
    const value = parseFloat(editValue)
    if (isNaN(value)) return
    
    const error = validateMeasurement(editingField, value)
    if (error) {
      alert(error)
      return
    }
    
    await adjustMeasurement(editingField, value)
    setEditingField(null)
    setEditValue('')
    setActivePoint(null)
  }
  
  const handleCancelEdit = () => {
    setEditingField(null)
    setEditValue('')
    setActivePoint(null)
  }
  
  const handle3DPointClick = (pointId: string) => {
    setActivePoint(pointId)
    // Auto-expand the section containing this measurement
    const measurementSections = {
      basic: ['height', 'chest', 'waist'],
      body: ['hip', 'thigh', 'inseam', 'shoulderWidth'],
      arms: ['sleeveLength', 'bicep', 'forearm', 'wrist'],
      details: ['neck', 'ankle', 'calf']
    }
    
    Object.entries(measurementSections).forEach(([section, fields]) => {
      if (fields.includes(pointId)) {
        setExpandedSection(section)
      }
    })
    
    // Scroll to the measurement if it exists
    setTimeout(() => {
      const element = document.getElementById(`measurement-${pointId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }
  
  const measurementSections = {
    basic: {
      title: 'Basic Measurements',
      icon: '📏',
      fields: ['height', 'chest', 'waist'] as (keyof CompleteMeasurements)[]
    },
    body: {
      title: 'Body Measurements', 
      icon: '👤',
      fields: ['hip', 'thigh', 'inseam', 'shoulderWidth'] as (keyof CompleteMeasurements)[]
    },
    arms: {
      title: 'Arm Measurements',
      icon: '💪',
      fields: ['sleeveLength', 'bicep', 'forearm', 'wrist'] as (keyof CompleteMeasurements)[]
    },
    details: {
      title: 'Detail Measurements',
      icon: '🎯',
      fields: ['neck', 'ankle', 'calf'] as (keyof CompleteMeasurements)[]
    }
  }
  
  const averageConfidence = Object.values(currentProfile.confidenceScores).reduce((a, b) => a + b, 0) / Object.values(currentProfile.confidenceScores).length
  
  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Review Your 3D Measurement Profile
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Review your AI-generated measurements. Click on the 3D model or edit any measurement - 
          our system will automatically adjust related measurements using anthropometric correlations.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 3D Visualization Column */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <div className="sticky top-8">
              {/* 3D Controls */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">3D Model</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShow3D(!show3D)}
                  >
                    {show3D ? 'Hide' : 'Show'}
                  </Button>
                  {show3D && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIs3DFullscreen(true)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* 3D Scene */}
              {show3D && (
                <Suspense fallback={<div className="flex items-center justify-center h-96"><span>Loading 3D...</span></div>}>
                  <ThreeScene
                    measurements={currentProfile.aiPredictions}
                    onMeasurementClick={handle3DPointClick}
                    activePoint={activePoint}
                    className="w-full h-80 xl:h-96"
                  />
                </Suspense>
              )}
              
              {/* Overall Confidence */}
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">AI Prediction Quality</h4>
                    <p className="text-sm text-gray-600">ANSUR II data analysis</p>
                  </div>
                  <ConfidenceIndicator confidence={averageConfidence} size="large" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Measurements Column */}
          <div className="xl:col-span-2 order-1 xl:order-2">
            {/* Measurements by Section */}
            <div className="space-y-6 mb-8">
              {Object.entries(measurementSections).map(([sectionKey, section]) => (
                <div key={sectionKey} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === sectionKey ? '' : sectionKey)}
                    className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{section.icon}</span>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">{section.title}</h3>
                        <p className="text-sm text-gray-600">
                          {section.fields.length} measurements
                        </p>
                      </div>
                    </div>
                    {expandedSection === sectionKey ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedSection === sectionKey && (
                    <div className="p-6 bg-white">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {section.fields.map((field) => (
                          <div
                            key={field}
                            id={`measurement-${field}`}
                            className={`transition-all duration-200 ${
                              activePoint === field ? 'ring-2 ring-primary-500 rounded-lg' : ''
                            }`}
                          >
                            <MeasurementCard
                              field={field}
                              value={typeof currentProfile.aiPredictions[field] === 'number' ? currentProfile.aiPredictions[field] : 0}
                              confidence={currentProfile.confidenceScores[field] || 0}
                              isEditing={editingField === field}
                              editValue={editValue}
                              onEdit={() => handleEdit(field)}
                              onEditValueChange={setEditValue}
                              onSave={handleSaveEdit}
                              onCancel={handleCancelEdit}
                              isProcessing={isProcessing}
                              isUserAdjusted={!!currentProfile.userAdjustments?.[field]}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Start Over
              </Button>
              
              <Button
                onClick={saveProfile}
                loading={isProcessing}
                disabled={isProcessing || editingField !== null}
                className="px-8"
              >
                <Save className="h-4 w-4 mr-2" />
                Save My Profile
              </Button>
            </div>
            
            {/* Help Text */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-blue-800 text-sm">
                💡 <strong>3D Interaction:</strong> Click on measurement points in the 3D model to highlight them, 
                or edit any measurement to see smart adjustments across related measurements.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Fullscreen 3D Modal */}
      {is3DFullscreen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">3D Measurement Model</h3>
              <Button
                variant="outline"
                onClick={() => setIs3DFullscreen(false)}
              >
                Close Fullscreen
              </Button>
            </div>
            <div className="flex-1">
              <Suspense fallback={<div className="flex items-center justify-center h-full"><span>Loading 3D...</span></div>}>
                <ThreeScene
                  measurements={currentProfile.aiPredictions}
                  onMeasurementClick={handle3DPointClick}
                  activePoint={activePoint}
                  className="w-full h-full"
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}