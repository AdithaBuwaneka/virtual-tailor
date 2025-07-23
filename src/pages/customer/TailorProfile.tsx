// Updated src/pages/customer/TailorProfile.tsx (enhanced with chat integration)
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, Clock, Award, Heart, Share2, CheckCircle, Video } from 'lucide-react'
import { Button, LoadingSpinner } from '@/components/ui'
import { useTailor } from '@/hooks/useTailor'
import { PortfolioGallery } from '@/components/customer/PortfolioGallery'
import { ReviewsList } from '@/components/customer/ReviewsList'
import { QuickChatButton } from '@/components/chat/QuickChatButton'
import { VideoConsultation } from '@/components/chat/VideoConsultation'
import { formatPrice, formatRating, getSpecialtyColor } from '@/utils/tailorHelpers'

const TailorProfile: React.FC = () => {
  const { tailorId } = useParams<{ tailorId: string }>()
  const { selectedTailor, isLoading, error, selectTailor } = useTailor()
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'about'>('portfolio')
  const [isFavorited, setIsFavorited] = useState(false)
  const [showVideoConsultation, setShowVideoConsultation] = useState(false)
  
  useEffect(() => {
    if (tailorId) {
      selectTailor(tailorId)
    }
  }, [tailorId, selectTailor])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    )
  }
  
  if (error || !selectedTailor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-red-600 mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tailor Not Found</h2>
        <p className="text-gray-600 mb-4">{error || 'The tailor you\'re looking for doesn\'t exist.'}</p>
        <Button as={Link} to="/customer/tailors">
          Back to Browse
        </Button>
      </div>
    )
  }
  
  const tailor = selectedTailor
  const isAvailable = tailor.availability.workingDays.includes(
    new Date().toLocaleDateString('en-US', { weekday: 'long' })
  )
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <Button
              as={Link}
              to="/customer/tailors"
              variant="ghost"
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Tailor Info */}
            <div className="flex-1">
              <div className="flex items-start gap-6">
                <img
                  src={tailor.avatar}
                  alt={`${tailor.firstName} ${tailor.lastName}`}
                  className="w-24 h-24 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {tailor.firstName} {tailor.lastName}
                    </h1>
                    {tailor.isVerified && (
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verified
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-xl text-gray-700 font-medium mb-3">{tailor.businessName}</h2>
                  
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-600">{tailor.location}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                      <span className={`font-medium ${isAvailable ? 'text-green-600' : 'text-gray-600'}`}>
                        {isAvailable ? 'Available today' : 'Offline today'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-8">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="font-semibold text-gray-900 mr-1">
                        {formatRating(tailor.rating)}
                      </span>
                      <span className="text-gray-600">({tailor.reviewCount} reviews)</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-semibold text-gray-900 mr-1">{tailor.experience}</span>
                      <span className="text-gray-600">years experience</span>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-900">Starting at {formatPrice(tailor.pricing.basePrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="lg:w-80">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-4">
                  <Button
                    as={Link}
                    to={`/customer/order/create?tailorId=${tailor.id}`}
                    size="lg"
                    className="w-full"
                  >
                    Start Order
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <QuickChatButton
                      tailorId={tailor.id}
                      tailorName={tailor.firstName}
                      size="sm"
                      className="flex-1"
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowVideoConsultation(true)}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Video Call
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFavorited(!isFavorited)}
                      className={isFavorited ? 'text-red-600 border-red-200' : ''}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                      {isFavorited ? 'Saved' : 'Save'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.share?.({ 
                        title: `${tailor.businessName}`, 
                        url: window.location.href 
                      })}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Specialties */}
            <div className="bg-white rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {tailor.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className={`px-3 py-2 rounded-full text-sm font-medium ${getSpecialtyColor(specialty)}`}
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Tabs */}
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {[
                    { id: 'portfolio', label: 'Portfolio', count: tailor.portfolio.length },
                    { id: 'reviews', label: 'Reviews', count: tailor.reviewCount },
                    { id: 'about', label: 'About' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'portfolio' | 'reviews' | 'about')}
                      className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-600 text-primary-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                      {tab.count && (
                        <span className="ml-2 text-sm text-gray-500">({tab.count})</span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === 'portfolio' && <PortfolioGallery portfolio={tailor.portfolio} />}
                {activeTab === 'reviews' && <ReviewsList tailorId={tailor.id} />}
                {activeTab === 'about' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {tailor.description}
                    </p>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h4>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <p className="text-gray-700">
                        <strong>Days:</strong> {tailor.availability.workingDays.join(', ')}
                      </p>
                      <p className="text-gray-700">
                        <strong>Hours:</strong> {tailor.availability.workingHours.start} - {tailor.availability.workingHours.end}
                      </p>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Base Price</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatPrice(tailor.pricing.basePrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Complex Work</p>
                          <p className="text-lg font-semibold text-gray-900">
                            +{formatPrice(tailor.pricing.pricePerComplexity)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Rush Orders</p>
                          <p className="text-lg font-semibold text-gray-900">
                            +{formatPrice(tailor.pricing.rush)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-80">
            {/* Quick Contact */}
            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <QuickChatButton
                  tailorId={tailor.id}
                  tailorName={tailor.firstName}
                  variant="button"
                  className="w-full justify-start"
                />
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowVideoConsultation(true)}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Schedule Video Call
                </Button>
              </div>
            </div>
            
            {/* Response Time */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Typical response:</span>
                  <span className="font-medium text-gray-900">2-4 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order processing:</span>
                  <span className="font-medium text-gray-900">1-2 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion time:</span>
                  <span className="font-medium text-gray-900">2-4 weeks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Consultation Modal */}
      <VideoConsultation
        tailorId={tailor.id}
        tailorName={`${tailor.firstName} ${tailor.lastName}`}
        isOpen={showVideoConsultation}
        onClose={() => setShowVideoConsultation(false)}
      />
    </div>
  )
}

export default TailorProfile