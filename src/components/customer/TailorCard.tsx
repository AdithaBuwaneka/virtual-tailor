// src/components/customer/TailorCard.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Star, MapPin, Clock, Award, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import type { Tailor } from '@/types'
import { formatPrice, formatRating, getSpecialtyColor } from '@/utils/tailorHelpers'

interface TailorCardProps {
  tailor: Tailor
}

export const TailorCard: React.FC<TailorCardProps> = ({ tailor }) => {
  const isAvailable = tailor.availability.workingDays.includes(
    new Date().toLocaleDateString('en-US', { weekday: 'long' })
  )
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <img
              src={tailor.avatar}
              alt={`${tailor.firstName} ${tailor.lastName}`}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {tailor.firstName} {tailor.lastName}
              </h3>
              <p className="text-gray-600 font-medium">{tailor.businessName}</p>
              <div className="flex items-center mt-1">
                <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">{tailor.location}</span>
              </div>
            </div>
          </div>
          
          {tailor.isVerified && (
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              ✓ Verified
            </div>
          )}
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-semibold text-gray-900">
                {formatRating(tailor.rating)}
              </span>
            </div>
            <p className="text-xs text-gray-600">{tailor.reviewCount} reviews</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-4 w-4 text-blue-500 mr-1" />
              <span className="font-semibold text-gray-900">{tailor.experience}</span>
            </div>
            <p className="text-xs text-gray-600">years exp.</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <span className="font-semibold text-gray-900">
                {formatPrice(tailor.pricing.basePrice)}
              </span>
            </div>
            <p className="text-xs text-gray-600">starting</p>
          </div>
        </div>
        
        {/* Specialties */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
          <div className="flex flex-wrap gap-1">
            {tailor.specialties.slice(0, 3).map((specialty) => (
              <span
                key={specialty}
                className={`px-2 py-1 rounded-full text-xs font-medium ${getSpecialtyColor(specialty)}`}
              >
                {specialty}
              </span>
            ))}
            {tailor.specialties.length > 3 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{tailor.specialties.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {tailor.description}
        </p>
        
        {/* Availability */}
        <div className="flex items-center mb-4">
          <Clock className="h-4 w-4 text-gray-400 mr-2" />
          <span className={`text-sm font-medium ${
            isAvailable ? 'text-green-600' : 'text-gray-600'
          }`}>
            {isAvailable ? 'Available today' : 'Offline today'}
          </span>
          <span className="text-gray-500 text-sm ml-2">
            ({tailor.availability.workingHours.start} - {tailor.availability.workingHours.end})
          </span>
        </div>
      </div>
      
      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex gap-3">
          <Button
            as={Link}
            to={`/customer/tailors/${tailor.id}`}
            variant="outline"
            className="flex-1"
          >
            View Profile
          </Button>
          <Button
            as={Link}
            to={`/customer/order/create?tailorId=${tailor.id}`}
            className="flex-1"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Start Order
          </Button>
        </div>
      </div>
    </div>
  )
}