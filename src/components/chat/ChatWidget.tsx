// src/components/chat/ChatWidget.tsx
import React, { useState } from 'react'
import { MessageCircle, X, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { useChat } from '@/hooks/useChat'
import { ChatInterface } from './ChatInterface'

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const { totalUnreadCount } = useChat()
  
  const toggleWidget = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }
  
  const minimizeWidget = () => {
    setIsMinimized(true)
  }
  
  const closeWidget = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }
  
  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className={`fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[32rem]'
        } transition-all duration-300`}>
          {isMinimized ? (
            // Minimized State
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-primary-600" />
                <span className="font-medium text-gray-900">Messages</span>
                {totalUnreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {totalUnreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(false)}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeWidget}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            // Full Widget
            <>
              <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-primary-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">Messages</span>
                  {totalUnreadCount > 0 && (
                    <span className="bg-white text-primary-600 text-xs rounded-full px-2 py-1">
                      {totalUnreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={minimizeWidget}
                    className="text-white hover:bg-primary-700"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeWidget}
                    className="text-white hover:bg-primary-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="h-[calc(100%-4rem)] overflow-hidden">
                <ChatInterface
                  className="h-full"
                  isMobile={false}
                  onClose={closeWidget}
                />
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={toggleWidget}
          className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </span>
            )}
          </div>
        </Button>
      )}
    </>
  )
}