// src/components/customer/ReviewsList.tsx
import React from 'react'
import { Star, ThumbsUp } from 'lucide-react'

interface ReviewsListProps {
  tailorId: string
}

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    rating: 5,
    date: '2024-01-15',
    review: 'Absolutely fantastic work! The traditional barong was perfect for my wedding. Maria understood exactly what I wanted and delivered beyond expectations.',
    helpful: 12,
    verified: true
  },
  {
    id: '2',
    customerName: 'Michael Chen',
    rating: 5,
    date: '2024-01-10',
    review: 'Incredible attention to detail and cultural authenticity. The quality is outstanding and the fit is perfect. Highly recommend!',
    helpful: 8,
    verified: true
  },
  {
    id: '3',
    customerName: 'Lisa Rodriguez',
    rating: 4,
    date: '2024-01-05',
    review: 'Beautiful work and great communication throughout the process. Delivery was on time and the garment exceeded my expectations.',
    helpful: 5,
    verified: false
  }
]

export const ReviewsList: React.FC<ReviewsListProps> = () => {
  return (
    <div className="space-y-6">
      {mockReviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                {review.customerName[0]}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {review.customerName}
                  {review.verified && (
                    <span className="ml-2 text-xs text-green-600">✓ Verified</span>
                  )}
                </p>
                <p className="text-sm text-gray-600">{review.date}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <p className="text-gray-700 mb-3">{review.review}</p>
          
          <div className="flex items-center text-sm text-gray-500">
            <button className="flex items-center hover:text-gray-700">
              <ThumbsUp className="h-4 w-4 mr-1" />
              Helpful ({review.helpful})
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}