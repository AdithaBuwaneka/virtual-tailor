// src/pages/auth/CustomerRegister.tsx
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from '@/hooks/useForm'
import { customerRegistrationSchema } from '@/utils/validation'
import type { CustomerRegistration } from '@/types'

const CustomerRegister: React.FC = () => {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError, user } = useAuth()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  
  const { values, errors, touched, isSubmitting, setValue, setFieldTouched, handleSubmit } = useForm<CustomerRegistration & Record<string, unknown>>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: customerRegistrationSchema,
    onSubmit: async (formValues) => {
      try {
        await register(formValues as CustomerRegistration, 'customer')
        toast.success('Account created successfully! Welcome to VirtualTailor!')
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-tailor-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="text-3xl font-display font-bold text-gradient mb-2">
              VirtualTailor
            </div>
          </Link>
          <h2 className="text-3xl font-display font-bold text-gray-900">Join VirtualTailor</h2>
          <p className="mt-2 text-gray-600">Start your custom tailoring journey</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center font-medium">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                placeholder="John"
                value={values.firstName}
                onChange={(e) => setValue('firstName', e.target.value)}
                onBlur={() => setFieldTouched('firstName')}
                error={touched.firstName ? errors.firstName : undefined}
                leftIcon={<User className="h-5 w-5" />}
                required
                fullWidth
              />
              
              <Input
                label="Last Name"
                type="text"
                placeholder="Doe"
                value={values.lastName}
                onChange={(e) => setValue('lastName', e.target.value)}
                onBlur={() => setFieldTouched('lastName')}
                error={touched.lastName ? errors.lastName : undefined}
                leftIcon={<User className="h-5 w-5" />}
                required
                fullWidth
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
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
              placeholder="Create a strong password"
              value={values.password}
              onChange={(e) => setValue('password', e.target.value)}
              onBlur={() => setFieldTouched('password')}
              error={touched.password ? errors.password : undefined}
              helperText="Must contain uppercase, lowercase, number and special character"
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

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={values.confirmPassword}
              onChange={(e) => setValue('confirmPassword', e.target.value)}
              onBlur={() => setFieldTouched('confirmPassword')}
              error={touched.confirmPassword ? errors.confirmPassword : undefined}
              leftIcon={<Lock className="h-5 w-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              }
              required
            />

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting || isLoading}
              disabled={isSubmitting || isLoading}
            >
              Create Account
            </Button>
          </form>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-primary-50 rounded-lg">
            <h4 className="text-sm font-medium text-primary-900 mb-2">What you'll get:</h4>
            <ul className="text-xs text-primary-800 space-y-1">
              <li>✓ 3-minute AI measurement completion</li>
              <li>✓ Access to verified global tailors</li>
              <li>✓ Real-time order tracking</li>
              <li>✓ Cultural authenticity guarantee</li>
            </ul>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Want to join as a tailor?{' '}
              <Link to="/register/tailor" className="text-tailor-600 hover:text-tailor-700 font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerRegister
