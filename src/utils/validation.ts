// src/utils/validation.ts
export interface ValidationRule<T = unknown> {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: T, data?: Record<string, unknown>) => string | undefined
}

export interface ValidationSchema {
  [key: string]: ValidationRule<unknown>
}

export type FormValue = string | number | boolean | null | undefined;

export const validateField = (value: FormValue, rules: ValidationRule<FormValue>): string | undefined => {
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return 'This field is required'
  }
  
  if (value && typeof value === 'string' && rules.minLength && value.length < rules.minLength) {
    return `Minimum length is ${rules.minLength} characters`
  }
  
  if (value && typeof value === 'string' && rules.maxLength && value.length > rules.maxLength) {
    return `Maximum length is ${rules.maxLength} characters`
  }
  
  if (value && typeof value === 'string' && rules.pattern && !rules.pattern.test(value)) {
    return 'Invalid format'
  }
  
  if (value !== undefined && rules.custom) {
    return rules.custom(value)
  }
  
  return undefined
}

export const validateForm = (data: Record<string, FormValue>, schema: ValidationSchema): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  Object.keys(schema).forEach(field => {
    const error = validateField(data[field], schema[field] as ValidationRule<FormValue>)
    if (error) {
      errors[field] = error
    }
  })
  
  return errors
}

// Common validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-()]+$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
}

// Validation schemas
export const customerRegistrationSchema: ValidationSchema = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  email: {
    required: true,
    pattern: validationPatterns.email
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: unknown) => {
      if (typeof value === 'string' && !validationPatterns.strongPassword.test(value)) {
        return 'Password must contain uppercase, lowercase, number and special character'
      }
      return undefined;
    }
  },
  confirmPassword: {
    required: true,
    custom: (value: unknown, data?: Record<string, unknown>) => {
      if (typeof value === 'string' && data && value !== data.password) {
        return 'Passwords do not match'
      }
      return undefined;
    }
  }
}

export const tailorRegistrationSchema: ValidationSchema = {
  ...customerRegistrationSchema,
  businessName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  phone: {
    required: true,
    pattern: validationPatterns.phone
  },
  experience: {
    required: true,
    custom: (value: unknown) => {
      if (typeof value === 'number' && (value < 0 || value > 50)) {
        return 'Experience must be between 0 and 50 years'
      }
      return undefined;
    }
  }
}

export const loginSchema: ValidationSchema = {
  email: {
    required: true,
    pattern: validationPatterns.email
  },
  password: {
    required: true,
    minLength: 1
  }
}