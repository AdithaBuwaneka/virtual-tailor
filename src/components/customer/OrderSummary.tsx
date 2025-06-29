// src/components/customer/OrderSummary.tsx
import React, { useState } from 'react'
import { CreditCard, MapPin, Clock, Star, Shield, MessageCircle } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import type { MeasurementProfile, Tailor } from '@/types'
import type { OrderCreate } from '@/types/order'
import { formatPrice } from '@/utils/tailorHelpers'

interface OrderSummaryProps {
  tailor: Tailor
  orderData: OrderCreate
  profile: MeasurementProfile
  onSubmit: () => void
  onBack: () => void
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  tailor,
  orderData,
  profile,
  onSubmit,
  onBack
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
    // Calculate pricing
  const basePrice = tailor.pricing.basePrice
  const complexityPrice = orderData.garmentType === 'suit' ? tailor.pricing.pricePerComplexity * 2 : 
                         orderData.garmentType === 'dress' ? tailor.pricing.pricePerComplexity : 0
  const rushPrice = orderData.timeline.rushOrder ? tailor.pricing.rush : 0
  const subtotal = basePrice + complexityPrice + rushPrice
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax
  
  // Calculate delivery time
  const baseDeliveryDays = orderData.garmentType === 'suit' ? 21 : 
                          orderData.garmentType === 'dress' ? 14 : 
                          orderData.garmentType === 'traditional' ? 18 : 10
  const deliveryDays = orderData.timeline.rushOrder ? Math.ceil(baseDeliveryDays * 0.7) : baseDeliveryDays
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays)
  
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Review Your Order
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Review all details before placing your order with {tailor.businessName}
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tailor Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Tailor</h3>
              <div className="flex items-center">
                <img
                  src={tailor.avatar}
                  alt={`${tailor.firstName} ${tailor.lastName}`}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {tailor.firstName} {tailor.lastName}
                  </h4>
                  <p className="text-gray-600">{tailor.businessName}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600">
                      {tailor.rating} ({tailor.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {tailor.location}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Garment Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Garment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium capitalize">{orderData.garmentType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Style</p>
                  <p className="font-medium">{orderData.specifications.style}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fabric</p>
                  <p className="font-medium">{orderData.specifications.fabric}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Color</p>
                  <p className="font-medium">{orderData.specifications.color}</p>
                </div>
                {orderData.specifications.culturalStyle && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Cultural Style</p>
                    <p className="font-medium">{orderData.specifications.culturalStyle}</p>
                  </div>
                )}                {orderData.notes && typeof orderData.notes === 'string' && orderData.notes.trim() !== '' && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Special Requests</p>
                    <p className="font-medium">{orderData.notes}</p>
                  </div>
                )}
              </div>
                {orderData.timeline.rushOrder && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 font-medium">Rush Order</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Expedited processing for faster delivery
                  </p>
                </div>
              )}
            </div>
            
            {/* Measurements */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Measurements</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-900">AI-Generated Profile</span>
                </div>
                <p className="text-green-800 text-sm">
                  {Object.keys(profile.aiPredictions).length} measurements with{' '}
                  {Math.round((Object.values(profile.confidenceScores).reduce((a, b) => a + b, 0) / Object.values(profile.confidenceScores).length) * 100)}% average confidence
                </p>
              </div>
            </div>
            
            {/* Delivery Address */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
              <Input
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your complete delivery address..."
                className="mb-4"
              />
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  Estimated delivery: {deliveryDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} ({deliveryDays} days)
                </span>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div className="ml-3 flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                    <span>Credit/Debit Card</span>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div className="ml-3 flex items-center">
                    <span className="w-5 h-5 bg-blue-600 rounded mr-2 flex items-center justify-center text-white text-xs font-bold">P</span>
                    <span>PayPal</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-medium">{formatPrice(basePrice)}</span>
                </div>
                {complexityPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Complexity</span>
                    <span className="font-medium">{formatPrice(complexityPrice)}</span>
                  </div>
                )}
                {rushPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rush Order</span>
                    <span className="font-medium">{formatPrice(rushPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg">{formatPrice(total)}</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Estimated completion:</span>
                    <span className="font-medium">{deliveryDays} days</span>
                  </div>
                </div>
                
                <div className="bg-primary-50 rounded-lg p-3">
                  <div className="flex items-center text-sm">
                    <MessageCircle className="h-4 w-4 text-primary-600 mr-2" />
                    <span className="text-primary-800">Direct communication with {tailor.firstName}</span>
                  </div>
                </div>
              </div>
              
              {/* Terms Agreement */}
              <div className="mb-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-700">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-700">
                      Payment Policy
                    </a>
                  </span>
                </label>
              </div>
              
              <Button
                onClick={onSubmit}
                disabled={!deliveryAddress || !agreeToTerms}
                className="w-full mb-4"
                size="lg"
              >
                Place Order ({formatPrice(total)})
              </Button>
              
              <Button
                variant="outline"
                onClick={onBack}
                className="w-full"
              >
                Back to Measurements
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}