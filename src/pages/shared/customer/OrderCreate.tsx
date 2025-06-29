// src/pages/customer/OrderCreate.tsx
import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, AlertCircle } from 'lucide-react'
import { Button, Alert } from '@/components/ui'
import { useTailor } from '@/hooks/useTailor'
import { useMeasurement } from '@/hooks/useMeasurement'
import { GarmentSelection } from '@/components/customer/GarmentSelection'
import { StyleCustomization } from '@/components/customer/StyleCustomization'
import { OrderSummary } from '@/components/customer/OrderSummary'
import { MeasurementVerification } from '@/components/customer/MeasurementVerification'
import type { OrderCreate as OrderCreateType } from '@/types/order'

const OrderCreate: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tailorId = searchParams.get('tailorId')
  
  const { selectedTailor, selectTailor } = useTailor()
  const { currentProfile, profiles } = useMeasurement()
  
  const [currentStep, setCurrentStep] = useState<'garment' | 'style' | 'measurements' | 'summary'>('garment')
  const [orderData, setOrderData] = useState<OrderCreateType>({
    tailorId: '',
    measurementProfileId: '',
    garmentType: '',
    specifications: {
      style: '',
      fabric: '',
      color: '',
      culturalStyle: '',
      customizations: []
    },
    timeline: {
      rushOrder: false
    },
    deliveryInfo: {
      address: '',
      method: 'delivery'
    },
    notes: ''
  })
  
  const hasProfile = profiles.length > 0 || currentProfile
  
  useEffect(() => {
    if (tailorId) {
      selectTailor(tailorId)
    }
  }, [tailorId, selectTailor])
  
  const steps: { id: 'garment' | 'style' | 'measurements' | 'summary'; title: string; description: string }[] = [
    { id: 'garment', title: 'Select Garment', description: 'Choose what you want to create' },
    { id: 'style', title: 'Customize Style', description: 'Personalize your garment' },
    { id: 'measurements', title: 'Verify Measurements', description: 'Confirm your profile' },
    { id: 'summary', title: 'Review & Order', description: 'Final review and payment' }
  ]
  
  const currentStepIndex = steps.findIndex(step => step.id === currentStep)
  
  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id)
    }
  }
  
  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id)
    } else {
      navigate('/customer/tailors')
    }
  }
    const handleOrderDataChange = (updates: Partial<OrderCreateType>) => {
    setOrderData(prev => ({ ...prev, ...updates }))
  }
    const handleSpecificationsChange = (updates: Partial<OrderCreateType['specifications']>) => {
    setOrderData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        ...updates
      }
    }))
  }
    
  const handleSubmitOrder = async () => {
    // TODO: Implement order submission
    console.log('Order submitted:', { tailorId, orderData, profile: currentProfile })
    navigate('/customer/orders')
  }

  // Transform local orderData to OrderCreate format
  const createOrderData = () => orderData
  
  if (!hasProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Alert type="warning" className="mb-8">
          <AlertCircle className="h-5 w-5" />
          <div>
            <strong>Measurements Required:</strong> You need to complete your measurement profile before placing an order.
          </div>
        </Alert>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Your Measurements First
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            To ensure the perfect fit, please complete your 3-step AI measurement profile before ordering.
          </p>
          <Button
            onClick={() => navigate('/customer/measurements')}
            size="lg"
            className="px-8"
          >
            Complete Measurements Now
          </Button>
        </div>
      </div>
    )
  }
  
  if (!selectedTailor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tailor Not Found</h2>
        <p className="text-gray-600 mb-4">Please select a tailor to continue with your order.</p>
        <Button onClick={() => navigate('/customer/tailors')}>
          Browse Tailors
        </Button>
      </div>
    )
  }
  
  // Only allow measurements step if currentProfile is valid
  const isValidProfile = !!(currentProfile && currentProfile.confidenceScores && currentProfile.aiPredictions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-tailor-50 py-8">
      <div className="max-w-4xl mx-auto mb-4">
        <button onClick={() => navigate(tailorId ? `/customer/tailors/${tailorId}` : '/customer/dashboard')} className="text-primary-600 hover:underline mb-4">&larr; Back</button>
      </div>
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStepIndex === 0 ? 'Back to Tailors' : 'Previous Step'}
            </Button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Create Order</h1>
              <p className="text-gray-600">with {selectedTailor.businessName}</p>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      index <= currentStepIndex
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : 'bg-white border-gray-300 text-gray-600'
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div
                    className={`w-20 h-0.5 mx-4 ${
                      index < currentStepIndex ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm">
          {currentStep === 'garment' && (
            <GarmentSelection
              tailor={selectedTailor}
              selectedGarment={orderData.garmentType}
              onSelect={(garmentType) => handleOrderDataChange({ garmentType })}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 'style' && (
            <StyleCustomization
              tailor={selectedTailor}
              garmentType={orderData.garmentType}
              orderData={createOrderData()}
              onChange={handleOrderDataChange}
              onSpecificationsChange={handleSpecificationsChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 'measurements' && (
            isValidProfile ? (
              <MeasurementVerification
                profile={currentProfile}
                tailor={selectedTailor}
                onNext={handleNext}
                onBack={handleBack}
              />
            ) : (
              <div className="p-8 text-center text-red-600">
                <h2 className="text-2xl font-bold mb-4">Measurement Profile Not Complete</h2>
                <p className="mb-6">Please complete your measurement profile before proceeding.</p>
                <Button onClick={() => navigate('/customer/measurements')}>Go to Measurements</Button>
              </div>
            )
          )}
          
          {currentStep === 'summary' && (
            <OrderSummary
              tailor={selectedTailor}
              orderData={createOrderData()}
              profile={currentProfile!}
              onSubmit={handleSubmitOrder}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderCreate