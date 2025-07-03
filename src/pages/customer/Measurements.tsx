// src/pages/customer/Measurements.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SmartMeasurementInterface } from '@/components/ai'

const Measurements: React.FC = () => {
  const navigate = useNavigate()
  
  const handleComplete = () => {
    // Navigate to tailor browse page after measurement completion
    navigate('/customer/tailors')
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-tailor-50 py-8">
      <div className="max-w-4xl mx-auto mb-4">
        <button onClick={() => navigate('/customer/dashboard')} className="text-primary-600 hover:underline mb-4">&larr; Back to Dashboard</button>
      </div>
      <SmartMeasurementInterface onComplete={handleComplete} />
    </div>
  )
}

export default Measurements