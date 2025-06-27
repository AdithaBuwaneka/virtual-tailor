// src/hooks/useForm.ts
import { useState, useCallback } from 'react'
import type { ValidationSchema } from '@/utils/validation'
import { validateForm as validateFormValues } from '@/utils/validation'

interface UseFormOptions<T> {
  initialValues: T
  validationSchema?: ValidationSchema
  onSubmit: (values: T) => Promise<void> | void
}

export const useForm = <T extends Record<string, unknown>>({
  initialValues,
  validationSchema,
  onSubmit
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const setValue = useCallback((field: keyof T, value: unknown) => {
    setValues(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as string]
        return newErrors
      })
    }
  }, [errors])
  
  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])
  
  const validateFields = useCallback(() => {
    if (!validationSchema) return true
    // Cast values to Record<string, FormValue> for validation
    const formErrors = validateFormValues(values as Record<string, import('@/utils/validation').FormValue>, validationSchema)
    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }, [values, validationSchema])
  
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    if (!validateFields()) {
      return
    }
    
    try {
      setIsSubmitting(true)
      await onSubmit(values)
    } catch {
      // Error handling is done in the onSubmit function
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validateFields, onSubmit])
  
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0
  }
}