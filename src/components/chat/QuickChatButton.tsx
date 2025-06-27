// src/components/chat/QuickChatButton.tsx
import React from 'react'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'

interface QuickChatButtonProps {
  tailorId: string
  tailorName: string
  orderId?: string
  variant?: 'button' | 'link'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const QuickChatButton: React.FC<QuickChatButtonProps> = ({
  tailorId,
  tailorName,
  orderId,
  variant = 'button',
  size = 'md',
  className = ''
}) => {
  const navigate = useNavigate()
  
  const handleStartChat = () => {
    const params = new URLSearchParams({ tailorId })
    if (orderId) params.append('orderId', orderId)
    navigate(`/customer/chat?${params.toString()}`)
  }
  
  if (variant === 'link') {
    return (
      <button
        onClick={handleStartChat}
        className={`flex items-center text-primary-600 hover:text-primary-700 transition-colors ${className}`}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Chat with {tailorName}
      </button>
    )
  }
  
  return (
    <Button
      onClick={handleStartChat}
      size={size}
      className={className}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      Chat with {tailorName}
    </Button>
  )
}