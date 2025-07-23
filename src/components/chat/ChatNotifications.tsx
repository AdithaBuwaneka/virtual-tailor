// src/components/chat/ChatNotifications.tsx
import React, { useEffect } from 'react'
import { X, MessageCircle, UserCheck, Package } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import type { ChatNotification } from '@/store/chatStore'

export const ChatNotifications: React.FC = () => {
  const { notifications, removeNotification } = useChat()
  
  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    notifications.forEach(notification => {
      if (!notification.isRead) {
        setTimeout(() => {
          removeNotification(notification.id)
        }, 5000)
      }
    })
  }, [notifications, removeNotification])
  
  const getIcon = (type: ChatNotification['type']) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-5 w-5" />
      case 'online':
        return <UserCheck className="h-5 w-5" />
      case 'order_update':
        return <Package className="h-5 w-5" />
      default:
        return <MessageCircle className="h-5 w-5" />
    }
  }
  
  const getColors = (type: ChatNotification['type']) => {
    switch (type) {
      case 'message':
        return 'bg-blue-500 text-white'
      case 'online':
        return 'bg-green-500 text-white'
      case 'order_update':
        return 'bg-purple-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }
  
  if (notifications.length === 0) return null
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.slice(0, 3).map((notification) => (
        <div
          key={notification.id}
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-slide-in"
        >
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-full ${getColors(notification.type)}`}>
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{notification.title}</p>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}