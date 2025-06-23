// src/components/customer/TailorFilters.tsx
import React from 'react'
import { X } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useTailor } from '@/hooks/useTailor'
import { SPECIALTIES, CULTURAL_STYLES } from '@/utils/tailorHelpers'

export const TailorFilters: React.FC = () => {
  const { filters, setFilters, clearFilters } = useTailor()
  
  const handleSpecialtyToggle = (specialty: string) => {
    const current = filters.specialties || []
    const updated = current.includes(specialty)
      ? current.filter(s => s !== specialty)
      : [...current, specialty]
    setFilters({ specialties: updated })
  }
  
  const handleCulturalToggle = (cultural: string) => {
    const current = filters.cultural || []
    const updated = current.includes(cultural)
      ? current.filter(c => c !== cultural)
      : [...current, cultural]
    setFilters({ cultural: updated })
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>
      
      {/* Location */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <Input
          type="text"
          placeholder="City, Country"
          value={filters.location || ''}
          onChange={(e) => setFilters({ location: e.target.value })}
        />
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.priceRange?.[0] || ''}
            onChange={(e) => {
              const min = parseInt(e.target.value) || 0
              const max = filters.priceRange?.[1] || 1000
              setFilters({ priceRange: [min, max] })
            }}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.priceRange?.[1] || ''}
            onChange={(e) => {
              const min = filters.priceRange?.[0] || 0
              const max = parseInt(e.target.value) || 1000
              setFilters({ priceRange: [min, max] })
            }}
          />
        </div>
      </div>
      
      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Rating
        </label>
        <select
          value={filters.rating || ''}
          onChange={(e) => setFilters({ rating: parseFloat(e.target.value) || undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Any Rating</option>
          <option value="4.5">4.5+ Stars</option>
          <option value="4.0">4.0+ Stars</option>
          <option value="3.5">3.5+ Stars</option>
          <option value="3.0">3.0+ Stars</option>
        </select>
      </div>
      
      {/* Experience */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Experience
        </label>
        <select
          value={filters.experience || ''}
          onChange={(e) => setFilters({ experience: parseInt(e.target.value) || undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Any Experience</option>
          <option value="1">1+ Years</option>
          <option value="5">5+ Years</option>
          <option value="10">10+ Years</option>
          <option value="15">15+ Years</option>
          <option value="20">20+ Years</option>
        </select>
      </div>
      
      {/* Specialties */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Specialties
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {SPECIALTIES.map((specialty) => (
            <label key={specialty} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.specialties?.includes(specialty) || false}
                onChange={() => handleSpecialtyToggle(specialty)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
              />
              <span className="ml-2 text-sm text-gray-700">{specialty}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Cultural Styles */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Cultural Styles
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {CULTURAL_STYLES.map((cultural) => (
            <label key={cultural} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.cultural?.includes(cultural) || false}
                onChange={() => handleCulturalToggle(cultural)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
              />
              <span className="ml-2 text-sm text-gray-700">{cultural}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Availability */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.availability || false}
            onChange={(e) => setFilters({ availability: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
          />
          <span className="ml-2 text-sm text-gray-700">Available today</span>
        </label>
      </div>
    </div>
  )
}