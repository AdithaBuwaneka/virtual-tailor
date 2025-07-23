// Enhanced src/pages/customer/Dashboard.tsx (updated snippet for tailor integration)
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Ruler, Users, Package, TrendingUp, Zap, Brain, Clock, Target, Search } from 'lucide-react'
import { Button } from '@/components/ui'
import { useMeasurement } from '@/hooks/useMeasurement'
import { useTailor } from '@/hooks/useTailor'
import { ConfidenceIndicator } from '@/components/ai'
import { MobileOptimized3D } from '@/components/measurement'
import { TailorCard } from '@/components/customer'

const CustomerDashboard: React.FC = () => {
  const { profiles, currentProfile } = useMeasurement()
  const { tailors, loadTailors } = useTailor()
  
  const hasProfile = profiles.length > 0 || currentProfile
  const latestProfile = profiles[profiles.length - 1] || currentProfile
  
  // Load featured tailors for dashboard
  useEffect(() => {
    if (hasProfile && tailors.length === 0) {
      loadTailors()
    }
  }, [hasProfile, tailors.length, loadTailors])
  
  // Get featured tailors (top 3 by rating)
  const featuredTailors = tailors
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)

  // Fix type error: ensure we only pass the required keys for measurements prop
  // If a component expects {height, chest, waist}, extract those from latestProfile?.aiPredictions
  const previewMeasurements = latestProfile?.aiPredictions
    ? {
        height: latestProfile.aiPredictions.height,
        chest: latestProfile.aiPredictions.chest,
        waist: latestProfile.aiPredictions.waist
      }
    : undefined

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Customer Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Ready to create your next custom garment with AI-powered precision?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Smart Measurement Card with 3D Preview */}
        <div className="lg:col-span-2 measurement-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                <Brain className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Smart Measurements</h3>
                <p className="text-sm text-gray-600">3-step AI completion with 3D visualization</p>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Target className="h-4 w-4 mr-1" />
              3D Preview
            </div>
          </div>
          
          {hasProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Profile Status */}
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">Profile Complete</span>
                    {latestProfile?.confidenceScores && (
                      <ConfidenceIndicator 
                        confidence={Object.values(latestProfile.confidenceScores).reduce((a, b) => a + b, 0) / Object.values(latestProfile.confidenceScores).length}
                        size="small"
                      />
                    )}
                  </div>
                  <p className="text-xs text-green-700">
                    {Object.keys(latestProfile?.aiPredictions || {}).length} measurements ready
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    as={Link}
                    to="/customer/measurements"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Update Profile
                  </Button>
                  <Button
                    as={Link}
                    to="/customer/tailors"
                    size="sm"
                    className="flex-1"
                  >
                    Find Tailors
                  </Button>
                </div>
              </div>
              
              {/* 3D Model Preview */}
              <div>
                <MobileOptimized3D
                  measurements={previewMeasurements}
                  className="w-full h-48"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Getting Started */}
              <div className="space-y-3">
                <p className="text-gray-600 text-sm mb-4">
                  Get your complete measurement profile in just 3 simple steps
                </p>
                
                {/* 3-Step Preview */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-blue-600 font-bold text-xs">1</span>
                    </div>
                    Height, Chest, Waist
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                      <Zap className="h-2 w-2 text-purple-600" />
                    </div>
                    AI Processing (30 seconds)
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <Target className="h-2 w-2 text-green-600" />
                    </div>
                    Complete Profile (95%+ accuracy)
                  </div>
                </div>
                
                <Button
                  as={Link}
                  to="/customer/measurements"
                  className="w-full"
                >
                  <Ruler className="h-4 w-4 mr-2" />
                  Start 3D Measurement
                </Button>
              </div>
              
              {/* 3D Preview Placeholder */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center h-48">
                <div className="text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm font-medium">3D Model Preview</p>
                  <p className="text-gray-500 text-xs">Complete measurements to see your model</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Browse Tailors Card */}
        <div className="measurement-card">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-tailor-100 rounded-full flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-tailor-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Find Tailors</h3>
              <p className="text-sm text-gray-600">Global artisan network</p>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            Discover skilled tailors worldwide specializing in cultural and contemporary garments
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Verified Tailors</span>
              <span className="font-medium text-tailor-600">{tailors.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Average Rating</span>
              <span className="font-medium text-yellow-600">4.8/5</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Countries</span>
              <span className="font-medium text-blue-600">25+</span>
            </div>
          </div>
          
          <Button
            as={Link}
            to="/customer/tailors"
            variant="tailor"
            className="w-full"
            disabled={!hasProfile}
          >
            <Search className="h-4 w-4 mr-2" />
            {hasProfile ? 'Browse Tailors' : 'Complete Measurements First'}
          </Button>
        </div>
      </div>

      {/* Featured Tailors (only show if user has profile) */}
      {hasProfile && featuredTailors.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Tailors</h2>
            <Button
              as={Link}
              to="/customer/tailors"
              variant="outline"
            >
              View All Tailors
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredTailors.map((tailor) => (
              <TailorCard key={tailor.id} tailor={tailor} />
            ))}
          </div>
        </div>
      )}

      {/* AI Innovation Showcase */}
      <div className="bg-gradient-to-r from-primary-50 to-tailor-50 rounded-2xl p-8 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Experience the Future of Custom Tailoring
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Traditional custom tailoring requires 15-20+ measurements and takes 30+ minutes. 
            Our AI revolution completes your profile from just 3 inputs in under 3 minutes with 95%+ accuracy.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">3-Minute Setup</h3>
            <p className="text-sm text-gray-600">
              From 30+ minutes to under 3 minutes
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">AI Precision</h3>
            <p className="text-sm text-gray-600">
              95%+ accuracy with ANSUR II data
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Global Network</h3>
            <p className="text-sm text-gray-600">
              Connect with verified tailors worldwide
            </p>
          </div>
        </div>
        
        {!hasProfile && (
          <div className="text-center mt-6">
            <Button
              as={Link}
              to="/customer/measurements"
              size="lg"
              className="px-8"
            >
              Try the AI Measurement System
            </Button>
          </div>
        )}
      </div>

      {/* Getting Started or Recent Activity */}
      {!hasProfile ? (
        <div className="measurement-card text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start p-4 border-l-4 border-primary-200 bg-primary-50 text-left">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 mt-0.5 text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium text-primary-900">Complete Your Measurements</h3>
                <p className="text-sm text-primary-700 mt-1">
                  Use our revolutionary 3-step AI system to create your measurement profile
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-4 border-l-4 border-gray-200 bg-gray-50 text-left">
              <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center mr-3 mt-0.5 text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Find Your Perfect Tailor</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Browse our network of verified artisans specializing in your preferred styles
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-4 border-l-4 border-gray-200 bg-gray-50 text-left">
              <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center mr-3 mt-0.5 text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Order Your Custom Garment</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Work with your tailor to create the perfect custom piece
                </p>
              </div>
            </div>
          </div>
          
          <Button
            as={Link}
            to="/customer/measurements"
            className="mt-6"
          >
            Start Your Journey
          </Button>
        </div>
      ) : (
        <div className="measurement-card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ready for Your Next Order?</h2>
          <div className="text-center py-6">
            <Package className="h-16 w-16 text-primary-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-6">
              Your measurement profile is complete! You're ready to start ordering custom garments 
              from our network of verified tailors.
            </p>
            <Button
              as={Link}
              to="/customer/tailors"
              size="lg"
              className="px-8"
            >
              Browse Tailors & Start Ordering
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerDashboard