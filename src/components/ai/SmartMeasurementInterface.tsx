// Updated src/components/ai/SmartMeasurementInterface.tsx
import React, { useEffect, useState } from 'react'
import { useMeasurement } from '@/hooks/useMeasurement'
import { Enhanced3DMeasurementInput } from './Enhanced3DMeasurementInput'
import { AIProcessingStep } from './AIProcessingStep'
import { Enhanced3DMeasurementReview } from './Enhanced3DMeasurementReview'
import { MeasurementComplete } from './MeasurementComplete'
import { ProgressTracker } from './ProgressTracker'
import { Alert, Button } from '@/components/ui'
import { Smartphone, Monitor } from 'lucide-react'

interface SmartMeasurementInterfaceProps {
  onComplete?: () => void
}

export const SmartMeasurementInterface: React.FC<SmartMeasurementInterfaceProps> = ({
  onComplete
}) => {
  const { step, error, clearError, resetMeasurement } = useMeasurement()
  const [viewMode, setViewMode] = useState<'3d' | 'simple'>('3d')
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Start fresh when component mounts
    resetMeasurement()
    
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // Auto-set simple mode on very small screens
      if (window.innerWidth < 640) {
        setViewMode('simple')
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [resetMeasurement])
  
  const renderCurrentStep = () => {
    switch (step) {
      case 'input':
        return <Enhanced3DMeasurementInput />
      case 'processing':
        return <AIProcessingStep />
      case 'review':
        return <Enhanced3DMeasurementReview />
      case 'complete':
        return <MeasurementComplete onContinue={onComplete} />
      default:
        return null
    }
  }
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
          Smart Measurement System
        </h1>
        <p className="text-xl text-gray-600">
          Get your complete measurement profile in just 3 steps with AI
        </p>
        
        {/* View Mode Toggle */}
        {!isMobile && step === 'input' && (
          <div className="mt-4 inline-flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === '3d'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Monitor className="h-4 w-4 mr-2" />
              3D Experience
            </button>
            <button
              onClick={() => setViewMode('simple')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'simple'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Simple Mode
            </button>
          </div>
        )}
      </div>
      
      {/* Progress Tracker */}
      <ProgressTracker currentStep={step} className="mb-8" />
      
      {/* Mobile 3D Warning */}
      {isMobile && viewMode === '3d' && step === 'input' && (
        <Alert type="info" className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <strong>Mobile 3D Mode:</strong> For the best experience on mobile, consider using Simple Mode.
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('simple')}
            >
              Switch to Simple
            </Button>
          </div>
        </Alert>
      )}
      
      {/* Error Display */}
      {error && (
        <Alert type="error" className="mb-6">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Dismiss
            </button>
          </div>
        </Alert>
      )}
      
      {/* Current Step Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <React.Suspense 
          fallback={
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          }
        >
          {renderCurrentStep()}
        </React.Suspense>
      </div>
    </div>
  )
}
