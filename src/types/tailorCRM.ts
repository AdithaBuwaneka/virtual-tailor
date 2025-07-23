// types/tailorCRM.ts - Customer Relationship Management Types
export interface CustomerProfile {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    dateOfBirth?: Date;
    location: {
      city: string;
      country: string;
      timezone: string;
    };
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      linkedin?: string;
    };
  };
  
  businessMetrics: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lifetimeValue: number;
    firstOrderDate: Date;
    lastOrderDate?: Date;
    orderFrequency: number; // orders per year
    churnRisk: 'low' | 'medium' | 'high';
    loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  };
  
  preferences: {
    garmentTypes: string[];
    preferredStyles: string[];
    favoriteColors: string[];
    materialPreferences: string[];
    budgetRange: { min: number; max: number };
    preferredTimeline: number; // weeks
    communicationPreference: 'email' | 'phone' | 'chat' | 'video';
    meetingPreference: 'in-person' | 'virtual' | 'flexible';
  };
  
  measurements: {
    profiles: CustomerMeasurementProfile[];
    lastUpdated: Date;
    notes: string;
    fitPreferences: string[];
  };
  
  communication: {
    totalMessages: number;
    responseRate: number; // percentage
    averageResponseTime: number; // hours
    preferredContactTime: string;
    languagePreference: string;
    lastContact: Date;
  };
  
  feedback: {
    averageRating: number;
    totalReviews: number;
    satisfactionScore: number;
    recommendationLikelihood: number; // NPS score
    commonCompliments: string[];
    areasForImprovement: string[];
  };
  
  notes: CustomerNote[];
  tags: string[];
  customFields: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerMeasurementProfile {
  id: string;
  name: string;
  measurements: Record<string, number>;
  confidenceScores: Record<string, number>;
  createdAt: Date;
  isActive: boolean;
  notes?: string;
}

export interface CustomerNote {
  id: string;
  type: 'general' | 'preference' | 'measurement' | 'feedback' | 'follow-up';
  content: string;
  isPrivate: boolean;
  createdAt: Date;
  createdBy: string;
  attachments?: string[];
}

export interface CommunicationRecord {
  id: string;
  customerId: string;
  type: 'email' | 'phone' | 'chat' | 'video' | 'in-person' | 'social';
  direction: 'inbound' | 'outbound';
  subject?: string;
  summary: string;
  content?: string;
  duration?: number; // minutes
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  attachments?: string[];
  createdAt: Date;
  tags: string[];
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    totalSpent?: { min?: number; max?: number };
    orderCount?: { min?: number; max?: number };
    lastOrderDays?: number;
    loyaltyTier?: string[];
    garmentTypes?: string[];
    location?: string[];
    churnRisk?: string[];
  };
  customerCount: number;
  totalValue: number;
  createdAt: Date;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  tiers: LoyaltyTier[];
  benefits: LoyaltyBenefit[];
  isActive: boolean;
}

export interface LoyaltyTier {
  name: string;
  threshold: number; // total spent to reach this tier
  benefits: string[];
  color: string;
}

export interface LoyaltyBenefit {
  id: string;
  name: string;
  description: string;
  type: 'discount' | 'freebie' | 'priority' | 'exclusive';
  value: number;
  applicableTiers: string[];
}