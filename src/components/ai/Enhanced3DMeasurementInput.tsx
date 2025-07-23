// src/components/ai/Enhanced3DMeasurementInput.tsx
import React, { useState, Suspense } from 'react'
import { Ruler, User, RotateCcw, Eye, Maximize2, Minimize2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useMeasurement } from '@/hooks/useMeasurement'
import { useForm } from '@/hooks/useForm'
import type { BasicMeasurements } from '@/types/measurement'
import { validateMeasurement } from '@/utils/measurementHelpers'

const ThreeScene = React.lazy(() => import('@/components/measurement/ThreeScene'))

export const Enhanced3DMeasurementInput: React.FC = () => {
  const { setBasicMeasurements, startAIProcessing, isProcessing } = useMeasurement()
  const [show3D, setShow3D] = useState(true)
  const [is3DFullscreen, setIs3DFullscreen] = useState(false)
  const [activePoint, setActivePoint] = useState<string | null>(null)
  
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
    
    // Highlight corresponding 3D point
    if (['height', 'chest', 'waist'].includes(field)) {
      setActivePoint(field)
      setTimeout(() => setActivePoint(null), 2000)
    }
  }
  
  const handle3DPointClick = (pointId: string) => {
    setActivePoint(pointId)
    // Focus corresponding input field
    const fieldInput = document.getElementById(pointId)
    if (fieldInput) {
      fieldInput.focus()
    }
  }
  
  // Check if we have valid measurements to show 3D model
  const hasValidMeasurements = values.height > 0 && values.chest > 0 && values.waist > 0
  
  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <Ruler className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Interactive 3D Measurements
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enter your measurements and watch your 3D model update in real-time. 
          Click on measurement points to highlight the corresponding input field.
        </p>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Visualization Column */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-8">
              {/* 3D Controls */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  3D Preview
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShow3D(!show3D)}
                  >
                    {show3D ? 'Hide 3D' : 'Show 3D'}
                  </Button>
                  {show3D && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIs3DFullscreen(!is3DFullscreen)}
                    >
                      {is3DFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>
              
              {/* 3D Scene */}
              {show3D && (
                <div className={`transition-all duration-300 ${
                  is3DFullscreen ? 'fixed inset-0 z-50 bg-white p-8' : 'relative'
                }`}>
                  {is3DFullscreen && (
                    <Button
                      variant="outline"
                      className="absolute top-4 right-4 z-10"
                      onClick={() => setIs3DFullscreen(false)}
                    >
                      <Minimize2 className="h-4 w-4 mr-2" />
                      Exit Fullscreen
                    </Button>
                  )}
                  <Suspense fallback={<div className="flex items-center justify-center h-96"><span>Loading 3D...</span></div>}>
                    <ThreeScene
                      measurements={hasValidMeasurements ? values : undefined}
                      onMeasurementClick={handle3DPointClick}
                      activePoint={activePoint}
                      className={is3DFullscreen ? 'w-full h-full' : 'w-full h-96 lg:h-[500px]'}
                    />
                  </Suspense>
                  {!hasValidMeasurements && (
                    <div className="absolute inset-0 bg-gray-50/90 backdrop-blur-sm flex items-center justify-center rounded-lg">
                      <div className="text-center p-6">
                        <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">Enter measurements to see your 3D model</p>
                        <p className="text-gray-500 text-sm mt-1">Fill in height, chest, and waist to get started</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* 3D Tips */}
              {show3D && !is3DFullscreen && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">3D Interaction Tips:</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Click measurement points to highlight input fields</li>
                    <li>• Drag to rotate the model around</li>
                    <li>• Scroll to zoom in and out</li>
                    <li>• Model updates in real-time as you type</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Form Column */}
          <div className="order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Primary Measurements */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                    1
                  </div>
                  Essential Measurements
                </h3>
                
                <div className="space-y-6">
                  {/* Height */}
                  <div className={`measurement-card transition-all duration-200 ${
                    activePoint === 'height' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold">H</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Height</h4>
                        <p className="text-sm text-gray-500">Total height from head to toe</p>
                      </div>
                    </div>
                    
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      value={values.height || ''}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      onBlur={() => setFieldTouched('height')}
                      error={touched.height ? validateField('height', values.height) : undefined}
                      rightIcon={<span className="text-gray-400 text-sm font-medium">cm</span>}
                      className="text-center text-lg font-medium"
                    />
                  </div>
                  
                  {/* Chest */}
                  <div className={`measurement-card transition-all duration-200 ${
                    activePoint === 'chest' ? 'ring-2 ring-green-500 bg-green-50' : ''
                  }`}>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold">C</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Chest</h4>
                        <p className="text-sm text-gray-500">Around the fullest part of your chest</p>
                      </div>
                    </div>
                    
                    <Input
                      id="chest"
                      type="number"
                      placeholder="96"
                      value={values.chest || ''}
                      onChange={(e) => handleInputChange('chest', e.target.value)}
                      onBlur={() => setFieldTouched('chest')}
                      error={touched.chest ? validateField('chest', values.chest) : undefined}
                      rightIcon={<span className="text-gray-400 text-sm font-medium">cm</span>}
                      className="text-center text-lg font-medium"
                    />
                  </div>
                  
                  {/* Waist */}
                  <div className={`measurement-card transition-all duration-200 ${
                    activePoint === 'waist' ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                  }`}>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600 font-bold">W</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Waist</h4>
                        <p className="text-sm text-gray-500">Around your natural waistline</p>
                      </div>
                    </div>
                    
                    <Input
                      id="waist"
                      type="number"
                      placeholder="84"
                      value={values.waist || ''}
                      onChange={(e) => handleInputChange('waist', e.target.value)}
                      onBlur={() => setFieldTouched('waist')}
                      error={touched.waist ? validateField('waist', values.waist) : undefined}
                      rightIcon={<span className="text-gray-400 text-sm font-medium">cm</span>}
                      className="text-center text-lg font-medium"
                    />
                  </div>
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
                    setActivePoint(null)
                  }}
                  className="sm:w-auto"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                
                <Button
                  type="submit"
                  loading={isProcessing}
                  disabled={!values.height || !values.chest || !values.waist || isProcessing}
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
                    Your 3D model is ready. Click "Complete Profile" to generate {' '}
                    <span className="font-semibold">10+ additional measurements</span> with AI.
                  </p>
                </div>
              )}
              
              {/* Info Banner */}
              <div className="bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-lg p-4 text-center">
                <p className="text-primary-800 text-sm">
                  <strong>🚀 Revolutionary Experience:</strong> Watch your measurements come to life in 3D! 
                  Traditional tailoring requires 15-20 measurements and 30+ minutes. 
                  Our AI completes everything from these 3 inputs in under 30 seconds.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}