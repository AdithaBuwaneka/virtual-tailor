// src/store/chatStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  recipientId: string
  content: string
  type: 'text' | 'image' | 'file' | 'measurement' | 'system'
  timestamp: string
  isRead: boolean
  fileUrl?: string
  fileName?: string
  fileSize?: number
  metadata?: {
    orderId?: string;
    measurementData?: unknown;
    systemEvent?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    [key: string]: unknown;
  }
}

export interface ChatConversation {
  id: string
  participantIds: string[]
  participants: {
    id: string
    name: string
    avatar?: string
    role: 'customer' | 'tailor'
    isOnline: boolean
    lastSeen?: string
  }[]
  lastMessage?: ChatMessage
  unreadCount: number
  orderId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TypingIndicator {
  conversationId: string
  userId: string
  userName: string
  timestamp: string
}

interface ChatState {
  conversations: ChatConversation[]
  messages: Record<string, ChatMessage[]>
  activeConversation: string | null
  typingIndicators: TypingIndicator[]
  isConnected: boolean
  isLoading: boolean
  error: string | null
  notifications: ChatNotification[]
  
  // Actions
  setActiveConversation: (conversationId: string | null) => void
  sendMessage: (conversationId: string, content: string, type?: ChatMessage['type'], metadata?: {
    orderId?: string;
    measurementData?: unknown;
    systemEvent?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    [key: string]: unknown;
  }) => Promise<void>
  uploadFile: (conversationId: string, file: File) => Promise<void>
  markAsRead: (conversationId: string, messageId?: string) => void
  loadConversations: () => Promise<void>
  loadMessages: (conversationId: string) => Promise<void>
  createConversation: (participantId: string, orderId?: string) => Promise<string>
  startTyping: (conversationId: string) => void
  stopTyping: (conversationId: string) => void
  setConnectionStatus: (connected: boolean) => void
  addNotification: (notification: ChatNotification) => void
  removeNotification: (id: string) => void
  clearError: () => void
}

export interface ChatNotification {
  id: string
  type: 'message' | 'typing' | 'online' | 'order_update'
  title: string
  message: string
  conversationId?: string
  timestamp: string
  isRead: boolean
}

// Mock Chat Service
class ChatService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  
  async getConversations(): Promise<ChatConversation[]> {
    await this.delay(800)
    
    // Mock conversations data
    return [
      {
        id: 'conv_1',
        participantIds: ['user_1', 'tailor_1'],
        participants: [
          {
            id: 'user_1',
            name: 'You',
            role: 'customer',
            isOnline: true
          },
          {
            id: 'tailor_1',
            name: 'Maria Santos',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
            role: 'tailor',
            isOnline: true,
            lastSeen: new Date().toISOString()
          }
        ],
        lastMessage: {
          id: 'msg_1',
          senderId: 'tailor_1',
          senderName: 'Maria Santos',
          recipientId: 'user_1',
          content: 'I\'ve reviewed your measurements and they look perfect! When would you like to start on your barong?',
          type: 'text',
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          isRead: false
        },
        unreadCount: 2,
        orderId: 'order_1',
        isActive: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: 'conv_2',
        participantIds: ['user_1', 'tailor_2'],
        participants: [
          {
            id: 'user_1',
            name: 'You',
            role: 'customer',
            isOnline: true
          },
          {
            id: 'tailor_2',
            name: 'Ahmed Hassan',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            role: 'tailor',
            isOnline: false,
            lastSeen: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
          }
        ],
        lastMessage: {
          id: 'msg_2',
          senderId: 'user_1',
          senderName: 'You',
          recipientId: 'tailor_2',
          content: 'Thank you for the fabric samples! I love the navy wool option.',
          type: 'text',
          timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          isRead: true
        },
        unreadCount: 0,
        orderId: 'order_2',
        isActive: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 7200000).toISOString()
      }
    ]
  }
  
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    await this.delay(500)
    
    // Mock messages data
    const messageMap: Record<string, ChatMessage[]> = {
      'conv_1': [
        {
          id: 'msg_1_1',
          senderId: 'user_1',
          senderName: 'You',
          recipientId: 'tailor_1',
          content: 'Hi Maria! I\'m excited to work with you on my traditional barong.',
          type: 'text',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          isRead: true
        },
        {
          id: 'msg_1_2',
          senderId: 'tailor_1',
          senderName: 'Maria Santos',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          recipientId: 'user_1',
          content: 'Hello! I\'m thrilled to create your barong. Let me review your AI-generated measurements first.',
          type: 'text',
          timestamp: new Date(Date.now() - 85800000).toISOString(),
          isRead: true
        },
        {
          id: 'msg_1_3',
          senderId: 'tailor_1',
          senderName: 'Maria Santos',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          recipientId: 'user_1',
          content: 'Your measurements look excellent! The AI did a great job. Here are some fabric options for your barong:',
          type: 'text',
          timestamp: new Date(Date.now() - 85200000).toISOString(),
          isRead: true
        },
        {
          id: 'msg_1_4',
          senderId: 'tailor_1',
          senderName: 'Maria Santos',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          recipientId: 'user_1',
          content: 'fabric_samples.jpg',
          type: 'image',
          timestamp: new Date(Date.now() - 85000000).toISOString(),
          isRead: true,
          fileUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
          fileName: 'fabric_samples.jpg'
        },
        {
          id: 'msg_1_5',
          senderId: 'user_1',
          senderName: 'You',
          recipientId: 'tailor_1',
          content: 'These look beautiful! I love the piña silk option. How long will it take?',
          type: 'text',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isRead: true
        },
        {
          id: 'msg_1_6',
          senderId: 'tailor_1',
          senderName: 'Maria Santos',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          recipientId: 'user_1',
          content: 'I\'ve reviewed your measurements and they look perfect! When would you like to start on your barong?',
          type: 'text',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          isRead: false
        }
      ],
      'conv_2': [
        {
          id: 'msg_2_1',
          senderId: 'tailor_2',
          senderName: 'Ahmed Hassan',
          senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          recipientId: 'user_1',
          content: 'Welcome! I\'ve received your suit order. Let me send you some fabric samples.',
          type: 'text',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          isRead: true
        },
        {
          id: 'msg_2_2',
          senderId: 'user_1',
          senderName: 'You',
          recipientId: 'tailor_2',
          content: 'Thank you for the fabric samples! I love the navy wool option.',
          type: 'text',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          isRead: true
        }
      ]
    }
    
    return messageMap[conversationId] || []
  }
  
  async sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead'>): Promise<ChatMessage> {
    await this.delay(200)
    
    return {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false
    }
  }
  
  async uploadFile(file: File): Promise<{ url: string; fileName: string; fileSize: number }> {
    await this.delay(1500) // Simulate upload time
    
    // Simulate file upload (in real app, upload to cloud storage)
    const url = URL.createObjectURL(file)
    
    return {
      url,
      fileName: file.name,
      fileSize: file.size
    }
  }
  
  async createConversation(participantIds: string[], orderId?: string): Promise<ChatConversation> {
    await this.delay(300)
    
    return {
      id: `conv_${Date.now()}`,
      participantIds,
      participants: [], // Would be populated from user data
      unreadCount: 0,
      orderId,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
}

const chatService = new ChatService()

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversation: null,
      typingIndicators: [],
      isConnected: false,
      isLoading: false,
      error: null,
      notifications: [],
      
      setActiveConversation: (conversationId) => {
        set({ activeConversation: conversationId })
        if (conversationId) {
          get().loadMessages(conversationId)
          get().markAsRead(conversationId)
        }
      },
      
      sendMessage: async (conversationId, content, type = 'text', metadata = {}) => {
        try {
          const state = get()
          const conversation = state.conversations.find(c => c.id === conversationId)
          if (!conversation) throw new Error('Conversation not found')
          
          const currentUser = 'user_1' // Would come from auth
          const recipient = conversation.participants.find(p => p.id !== currentUser)
          if (!recipient) throw new Error('Recipient not found')
          
          const newMessage = await chatService.sendMessage({
            senderId: currentUser,
            senderName: 'You',
            recipientId: recipient.id,
            content,
            type,
            metadata
          })
          
          set(state => ({
            messages: {
              ...state.messages,
              [conversationId]: [...(state.messages[conversationId] || []), newMessage]
            },
            conversations: state.conversations.map(conv =>
              conv.id === conversationId
                ? { ...conv, lastMessage: newMessage, updatedAt: newMessage.timestamp }
                : conv
            )
          }))
          
          // Simulate real-time response from tailor (for demo)
          if (type === 'text' && Math.random() > 0.5) {
            setTimeout(() => {
              const responses = [
                "Thank you for the message! I'll get back to you shortly.",
                "I'm working on your order and will update you soon.",
                "Great choice! That will look excellent on you.",
                "I've received your message and will respond within a few hours."
              ]
              
              const response = responses[Math.floor(Math.random() * responses.length)]
              get().sendMessage(conversationId, response, 'text')
            }, 2000 + Math.random() * 3000)
          }
          
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to send message' })
        }
      },
      
      uploadFile: async (conversationId, file) => {
        try {
          set({ isLoading: true })
          const { url, fileName, fileSize } = await chatService.uploadFile(file)
          
          await get().sendMessage(conversationId, fileName, file.type.startsWith('image/') ? 'image' : 'file', {
            fileUrl: url,
            fileName,
            fileSize
          })
          
          set({ isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to upload file',
            isLoading: false 
          })
        }
      },
      
      markAsRead: (conversationId, messageId) => {
        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? { ...conv, unreadCount: 0 }
              : conv
          ),
          messages: messageId ? {
            ...state.messages,
            [conversationId]: state.messages[conversationId]?.map(msg =>
              msg.id === messageId ? { ...msg, isRead: true } : msg
            ) || []
          } : {
            ...state.messages,
            [conversationId]: state.messages[conversationId]?.map(msg => ({ ...msg, isRead: true })) || []
          }
        }))
      },
      
      loadConversations: async () => {
        try {
          set({ isLoading: true, error: null })
          const conversations = await chatService.getConversations() // Would come from auth
          set({ conversations, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load conversations',
            isLoading: false 
          })
        }
      },
      
      loadMessages: async (conversationId) => {
        try {
          const state = get()
          if (state.messages[conversationId]) return // Already loaded
          
          set({ isLoading: true })
          const messages = await chatService.getMessages(conversationId)
          set(state => ({
            messages: { ...state.messages, [conversationId]: messages },
            isLoading: false
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load messages',
            isLoading: false 
          })
        }
      },
      
      createConversation: async (participantId, orderId) => {
        try {
          const conversation = await chatService.createConversation(['user_1', participantId], orderId)
          set(state => ({
            conversations: [conversation, ...state.conversations]
          }))
          return conversation.id
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create conversation' })
          throw error
        }
      },
      
      startTyping: (conversationId) => {
        // Would emit socket event in real implementation
        console.log('Started typing in', conversationId)
      },
      
      stopTyping: (conversationId) => {
        // Would emit socket event in real implementation
        console.log('Stopped typing in', conversationId)
      },
      
      setConnectionStatus: (connected) => {
        set({ isConnected: connected })
      },
      
      addNotification: (notification) => {
        set(state => ({
          notifications: [notification, ...state.notifications.slice(0, 9)] // Keep last 10
        }))
      },
      
      removeNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ 
        conversations: state.conversations,
        messages: state.messages 
      })
    }
  )
)