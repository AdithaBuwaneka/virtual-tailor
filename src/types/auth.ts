// src/types/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface CustomerRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  [key: string]: unknown;
}

export interface TailorRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  businessName: string;
  experience: number;
  specialties: string[];
  location: string;
  description: string;
  [key: string]: unknown;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'tailor' | 'admin';
  avatar?: string;
  isVerified: boolean;
}