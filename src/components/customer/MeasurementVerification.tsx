// src/components/customer/MeasurementVerification.tsx
import React, { useState, Suspense } from 'react'
import { Check, AlertTriangle, Eye } from 'lucide-react'
import { Button, Modal } from '@/components/ui'
import type { MeasurementProfile, Tailor } from '@/types'
import { ConfidenceIndicator } from '@/components/ai'
const ThreeScene = React.lazy(() => import('@/components/measurement/ThreeScene'));
import { MEASUREMENT_LABELS, formatMeasurement } from '@/utils/measurementHelpers'

interface MeasurementVerificationProps {
  profile: MeasurementProfile
  tailor: Tailor
  onNext: () => void
  onBack: () => void
}

export const MeasurementVerification: React.FC<MeasurementVerificationProps> = ({
  profile,
  tailor,
  onNext,
  onBack
}) => {
  const [isVerified, setIsVerified] = useState(false)
  const [show3D, setShow3D] = useState(false)
  const [showMeasurementModal, setShowMeasurementModal] = useState(false)
  
  const keyMeasurements = [
    'height', 'chest', 'waist', 'hip', 'shoulderWidth', 'sleeveLength'
  ]
  
  // Defensive: handle null/undefined profile or missing confidenceScores or aiPredictions
  if (!profile || !profile.confidenceScores || !profile.aiPredictions) {
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-2xl font-bold mb-4">Measurement Profile Not Found</h2>
        <p className="mb-6">We could not load your measurement profile. Please complete your measurements before proceeding.</p>
        <Button onClick={onBack}>Back</Button>
      </div>
    )
  }

  const averageConfidence = Object.values(profile.confidenceScores).length > 0
    ? Object.values(profile.confidenceScores).reduce((a, b) => a + b, 0) / Object.values(profile.confidenceScores).length
    : 0
  
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Verify Your Measurements
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Please review your measurements with {tailor.firstName}. These will be used to create your perfect-fitting garment.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* AI Quality Banner */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                AI-Generated Measurement Profile
              </h3>
              <p className="text-gray-600">
                Created using ANSUR II anthropometric data with smart completion technology
              </p>
            </div>
            <div className="text-right">
              <ConfidenceIndicator confidence={averageConfidence} size="large" />
              <p className="text-sm text-gray-600 mt-1">
                Overall confidence score
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Measurements List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Key Measurements</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMeasurementModal(true)}
              >
                View All ({Object.keys(profile.aiPredictions).length})
              </Button>
            </div>
            
            <div className="space-y-4">
              {keyMeasurements.map((measurement) => {
                const value = profile.aiPredictions[measurement as keyof typeof profile.aiPredictions]
                // Only pass number to formatMeasurement
                const safeValue = typeof value === 'number' ? value : 0
                const confidence = profile.confidenceScores[measurement]
                const isUserAdjusted = profile.userAdjustments?.[measurement as keyof typeof profile.userAdjustments]
                
                return (
                  <div
                    key={measurement}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium text-gray-900">
                          {MEASUREMENT_LABELS[measurement]}
                        </h4>
                        {isUserAdjusted && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Adjusted
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          {formatMeasurement(safeValue)}
                        </span>
                        <ConfidenceIndicator confidence={confidence || 0} size="small" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* 3D Preview Toggle */}
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => setShow3D(!show3D)}
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                {show3D ? 'Hide' : 'Show'} 3D Model Preview
              </Button>
            </div>
          </div>
          
          {/* 3D Model or Tailor Info */}
          <div>
            {show3D ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">3D Model Preview</h3>
                <Suspense fallback={<div className="flex items-center justify-center h-96"><span>Loading 3D...</span></div>}>
                  <ThreeScene
                    measurements={profile.aiPredictions}
                    showMeasurementPoints={false}
                    className="w-full h-96"
                  />
                </Suspense>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Your measurements visualized in 3D
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What {tailor.firstName} Will Do
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <Check className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Review AI Predictions</h4>
                      <p className="text-gray-600 text-sm">
                        {tailor.firstName} will review your AI-generated measurements for accuracy
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <Check className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Suggest Adjustments</h4>
                      <p className="text-gray-600 text-sm">
                        Any necessary adjustments will be discussed before starting work
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <Check className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Perfect Fit Guarantee</h4>
                      <p className="text-gray-600 text-sm">
                        {tailor.firstName} guarantees the perfect fit based on these measurements
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-blue-900 font-medium text-sm">
                        AI Measurement Advantage
                      </p>
                      <p className="text-blue-800 text-sm">
                        Your AI-generated measurements give {tailor.firstName} a head start, 
                        reducing consultation time and ensuring accuracy from day one.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Verification Checkbox */}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
              className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="ml-3">
              <span className="font-medium text-gray-900">
                I confirm these measurements are accurate
              </span>
              <p className="text-sm text-gray-600 mt-1">
                By checking this box, you confirm that your AI-generated measurements are accurate 
                and can be used by {tailor.firstName} to create your garment. The tailor may still 
                suggest adjustments during the consultation process.
              </p>
            </div>
          </label>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back to Style
        </Button>
        <Button
          onClick={onNext}
          disabled={!isVerified}
        >
          Continue to Order Summary
        </Button>
      </div>
      
      {/* All Measurements Modal */}
      <Modal
        isOpen={showMeasurementModal}
        onClose={() => setShowMeasurementModal(false)}
        title="Complete Measurement Profile"
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(profile.aiPredictions).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">
                {MEASUREMENT_LABELS[key] || key}:
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{formatMeasurement(value)}</span>
                <ConfidenceIndicator 
                  confidence={profile.confidenceScores[key] || 0} 
                  size="small" 
                  showText={false}
                />
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}