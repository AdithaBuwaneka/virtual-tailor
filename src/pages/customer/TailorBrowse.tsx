// src/pages/customer/TailorBrowse.tsx
import React, { useEffect, useState } from 'react'
import { Search, Filter, Award, X } from 'lucide-react'
import { Button, Input, LoadingSpinner } from '@/components/ui'
import { useTailor } from '@/hooks/useTailor'
import { useMeasurement } from '@/hooks/useMeasurement'
import { TailorCard } from '@/components/customer/TailorCard'
import { TailorFilters } from '@/components/customer/TailorFilters'
import { Link } from 'react-router-dom'

const TailorBrowse: React.FC = () => {
  const { 
    filteredTailors, 
    isLoading, 
    error, 
    searchQuery, 
    sortBy, 
    hasFilters,
    filteredCount,
    totalTailors,
    loadTailors, 
    setSearchQuery, 
    setSortBy,
    clearFilters
  } = useTailor()
  
  const { currentProfile, profiles } = useMeasurement()
  const [showFilters, setShowFilters] = useState(false)
  
  const hasProfile = profiles.length > 0 || currentProfile
  
  useEffect(() => {
    loadTailors()
  }, [loadTailors])
  
  if (!hasProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="h-10 w-10 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Your Measurements First
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            To find the perfect tailor and ensure accurate garment creation, 
            you need to complete your AI-powered measurement profile first.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">Why measurements matter:</h3>
            <ul className="text-blue-800 text-sm space-y-1 text-left max-w-md mx-auto">
              <li>• Tailors can see your exact requirements</li>
              <li>• Accurate pricing based on your size</li>
              <li>• Better recommendations for garment styles</li>
              <li>• Faster order processing and delivery</li>
            </ul>
          </div>
          
          <Button
            as={Link}
            to="/customer/measurements"
            size="lg"
            className="px-8"
          >
            Complete 3-Step Measurements
          </Button>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-red-600 mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Tailors</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadTailors}>Try Again</Button>
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Find Your Perfect Tailor
        </h1>
        <p className="text-gray-600">
          Discover skilled artisans worldwide who specialize in your preferred styles and cultural garments
        </p>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by name, location, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Sort */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'price' | 'experience' | 'distance')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="price">Lowest Price</option>
              <option value="experience">Most Experienced</option>
              <option value="distance">Nearest</option>
            </select>
          </div>
          
          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasFilters && (
              <span className="ml-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </Button>
        </div>
        
        {/* Active Filters */}
        {hasFilters && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 flex-shrink-0">
            <TailorFilters />
          </div>
        )}
        
        {/* Results */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {isLoading ? 'Loading...' : `${filteredCount} of ${totalTailors} tailors`}
            </h2>
            
            {!showFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(true)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Show Filters
              </Button>
            )}
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Finding the best tailors for you...</p>
            </div>
          )}
          
          {/* No Results */}
          {!isLoading && filteredTailors.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tailors found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or clearing some filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
          
          {/* Tailor Grid */}
          {!isLoading && filteredTailors.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTailors.map((tailor) => (
                <TailorCard key={tailor.id} tailor={tailor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TailorBrowse