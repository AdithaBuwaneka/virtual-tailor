// src/pages/customer/Chat.tsx
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useChat } from '@/hooks/useChat'
import { ChatInterface } from '@/components/chat'

const Chat: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { createConversation, setActiveConversation } = useChat()
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if we need to create a new conversation
  const tailorId = searchParams.get('tailorId')
  const orderId = searchParams.get('orderId')
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  useEffect(() => {
    if (tailorId) {
      // Create or find conversation with this tailor
      createConversation(tailorId, orderId || undefined)
        .then(conversationId => {
          setActiveConversation(conversationId)
        })
    }
  }, [tailorId, orderId, createConversation, setActiveConversation])
  
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => window.history.back()} 
            className="text-primary-600 hover:text-primary-800 transition-colors flex items-center gap-2"
          >
            <span>&larr;</span> Back
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="max-w-4xl mx-auto h-full p-4">
          <ChatInterface isMobile={isMobile} className="h-full" />
        </div>
      </div>
    </div>
  )
}

export default Chat
