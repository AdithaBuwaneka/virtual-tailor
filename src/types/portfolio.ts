// types/portfolio.ts - Portfolio Management Types
export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  garmentType: string;
  style: string;
  techniques: string[];
  materials: string[];
  timeToComplete: number; // hours
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  price: number;
  currency: string;
  status: 'draft' | 'published' | 'featured' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  
  // Media
  images: PortfolioImage[];
  videos?: PortfolioVideo[];
  
  // Process Documentation
  processSteps: ProcessStep[];
  beforeAfter?: {
    before: string[];
    after: string[];
  };
  
  // Performance
  views: number;
  likes: number;
  inquiries: number;
  orders: number;
  rating: number;
  reviews: ProjectReview[];
  
  // SEO
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  
  // Measurements & Fit
  customerMeasurements?: Record<string, number>;
  fitNotes?: string;
  customizations: string[];
}

export interface PortfolioImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  type: 'hero' | 'detail' | 'process' | 'before' | 'after' | 'fitting';
  order: number;
  isPrivate: boolean;
}

export interface PortfolioVideo {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  description?: string;
  duration: number;
  type: 'process' | 'fitting' | 'showcase' | 'testimonial';
}

export interface ProcessStep {
  id: string;
  step: number;
  title: string;
  description: string;
  images: string[];
  timeSpent: number; // minutes
  techniques: string[];
  notes?: string;
}

export interface ProjectReview {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  isVerified: boolean;
}

export interface SkillCertification {
  id: string;
  name: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'master';
  issuedBy: string;
  issuedAt: Date;
  expiresAt?: Date;
  verificationCode: string;
  badgeUrl: string;
  skills: string[];
  projects: string[]; // Portfolio project IDs that demonstrate this skill
}

export interface PortfolioAnalytics {
  totalViews: number;
  totalLikes: number;
  totalInquiries: number;
  conversionRate: number;
  topPerformingProjects: PortfolioProject[];
  viewsByPeriod: { date: string; views: number }[];
  projectsByGarmentType: { type: string; count: number; revenue: number }[];
  skillDemand: { skill: string; demand: number; avgPrice: number }[];
  seoRanking: { keyword: string; position: number; searchVolume: number }[];
}