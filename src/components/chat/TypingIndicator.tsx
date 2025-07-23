// src/components/chat/TypingIndicator.tsx
import React from 'react'
import { useChat } from '@/hooks/useChat'

interface TypingIndicatorProps {
  conversationId: string
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ conversationId }) => {
  const { typingIndicators } = useChat()
  
  const conversationTyping = typingIndicators.filter(t => t.conversationId === conversationId)
  
  if (conversationTyping.length === 0) return null
  
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-xs">👤</span>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-600">
            {conversationTyping[0].userName} is typing
          </span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}