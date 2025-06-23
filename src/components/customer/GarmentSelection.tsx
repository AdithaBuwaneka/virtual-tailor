// src/components/customer/GarmentSelection.tsx
import React from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui'
import type { Tailor } from '@/types'

interface GarmentSelectionProps {
  tailor: Tailor
  selectedGarment: string
  onSelect: (garmentType: string) => void
  onNext: () => void
}

// Mock garment data with images
const garmentOptions = [
  {
    id: 'shirt',
    name: 'Custom Shirt',
    description: 'Tailored shirts for business or casual wear',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300',
    price: 150,
    timeframe: '7-10 days'
  },
  {
    id: 'suit',
    name: 'Bespoke Suit',
    description: 'Complete suit with jacket and trousers',
    image: 'https://images.unsplash.com/photo-1507038772120-7fff76f79d79?w=300',
    price: 800,
    timeframe: '3-4 weeks'
  },
  {
    id: 'dress',
    name: 'Custom Dress',
    description: 'Elegant dresses for any occasion',
    image: 'https://images.unsplash.com/photo-1566479179817-c8dbe9ebbe44?w=300',
    price: 400,
    timeframe: '2-3 weeks'
  },
  {
    id: 'traditional',
    name: 'Traditional Wear',
    description: 'Cultural and traditional garments',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=300',
    price: 300,
    timeframe: '2-4 weeks'
  },
  {
    id: 'pants',
    name: 'Custom Trousers',
    description: 'Perfectly fitted pants and trousers',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300',
    price: 120,
    timeframe: '5-7 days'
  },
  {
    id: 'jacket',
    name: 'Custom Jacket',
    description: 'Blazers and sports jackets',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    price: 500,
    timeframe: '2-3 weeks'
  }
]

export const GarmentSelection: React.FC<GarmentSelectionProps> = ({
  tailor,
  selectedGarment,
  onSelect,
  onNext
}) => {
  // Filter garments based on tailor's specialties
  const availableGarments = garmentOptions.filter(garment => {
    if (garment.id === 'traditional') {
      return tailor.specialties.some(specialty => 
        specialty.toLowerCase().includes('traditional') ||
        specialty.toLowerCase().includes('cultural')
      )
    }
    if (garment.id === 'suit') {
      return tailor.specialties.some(specialty =>
        specialty.toLowerCase().includes('suit') ||
        specialty.toLowerCase().includes('formal')
      )
    }
    return true // Show other garments for all tailors
  })
  
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          What would you like to create?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the type of garment you'd like {tailor.firstName} to create for you. 
          Each option includes personalization and perfect fitting.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {availableGarments.map((garment) => (
          <div
            key={garment.id}
            className={`relative bg-white border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedGarment === garment.id
                ? 'border-primary-600 ring-2 ring-primary-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelect(garment.id)}
          >
            {selectedGarment === garment.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center z-10">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            
            <div className="aspect-w-4 aspect-h-3">
              <img
                src={garment.image}
                alt={garment.name}
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {garment.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {garment.description}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-600">Starting at </span>
                  <span className="font-semibold text-gray-900">
                    ${garment.price}
                  </span>
                </div>
                <div className="text-gray-600">
                  {garment.timeframe}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <Button
          onClick={onNext}
          disabled={!selectedGarment}
          size="lg"
          className="px-8"
        >
          Continue to Style Customization
        </Button>
      </div>
    </div>
  )
}