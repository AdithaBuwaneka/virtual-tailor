
// src/hooks/useAuth.ts
import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const { user, token, isLoading, error, login, register, logout, clearError } = useAuthStore()
  
  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    clearError
  }
}