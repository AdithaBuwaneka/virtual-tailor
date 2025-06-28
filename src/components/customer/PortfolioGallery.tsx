// src/components/customer/PortfolioGallery.tsx
import React, { useState } from 'react'
import { ExternalLink, Clock, DollarSign } from 'lucide-react'
import { Button, Modal } from '@/components/ui'
import type { PortfolioItem } from '@/types'
import { formatPrice } from '@/utils/tailorHelpers'

interface PortfolioGalleryProps {
  portfolio: PortfolioItem[]
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ portfolio }) => {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  
  if (portfolio.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          📸
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio items yet</h3>
        <p className="text-gray-600">This tailor hasn't added any portfolio items.</p>
      </div>
    )
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="aspect-w-4 aspect-h-5 bg-gray-100">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {item.completionTime} days
                </div>
                <div className="flex items-center font-semibold text-gray-900">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {formatPrice(item.price)}
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{item.tags.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Portfolio Item Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title}
        size="lg"
      >
        {selectedItem && (
          <div>
            <img
              src={selectedItem.images[0]}
              alt={selectedItem.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            
            <p className="text-gray-700 mb-4">{selectedItem.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium capitalize">{selectedItem.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion Time</p>
                <p className="font-medium">{selectedItem.completionTime} days</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(selectedItem.price)}
              </span>
              <Button>
                <ExternalLink className="h-4 w-4 mr-2" />
                Order Similar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}