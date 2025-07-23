// src/components/chat/MessageBubble.tsx
import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Download, Eye } from 'lucide-react'
import type { ChatMessage } from '@/store/chatStore'

interface MessageBubbleProps {
  message: ChatMessage
  showAvatar?: boolean
  showTimestamp?: boolean
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showAvatar = true,
  showTimestamp = true
}) => {
  const isOwn = message.senderName === 'You'
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  // Handle system messages differently
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-100 text-gray-600 text-xs px-3 py-2 rounded-full max-w-xs text-center">
          <p className="italic">{message.content}</p>
          {showTimestamp && (
            <p className="text-xs text-gray-400 mt-1">
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </p>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${showTimestamp ? 'mt-4' : 'mt-1'}`}>
      <div className={`flex items-end space-x-2 max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {!isOwn && showAvatar && (
          <img
            src={message.senderAvatar || `https://ui-avatars.com/api/?name=${message.senderName}&background=6366f1&color=white`}
            alt={message.senderName}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        
        {!isOwn && !showAvatar && (
          <div className="w-8 h-8" />
        )}
        
        <div className={`relative px-4 py-2 rounded-2xl ${
          isOwn 
            ? 'bg-primary-600 text-white' 
            : 'bg-white text-gray-900 shadow-sm border border-gray-200'
        }`}>
          {showTimestamp && !isOwn && (
            <p className="text-xs text-gray-500 mb-1">{message.senderName}</p>
          )}
          
          {message.type === 'text' && (
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          )}
          
          {message.type === 'image' && (
            <div className="space-y-2">
              <img
                src={message.fileUrl}
                alt={message.fileName}
                className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90"
                onClick={() => window.open(message.fileUrl, '_blank')}
              />
              <p className="text-xs opacity-75">{message.fileName}</p>
            </div>
          )}
          
          {message.type === 'file' && (
            <div className={`flex items-center space-x-3 p-2 rounded-lg ${
              isOwn ? 'bg-primary-500 bg-opacity-20' : 'bg-gray-100'
            }`}>
              <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
                📄
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {message.fileName}
                </p>
                {message.fileSize && (
                  <p className="text-xs text-gray-600">
                    {formatFileSize(message.fileSize)}
                  </p>
                )}
              </div>
              <div className="flex space-x-1">
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Download className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
          
          
          <div className={`flex items-center justify-between mt-1 ${
            isOwn ? 'text-white' : 'text-gray-500'
          }`}>
            <span className="text-xs opacity-75">
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </span>
            {isOwn && (
              <span className="text-xs opacity-75">
                {message.isRead ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}