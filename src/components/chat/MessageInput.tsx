// src/components/chat/MessageInput.tsx
import React, { useState, useRef, useCallback } from 'react'
import { Send, Paperclip, Smile, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { useChat } from '@/hooks/useChat'
import { FileUpload } from './FileUpload'

interface MessageInputProps {
  conversationId: string
}

export const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
  const { sendMessage, uploadFile, startTyping, stopTyping } = useChat()
  const [message, setMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const handleTyping = useCallback(() => {
    startTyping(conversationId)
    
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }
    
    const timeout = setTimeout(() => {
      stopTyping(conversationId)
    }, 2000)
    
    setTypingTimeout(timeout)
  }, [conversationId, startTyping, stopTyping, typingTimeout])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    handleTyping()
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }
  
  const handleSend = async () => {
    if (!message.trim()) return
    
    try {
      await sendMessage(conversationId, message.trim())
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
      stopTyping(conversationId)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  
  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true)
    setShowFileUpload(false)
    
    try {
      for (const file of files) {
        await uploadFile(conversationId, file)
      }
    } catch (error) {
      console.error('Failed to upload file:', error)
    } finally {
      setIsUploading(false)
    }
  }
  
  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      {/* File Upload Modal */}
      {showFileUpload && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Upload Files</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFileUpload(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <FileUpload
            onFilesSelected={handleFileUpload}
            maxFiles={5}
            maxSize={10 * 1024 * 1024} // 10MB
          />
        </div>
      )}
      
      {/* Message Input */}
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[44px] max-h-32"
            rows={1}
            disabled={isUploading}
          />
          
          {/* Input Actions */}
          <div className="absolute right-2 bottom-2 flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFileUpload(!showFileUpload)}
              disabled={isUploading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isUploading}
          className="rounded-full w-11 h-11 p-0"
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Character Limit */}
      {message.length > 800 && (
        <div className="mt-2 text-right">
          <span className={`text-xs ${
            message.length > 1000 ? 'text-red-500' : 'text-yellow-600'
          }`}>
            {message.length}/1000
          </span>
        </div>
      )}
    </div>
  )
}