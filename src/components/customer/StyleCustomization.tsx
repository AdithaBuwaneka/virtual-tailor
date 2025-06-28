// src/components/customer/StyleCustomization.tsx
import React from 'react'
import { Palette, Shirt, Scissors } from 'lucide-react'
import { Button } from '@/components/ui'
import type { Tailor } from '@/types'
import type { OrderCreate } from '@/types/order'

interface StyleCustomizationProps {
  tailor: Tailor
  garmentType: string
  orderData: OrderCreate
  onChange: (updates: Partial<OrderCreate>) => void
  onSpecificationsChange: (updates: Partial<OrderCreate['specifications']>) => void
  onNext: () => void
  onBack: () => void
}

const styleOptions = {
  shirt: {
    styles: ['Classic', 'Slim Fit', 'Regular Fit', 'Tailored Fit'],
    collars: ['Spread', 'Point', 'Button Down', 'Cutaway'],
    cuffs: ['Standard', 'French', 'Rounded', 'Angled']
  },
  suit: {
    styles: ['Two-Piece', 'Three-Piece', 'Tuxedo'],
    lapels: ['Notch', 'Peak', 'Shawl'],
    buttons: ['Single Breasted', 'Double Breasted']
  },
  dress: {
    styles: ['A-Line', 'Sheath', 'Fit & Flare', 'Empire Waist'],
    sleeves: ['Sleeveless', 'Short Sleeve', 'Long Sleeve', '3/4 Sleeve'],
    necklines: ['Round', 'V-Neck', 'Scoop', 'High Neck']
  }
}

const fabricOptions = [
  'Cotton', 'Linen', 'Silk', 'Wool', 'Polyester Blend', 'Bamboo', 'Custom Fabric'
]

const colorOptions = [
  'White', 'Black', 'Navy', 'Gray', 'Beige', 'Blue', 'Green', 'Red', 'Custom Color'
]

export const StyleCustomization: React.FC<StyleCustomizationProps> = ({
  tailor,
  garmentType,
  orderData,
  onChange,
  onSpecificationsChange,
  onNext,
  onBack
}) => {
  const currentStyles = styleOptions[garmentType as keyof typeof styleOptions] || {}
  
  const handleSpecChange = (updates: Partial<OrderCreate['specifications']>) => {
    // Call both handlers - one for OrderCreate object format and one for local state
    onChange({
      specifications: {
        ...orderData.specifications,
        ...updates
      }
    })
    onSpecificationsChange(updates)
  }

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Customize Your Style
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Personalize your {garmentType} with your preferred style, fabric, and color choices.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Style Selection */}
        {currentStyles.styles && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shirt className="h-5 w-5 mr-2" />
              Style
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentStyles.styles.map((style) => (
                <button
                  key={style}
                  onClick={() => handleSpecChange({ style })}
                  className={`p-3 text-center border rounded-lg transition-all ${
                    orderData.specifications.style === style
                      ? 'border-primary-600 bg-primary-50 text-primary-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Fabric Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Scissors className="h-5 w-5 mr-2" />
            Fabric
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fabricOptions.map((fabric) => (
              <button
                key={fabric}
                onClick={() => handleSpecChange({ fabric })}
                className={`p-3 text-center border rounded-lg transition-all ${
                  orderData.specifications.fabric === fabric
                    ? 'border-primary-600 bg-primary-50 text-primary-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {fabric}
              </button>
            ))}
          </div>
        </div>
        
        {/* Color Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Color
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={() => handleSpecChange({ color })}
                className={`p-3 text-center border rounded-lg transition-all ${
                  orderData.specifications.color === color
                    ? 'border-primary-600 bg-primary-50 text-primary-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
        
        {/* Cultural Style (if tailor has traditional specialties) */}
        {tailor.specialties.some(s => s.toLowerCase().includes('traditional')) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cultural Style
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {tailor.specialties
                .filter(s => s.toLowerCase().includes('traditional'))
                .map((cultural) => (
                  <button
                    key={cultural}
                    onClick={() => handleSpecChange({ culturalStyle: cultural })}
                    className={`p-3 text-center border rounded-lg transition-all ${
                      orderData.specifications.culturalStyle === cultural
                        ? 'border-primary-600 bg-primary-50 text-primary-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {cultural}
                  </button>
                ))}
            </div>
          </div>
        )}
        
        {/* Special Requests */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Special Requests
          </h3>
          <textarea
            value={String(orderData.notes ?? '')}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Any special requests or customizations you'd like to discuss with the tailor..."
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        {/* Rush Order */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={orderData.timeline.rushOrder as unknown as boolean}
              onChange={(e) => onChange({ timeline: { rushOrder: e.target.checked } })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="ml-3">
              <span className="font-medium text-gray-900">Rush Order</span>
              <p className="text-sm text-gray-600">
                Need it faster? Rush orders may incur additional charges and are subject to tailor availability.
              </p>
            </div>
          </label>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back to Garment Selection
        </Button>
        <Button
          onClick={onNext}
          // Remove or relax the disabled condition for testing
          // disabled={!orderData.specifications.style || !orderData.specifications.fabric || !orderData.specifications.color}
        >
          Continue to Measurements
        </Button>
      </div>
    </div>
  )
}
