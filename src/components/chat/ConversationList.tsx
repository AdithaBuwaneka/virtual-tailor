// src/components/chat/ConversationList.tsx
import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import type { ChatConversation } from '@/store/chatStore'

interface ConversationListProps {
  conversations: ChatConversation[]
  activeConversationId: string | null
  onSelectConversation: (conversationId: string) => void
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation
}) => {
  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-400 mb-2">💬</div>
        <p className="text-gray-600 text-sm">No conversations yet</p>
        <p className="text-gray-500 text-xs mt-1">
          Start chatting with tailors from your orders
        </p>
      </div>
    )
  }
  
  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conversation) => {
        const otherParticipant = conversation.participants.find(p => p.name !== 'You')
        const isActive = conversation.id === activeConversationId
        
        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              isActive ? 'bg-primary-50 border-r-2 border-primary-600' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <img
                  src={otherParticipant?.avatar || `https://ui-avatars.com/api/?name=${otherParticipant?.name}&background=6366f1&color=white`}
                  alt={otherParticipant?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {otherParticipant?.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium truncate ${
                    isActive ? 'text-primary-900' : 'text-gray-900'
                  }`}>
                    {otherParticipant?.name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {conversation.lastMessage && (
                      <span className={`text-xs ${
                        isActive ? 'text-primary-600' : 'text-gray-500'
                      }`}>
                        {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                      </span>
                    )}
                    {conversation.unreadCount > 0 && (
                      <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-sm truncate ${
                    isActive ? 'text-primary-700' : 'text-gray-600'
                  }`}>
                    {conversation.lastMessage?.content || 'No messages yet'}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    otherParticipant?.role === 'tailor' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {otherParticipant?.role}
                  </span>
                </div>
                
                {conversation.orderId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Order #{conversation.orderId.slice(-6)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}