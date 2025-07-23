// src/types/user.ts
import type { AuthUser } from './auth'
import type { MeasurementProfile } from './measurement'

export interface Customer extends AuthUser {
  role: 'customer';
  measurements?: MeasurementProfile[];
  orders?: string[];
  preferences?: {
    preferredStyles: string[];
    culturalBackground?: string;
    notifications: boolean;
  };
  [key: string]: unknown;
}

export interface Tailor extends AuthUser {
  role: 'tailor';
  businessName: string;
  experience: number;
  specialties: string[];
  location: string;
  description: string;
  portfolio: PortfolioItem[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  pricing: {
    basePrice: number;
    pricePerComplexity: number;
    rush: number;
  };
  availability: {
    workingDays: string[];
    workingHours: {
      start: string;
      end: string;
    };
  };
  [key: string]: unknown;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  tags: string[];
  completionTime: number;
  price: number;
}
