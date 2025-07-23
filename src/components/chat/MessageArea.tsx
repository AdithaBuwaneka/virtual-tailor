// src/components/chat/MessageArea.tsx
import React, { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import type { ChatMessage } from '@/store/chatStore'

interface MessageAreaProps {
  messages: ChatMessage[]
  conversationId: string
}

export const MessageArea: React.FC<MessageAreaProps> = ({
  messages,
  conversationId
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">👋</div>
          <p className="text-gray-600">Start the conversation!</p>
          <p className="text-gray-500 text-sm mt-1">
            Send a message to begin chatting
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.map((message, index) => {
        const prevMessage = index > 0 ? messages[index - 1] : null
        const nextMessage = index < messages.length - 1 ? messages[index + 1] : null
        
        const showAvatar = !nextMessage || nextMessage.senderId !== message.senderId
        const showTimestamp = !prevMessage || 
          prevMessage.senderId !== message.senderId ||
          new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 300000 // 5 minutes
        
        return (
          <MessageBubble
            key={message.id}
            message={message}
            showAvatar={showAvatar}
            showTimestamp={showTimestamp}
          />
        )
      })}
      
      <TypingIndicator conversationId={conversationId} />
      <div ref={messagesEndRef} />
    </div>
  )
}
