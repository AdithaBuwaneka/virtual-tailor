// src/components/chat/ConversationHeader.tsx
import React from 'react'
import { ArrowLeft, Phone, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui'
import type { ChatConversation } from '@/store/chatStore'

interface ConversationHeaderProps {
  conversation: ChatConversation
  onBack?: () => void
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
  onBack
}) => {
  const otherParticipant = conversation.participants.find(p => p.name !== 'You')
  
  return (
    <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div className="relative">
            <img
              src={otherParticipant?.avatar || `https://ui-avatars.com/api/?name=${otherParticipant?.name}&background=6366f1&color=white`}
              alt={otherParticipant?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {otherParticipant?.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">{otherParticipant?.name}</h3>
            <p className="text-sm text-gray-600">
              {otherParticipant?.isOnline ? 'Online' : `Last seen ${otherParticipant?.lastSeen}`}
              {conversation.orderId && ` • Order #${conversation.orderId.slice(-6)}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}