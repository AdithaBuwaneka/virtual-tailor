// src/store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser, LoginCredentials, CustomerRegistration, TailorRegistration } from '@/types'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (userData: CustomerRegistration | TailorRegistration, userType: 'customer' | 'tailor') => Promise<void>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

// Mock API service for authentication
class AuthService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    await this.delay(1000) // Simulate API call
    
    // Mock validation
    if (credentials.email === 'admin@virtualtailor.com') {
      return {
        user: {
          id: '1',
          email: credentials.email,
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          isVerified: true
        },
        token: 'mock_admin_token'
      }
    } else if (credentials.email === 'tailor@example.com') {
      return {
        user: {
          id: '2',
          email: credentials.email,
          firstName: 'John',
          lastName: 'Tailor',
          role: 'tailor',
          isVerified: true
        },
        token: 'mock_tailor_token'
      }
    } else if (credentials.email === 'customer@example.com') {
      return {
        user: {
          id: '3',
          email: credentials.email,
          firstName: 'Jane',
          lastName: 'Customer',
          role: 'customer',
          isVerified: true
        },
        token: 'mock_customer_token'
      }
    }
    
    // For any other email, create a customer account
    if (credentials.password === 'password') {
      return {
        user: {
          id: '4',
          email: credentials.email,
          firstName: 'Demo',
          lastName: 'User',
          role: 'customer',
          isVerified: true
        },
        token: 'mock_demo_token'
      }
    }
    
    throw new Error('Invalid credentials')
  }
  
  async registerCustomer(userData: CustomerRegistration): Promise<{ user: AuthUser; token: string }> {
    await this.delay(1500) // Simulate API call
    
    // Mock email check
    if (userData.email === 'existing@example.com') {
      throw new Error('Email already exists')
    }
    
    return {
      user: {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'customer',
        isVerified: false
      },
      token: 'mock_new_customer_token'
    }
  }
  
  async registerTailor(userData: TailorRegistration): Promise<{ user: AuthUser; token: string }> {
    await this.delay(2000) // Simulate API call
    
    // Mock email check
    if (userData.email === 'existing@example.com') {
      throw new Error('Email already exists')
    }
    
    return {
      user: {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'tailor',
        isVerified: false
      },
      token: 'mock_new_tailor_token'
    }
  }
}

const authService = new AuthService()

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null })
          const { user, token } = await authService.login(credentials)
          set({ user, token, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          })
          throw error
        }
      },
      
      register: async (userData: CustomerRegistration | TailorRegistration, userType: 'customer' | 'tailor') => {
        try {
          set({ isLoading: true, error: null })
          const result = userType === 'customer' 
            ? await authService.registerCustomer(userData as CustomerRegistration)
            : await authService.registerTailor(userData as TailorRegistration)
          
          set({ user: result.user, token: result.token, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false 
          })
          throw error
        }
      },
      
      logout: () => {
        set({ user: null, token: null, error: null })
      },
      
      clearError: () => {
        set({ error: null })
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      })
    }
  )
)