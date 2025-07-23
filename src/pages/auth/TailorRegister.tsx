// src/pages/auth/TailorRegister.tsx
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Mail, Lock, User, Eye, EyeOff, Phone, Building2, Award } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from '@/hooks/useForm'
import { tailorRegistrationSchema } from '@/utils/validation'
import type { TailorRegistration } from '@/types'

const TailorRegister: React.FC = () => {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError, user } = useAuth()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  
  const { values, errors, touched, isSubmitting, setValue, setFieldTouched, handleSubmit } = useForm<TailorRegistration & Record<string, unknown>>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      businessName: '',
      phone: '',
      experience: 0,
      specialties: [],
      location: '',
      description: ''
    },
    validationSchema: tailorRegistrationSchema,
    onSubmit: async (formValues) => {
      try {
        await register(formValues, 'tailor')
        toast.success('Application submitted! We\'ll review and get back to you soon.')
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
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="text-3xl font-display font-bold text-gradient mb-2">
              VirtualTailor
            </div>
          </Link>
          <h2 className="text-3xl font-display font-bold text-gray-900">Join as Professional Tailor</h2>
          <p className="mt-2 text-gray-600">Share your craft with customers worldwide</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center font-medium">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
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
              
              <div className="grid grid-cols-2 gap-4 mt-4">
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
                  fullWidth
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={values.phone}
                  onChange={(e) => setValue('phone', e.target.value)}
                  onBlur={() => setFieldTouched('phone')}
                  error={touched.phone ? errors.phone : undefined}
                  leftIcon={<Phone className="h-5 w-5" />}
                  required
                  fullWidth
                />
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
              <Input
                label="Business Name"
                type="text"
                placeholder="John's Custom Tailoring"
                value={values.businessName}
                onChange={(e) => setValue('businessName', e.target.value)}
                onBlur={() => setFieldTouched('businessName')}
                error={touched.businessName ? errors.businessName : undefined}
                leftIcon={<Building2 className="h-5 w-5" />}
                required
              />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Input
                  label="Years of Experience"
                  type="number"
                  placeholder="5"
                  min="0"
                  max="50"
                  value={values.experience}
                  onChange={(e) => setValue('experience', parseInt(e.target.value) || 0)}
                  onBlur={() => setFieldTouched('experience')}
                  error={touched.experience ? errors.experience : undefined}
                  leftIcon={<Award className="h-5 w-5" />}
                  required
                  fullWidth
                />
                
                <Input
                  label="Location"
                  type="text"
                  placeholder="New York, NY"
                  value={values.location}
                  onChange={(e) => setValue('location', e.target.value)}
                  onBlur={() => setFieldTouched('location')}
                  error={touched.location ? errors.location : undefined}
                  required
                  fullWidth
                />
              </div>
            </div>

            {/* Account Security */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
              <div className="grid grid-cols-1 gap-4">
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
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-tailor-600 focus:ring-tailor-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-tailor-600 hover:text-tailor-700 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-tailor-600 hover:text-tailor-700 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              variant="tailor"
              fullWidth
              loading={isSubmitting || isLoading}
              disabled={isSubmitting || isLoading}
            >
              Submit Application
            </Button>
          </form>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-tailor-50 rounded-lg">
            <h4 className="text-sm font-medium text-tailor-900 mb-2">Tailor Benefits:</h4>
            <ul className="text-xs text-tailor-800 space-y-1">
              <li>✓ Global customer reach</li>
              <li>✓ AI-verified measurements</li>
              <li>✓ Business management tools</li>
              <li>✓ Fair commission structure</li>
            </ul>
          </div>

          {/* Sign In Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-tailor-600 hover:text-tailor-700 font-medium">
                Sign in
              </Link>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Looking for custom garments?{' '}
              <Link to="/register/customer" className="text-primary-600 hover:text-primary-700 font-medium">
                Join as Customer
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TailorRegister