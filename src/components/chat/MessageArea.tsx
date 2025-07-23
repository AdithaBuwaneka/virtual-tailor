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
  const containerRef = useRef<HTMLDivElement>(null)
  const userScrolledRef = useRef(false)
  const lastScrollTopRef = useRef(0)
  
  const scrollToBottom = () => {
    if (containerRef.current && !userScrolledRef.current) {
      const container = containerRef.current
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          })
          lastScrollTopRef.current = container.scrollHeight
        })
      })
    }
  }
  
  const handleScroll = () => {
    if (containerRef.current) {
      const container = containerRef.current
      const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50
      
      // If user scrolled up, mark as user-scrolled
      if (container.scrollTop < lastScrollTopRef.current - 10) {
        userScrolledRef.current = true
      }
      
      // If user scrolled to bottom, reset user-scrolled flag
      if (isAtBottom) {
        userScrolledRef.current = false
      }
      
      lastScrollTopRef.current = container.scrollTop
    }
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
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto p-4 space-y-4 bg-gray-50"
    >
      {messages.map((message, index) => {
        const prevMessage = index > 0 ? messages[index - 1] : null
        const nextMessage = index < messages.length - 1 ? messages[index + 1] : null
        
        // Skip avatar/timestamp logic for system messages
        const showAvatar = message.type === 'system' ? false : 
          (!nextMessage || nextMessage.senderId !== message.senderId || nextMessage.type === 'system')
        const showTimestamp = message.type === 'system' ? true : 
          (!prevMessage || 
           prevMessage.senderId !== message.senderId ||
           prevMessage.type === 'system' ||
           new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 300000) // 5 minutes
        
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
