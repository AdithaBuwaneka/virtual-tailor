// src/components/chat/ChatInterface.tsx
import React, { useEffect, useState } from 'react'
import { MessageCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui'
import { useChat } from '@/hooks/useChat'
import { ConversationList } from './ConversationList'
import { MessageArea } from './MessageArea'
import { MessageInput } from './MessageInput'
import { ConversationHeader } from './ConversationHeader'

interface ChatInterfaceProps {
  className?: string
  isMobile?: boolean
  onClose?: () => void
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  className = '',
  isMobile = false,
  onClose
}) => {
  const { 
    conversations, 
    activeConversation, 
    activeConversationData,
    activeMessages,
    isLoading,
    loadConversations,
    setActiveConversation
  } = useChat()
  
  const [showConversationList, setShowConversationList] = useState(!isMobile || !activeConversation)
  
  useEffect(() => {
    loadConversations()
  }, [loadConversations])
  
  useEffect(() => {
    if (isMobile) {
      setShowConversationList(!activeConversation)
    }
  }, [activeConversation, isMobile])
  
  const handleSelectConversation = (conversationId: string) => {
    setActiveConversation(conversationId)
    if (isMobile) {
      setShowConversationList(false)
    }
  }
  
  const handleBackToList = () => {
    if (isMobile) {
      setActiveConversation(null)
      setShowConversationList(true)
    }
  }
  
  if (isLoading && conversations.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`flex h-full bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Conversation List */}
      <div className={`${
        isMobile 
          ? (showConversationList ? 'w-full' : 'hidden') 
          : 'w-80 border-r border-gray-200'
      } flex flex-col`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversation}
            onSelectConversation={handleSelectConversation}
          />
        </div>
      </div>
      
      {/* Chat Area */}
      <div className={`${
        isMobile 
          ? (showConversationList ? 'hidden' : 'w-full') 
          : 'flex-1'
      } flex flex-col`}>
        {activeConversationData ? (
          <>
            <ConversationHeader
              conversation={activeConversationData}
              onBack={isMobile ? handleBackToList : undefined}
            />
            
            <div className="flex-1 overflow-hidden">
              <MessageArea
                messages={activeMessages}
                conversationId={activeConversation!}
              />
            </div>
            
            <MessageInput conversationId={activeConversation!} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-600">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}