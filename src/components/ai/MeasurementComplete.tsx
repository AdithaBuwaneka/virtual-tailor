// src/components/ai/MeasurementComplete.tsx
import React from 'react'
import { CheckCircle, Download, Share2, ShoppingBag, Users } from 'lucide-react'
import { Button } from '@/components/ui'
import { useMeasurement } from '@/hooks/useMeasurement'
import { formatMeasurement } from '@/utils/measurementHelpers'

interface MeasurementCompleteProps {
  onContinue?: () => void
}

export const MeasurementComplete: React.FC<MeasurementCompleteProps> = ({
  onContinue
}) => {
  const { currentProfile, resetMeasurement } = useMeasurement()
  
  // Log for debugging when the component mounts
  console.log('MeasurementComplete component mounted, onContinue =', !!onContinue)
  
  if (!currentProfile) return null
  
  const totalMeasurements = Object.keys(currentProfile.aiPredictions).length
  const averageConfidence = Object.values(currentProfile.confidenceScores).reduce((a, b) => a + b, 0) / Object.values(currentProfile.confidenceScores).length
  
  return (
    <div className="p-8 text-center">
      {/* Success Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Profile Complete! 🎉
      </h2>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Your measurement profile has been successfully created. You now have {totalMeasurements} measurements with an average confidence of {Math.round(averageConfidence * 100)}%.
      </p>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {totalMeasurements}
          </div>
          <div className="text-sm text-primary-800">
            Complete Measurements
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {Math.round(averageConfidence * 100)}%
          </div>
          <div className="text-sm text-green-800">
            Average Confidence
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            &lt; 3 min
          </div>
          <div className="text-sm text-blue-800">
            Time Saved
          </div>
        </div>
      </div>
      
      {/* Sample Measurements Preview */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
        <h3 className="font-semibold text-gray-900 mb-4">Key Measurements</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Height:</span>
            <span className="font-medium">{formatMeasurement(currentProfile.aiPredictions.height || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Chest:</span>
            <span className="font-medium">{formatMeasurement(currentProfile.aiPredictions.chest || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Waist:</span>
            <span className="font-medium">{formatMeasurement(currentProfile.aiPredictions.waist || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Hip:</span>
            <span className="font-medium">{formatMeasurement(currentProfile.aiPredictions.hip || 0)}</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">          <Button
            onClick={() => {
              console.log('Find Tailors button clicked, onContinue =', !!onContinue);
              if (onContinue) {
                onContinue();
              }
            }}
            size="lg"
            className="px-8"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Find Tailors Now
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => alert('Coming soon!')}
          >
            <Users className="h-5 w-5 mr-2" />
            Browse Garments
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="ghost"
            onClick={() => alert('Download feature coming soon!')}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Profile
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => alert('Share feature coming soon!')}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Profile
          </Button>
          
          <Button
            variant="ghost"
            onClick={resetMeasurement}
          >
            Create New Profile
          </Button>
        </div>
      </div>
      
      {/* Success Message */}
      <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">
          🚀 Revolution Complete!
        </h3>
        <p className="text-gray-700 text-sm">
          You just experienced the future of custom tailoring. What traditionally takes 30+ minutes 
          and 15-20 measurements was completed in under 3 minutes with just 3 inputs!
        </p>
      </div>
    </div>
  )
}