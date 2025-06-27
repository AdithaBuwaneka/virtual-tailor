// src/components/chat/VideoConsultation.tsx
import React, { useState } from 'react'
import { Video, Calendar, Clock } from 'lucide-react'
import { Button, Modal } from '@/components/ui'

interface VideoConsultationProps {
  tailorId: string
  tailorName: string
  isOpen: boolean
  onClose: () => void
}

export const VideoConsultation: React.FC<VideoConsultationProps> = ({
  tailorId,
  tailorName,
  isOpen,
  onClose
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  
  // Mock available time slots
  const timeSlots = [
    { id: '1', date: '2024-02-15', time: '10:00 AM', available: true },
    { id: '2', date: '2024-02-15', time: '2:00 PM', available: true },
    { id: '3', date: '2024-02-15', time: '4:00 PM', available: false },
    { id: '4', date: '2024-02-16', time: '11:00 AM', available: true },
    { id: '5', date: '2024-02-16', time: '3:00 PM', available: true },
  ]
  
  const handleBookConsultation = () => {
    if (selectedSlot) {
      // Handle booking logic
      console.log('Booking consultation:', { tailorId, selectedSlot })
      onClose()
    }
  }
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Video Consultation"
      size="md"
    >
      <div className="space-y-6">
        <div className="text-center">
          <Video className="h-12 w-12 text-primary-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Video Consultation with {tailorName}
          </h3>
          <p className="text-gray-600 mt-1">
            Discuss your measurements, style preferences, and design details
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Available Time Slots</h4>
          <div className="grid grid-cols-1 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => slot.available && setSelectedSlot(slot.id)}
                disabled={!slot.available}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  selectedSlot === slot.id
                    ? 'border-primary-500 bg-primary-50'
                    : slot.available
                    ? 'border-gray-200 hover:border-gray-300'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{slot.date}</span>
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{slot.time}</span>
                  </div>
                  {!slot.available && (
                    <span className="text-xs text-gray-500">Unavailable</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">What to expect:</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 30-minute consultation session</li>
            <li>• Review AI-generated measurements</li>
            <li>• Discuss fabric and style options</li>
            <li>• Get professional tailoring advice</li>
          </ul>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleBookConsultation}
            disabled={!selectedSlot}
          >
            Book Consultation
          </Button>
        </div>
      </div>
    </Modal>
  )
}