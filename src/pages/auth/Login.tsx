// src/pages/auth/Login.tsx
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from '@/hooks/useForm'
import { loginSchema } from '@/utils/validation'
import type { LoginCredentials } from '@/types'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError, user } = useAuth()
  const [showPassword, setShowPassword] = React.useState(false)
  
  const { values, errors, touched, isSubmitting, setValue, setFieldTouched, handleSubmit } = useForm<LoginCredentials>({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: async (formValues) => {
      try {
        await login(formValues)
        toast.success('Welcome back!')
      } catch {
        // Error is handled in the store
      }
    }
  })
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(`/${user.role}/dashboard`)
    }
  }, [user, navigate])
  
  // Clear errors when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-tailor-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="text-3xl font-display font-bold text-gradient mb-2">
              VirtualTailor
            </div>
          </Link>
          <h2 className="text-3xl font-display font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center font-medium">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
              onBlur={() => setFieldTouched('email')}
              error={touched.email ? errors.email : undefined}
              leftIcon={<Mail className="h-5 w-5" />}
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={values.password}
              onChange={(e) => setValue('password', e.target.value)}
              onBlur={() => setFieldTouched('password')}
              error={touched.password ? errors.password : undefined}
              leftIcon={<Lock className="h-5 w-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              }
              required
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <Link
                to="/auth/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting || isLoading}
              disabled={isSubmitting || isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts:</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div><strong>Customer:</strong> customer@example.com / password</div>
              <div><strong>Tailor:</strong> tailor@example.com / password</div>
              <div><strong>Admin:</strong> admin@virtualtailor.com / password</div>
            </div>
          </div>

          {/* Sign Up Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                to="/register/customer"
                className="flex-1 bg-primary-50 text-primary-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors text-center"
              >
                Sign up as Customer
              </Link>
              <Link
                to="/register/tailor"
                className="flex-1 bg-tailor-50 text-tailor-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-tailor-100 transition-colors text-center"
              >
                Join as Tailor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login