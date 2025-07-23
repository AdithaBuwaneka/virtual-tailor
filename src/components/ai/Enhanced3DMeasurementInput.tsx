// src/components/ai/Enhanced3DMeasurementInput.tsx - Updated with GLB Guide System
import React, { useState, Suspense } from 'react'
import { Ruler, User, RotateCcw, Eye, Maximize2, Minimize2, Play } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useMeasurement } from '@/hooks/useMeasurement'
import { useForm } from '@/hooks/useForm'
const MeasurementGuideLoader = React.lazy(() => import('@/components/measurement/MeasurementGuideLoader').then(module => ({ default: module.MeasurementGuideLoader })))
import type { BasicMeasurements } from '@/types/measurement'
import { validateMeasurement } from '@/utils/measurementHelpers'

interface MeasurementField {
  id: keyof BasicMeasurements
  label: string
  placeholder: string
  description: string
  icon: string
  color: string
}

export const Enhanced3DMeasurementInput: React.FC = () => {
  const { setBasicMeasurements, startAIProcessing, isProcessing } = useMeasurement()
  const [activeGuide, setActiveGuide] = useState<string | null>(null)
  const [show3D, setShow3D] = useState(true)
  const [is3DFullscreen, setIs3DFullscreen] = useState(false)
  
  const { values, touched, setValue, setFieldTouched, handleSubmit } = useForm<BasicMeasurements & Record<string, unknown>>({
    initialValues: {
      height: 0,
      chest: 0,
      waist: 0,
      age: 25,
      gender: 'male'
    },
    onSubmit: async (formValues) => {
      setBasicMeasurements(formValues)
      await startAIProcessing()
    }
  })
  
  // Measurement fields configuration
  const measurementFields: MeasurementField[] = [
    {
      id: 'height',
      label: 'Height',
      placeholder: '175',
      description: 'Your total height from head to toe',
      icon: '📏',
      color: 'bg-blue-100 text-blue-600 border-blue-200'
    },
    {
      id: 'chest',
      label: 'Chest',
      placeholder: '96',
      description: 'Around the fullest part of your chest',
      icon: '🫁',
      color: 'bg-green-100 text-green-600 border-green-200'
    },
    {
      id: 'waist',
      label: 'Waist',
      placeholder: '84',
      description: 'Around your natural waistline',
      icon: '⭕',
      color: 'bg-purple-100 text-purple-600 border-purple-200'
    }
  ]
  
  const validateField = (field: keyof BasicMeasurements, value: number) => {
    if (field === 'age') {
      if (value < 18 || value > 80) return 'Age should be between 18 and 80'
      return undefined
    }
    return validateMeasurement(field, value)
  }
  
  const handleInputChange = (field: keyof BasicMeasurements, value: string) => {
    const numValue = parseFloat(value) || 0
    setValue(field, numValue)
  }
  
  const handleGuideToggle = (measurementType: string) => {
    setActiveGuide(activeGuide === measurementType ? null : measurementType)
  }
  
  // Check if we have valid measurements
  const hasValidMeasurements = values.height > 0 && values.chest > 0 && values.waist > 0
  
  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Ruler className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Interactive 3D Measurement Guide
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Click on measurement buttons to see 3D guides. Enter your measurements and our AI will complete your profile.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Column */}
          <div className="order-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Primary Measurements */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                    1
                  </div>
                  Essential Measurements
                </h3>
                
                <div className="space-y-4">
                  {measurementFields.map((field) => (
                    <div 
                      key={field.id} 
                      className={`measurement-card transition-all duration-200 ${
                        activeGuide === field.id ? 'ring-2 ring-primary-500 bg-primary-50' : ''
                      }`}
                    >
                      {/* Field Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${field.color}`}>
                            <span className="text-xl">{field.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{field.label}</h4>
                            <p className="text-sm text-gray-500">{field.description}</p>
                          </div>
                        </div>
                        
                        {/* Guide Button */}
                        <Button
                          type="button"
                          variant={activeGuide === field.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleGuideToggle(field.id)}
                          className="flex items-center gap-2"
                        >
                          <Play className="h-4 w-4" />
                          {activeGuide === field.id ? 'Hide Guide' : 'Show Guide'}
                        </Button>
                      </div>
                      
                      {/* Input Field */}
                      <Input
                        id={field.id}
                        type="number"
                        placeholder={field.placeholder}
                        value={values[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        onBlur={() => setFieldTouched(field.id)}
                        error={touched[field.id] ? validateField(field.id, values[field.id] as number) : undefined}
                        rightIcon={<span className="text-gray-400 text-sm font-medium">cm</span>}
                        className="text-center text-lg font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Optional Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Optional: Better AI Accuracy
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <Input
                      type="number"
                      placeholder="25"
                      value={values.age || ''}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      onBlur={() => setFieldTouched('age')}
                      error={touched.age ? validateField('age', values.age || 0) : undefined}
                      rightIcon={<span className="text-gray-400 text-sm">years</span>}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={values.gender}
                      onChange={(e) => setValue('gender', e.target.value as 'male' | 'female')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setValue('height', 0)
                    setValue('chest', 0)
                    setValue('waist', 0)
                    setValue('age', 25)
                    setActiveGuide(null)
                  }}
                  className="sm:w-auto"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                
                <Button
                  type="submit"
                  loading={isProcessing}
                  disabled={!hasValidMeasurements || isProcessing}
                  className="sm:w-auto px-8"
                >
                  Complete Profile with AI
                </Button>
              </div>
              
              {/* Progress Indicator */}
              {hasValidMeasurements && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-green-800 font-medium mb-1">✓ Ready for AI Processing</div>
                  <p className="text-green-700 text-sm">
                    Your measurements are ready. Click "Complete Profile" to generate{' '}
                    <span className="font-semibold">10+ additional measurements</span> with AI.
                  </p>
                </div>
              )}
            </form>
          </div>
          
          {/* 3D Guide Column */}
          <div className="order-2">
            <div className="sticky top-8">
              {/* 3D Controls */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  3D Measurement Guide
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShow3D(!show3D)}
                  >
                    {show3D ? 'Hide 3D' : 'Show 3D'}
                  </Button>
                  {show3D && activeGuide && (
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
              
              {/* 3D Guide Display */}
              {show3D && (
                <div className="relative">
                  {activeGuide ? (
                    <Suspense fallback={
                      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span>Loading 3D Guide...</span>
                      </div>
                    }>
                      <MeasurementGuideLoader
                        measurementType={activeGuide}
                        className="w-full h-96"
                        showInstructions={true}
                      />
                    </Suspense>
                  ) : (
                    <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                      <div className="text-center p-6">
                        <Ruler className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium mb-2">Select a Measurement</p>
                        <p className="text-gray-500 text-sm">
                          Click "Show Guide" on any measurement to see the 3D tutorial
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Guide Instructions */}
              {activeGuide && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    🎯 How to use the 3D guide:
                  </h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Rotate the model to see different angles</li>
                    <li>• Use zoom to see details clearly</li>
                    <li>• Follow the highlighted measurement areas</li>
                    <li>• Read the instructions at the bottom</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Fullscreen 3D Modal */}
      {is3DFullscreen && activeGuide && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {measurementFields.find(f => f.id === activeGuide)?.label} Measurement Guide
              </h3>
              <Button
                variant="outline"
                onClick={() => setIs3DFullscreen(false)}
              >
                <Minimize2 className="h-4 w-4 mr-2" />
                Exit Fullscreen
              </Button>
            </div>
            <div className="flex-1">
              <Suspense fallback={<div className="flex items-center justify-center h-full"><span>Loading...</span></div>}>
                <MeasurementGuideLoader
                  measurementType={activeGuide}
                  className="w-full h-full"
                  showInstructions={true}
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}
      
      {/* Info Banner */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-lg p-4 text-center">
        <p className="text-primary-800 text-sm">
          <strong>🚀 Revolutionary Experience:</strong> Interactive 3D guides make measuring easy and accurate! 
          Traditional tailoring requires 15-20 measurements and 30+ minutes. 
          Our AI completes everything from these 3 inputs in under 30 seconds.
        </p>
      </div>
    </div>
  )
}