// src/hooks/useChat.ts
import { useChatStore } from '@/store/chatStore'

export const useChat = () => {
  const {
    conversations,
    messages,
    activeConversation,
    typingIndicators,
    isConnected,
    isLoading,
    error,
    notifications,
    setActiveConversation,
    sendMessage,
    uploadFile,
    markAsRead,
    loadConversations,
    loadMessages,
    createConversation,
    startTyping,
    stopTyping,
    setConnectionStatus,
    addNotification,
    removeNotification,
    clearError
  } = useChatStore()
  
  const activeMessages = activeConversation ? messages[activeConversation] || [] : []
  const activeConversationData = conversations.find(c => c.id === activeConversation)
  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0)
  
  return {
    // State
    conversations,
    messages,
    activeConversation,
    activeMessages,
    activeConversationData,
    typingIndicators,
    isConnected,
    isLoading,
    error,
    notifications,
    totalUnreadCount,
    
    // Actions
    setActiveConversation,
    sendMessage,
    uploadFile,
    markAsRead,
    loadConversations,
    loadMessages,
    createConversation,
    startTyping,
    stopTyping,
    setConnectionStatus,
    addNotification,
    removeNotification,
    clearError
  }
}