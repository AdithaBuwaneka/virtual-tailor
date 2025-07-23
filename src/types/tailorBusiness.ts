// types/tailorBusiness.ts - Tailor Business Analytics Types
export interface BusinessMetrics {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
    forecast: number;
    trend: 'up' | 'down' | 'stable';
  };
  orders: {
    total: number;
    completed: number;
    active: number;
    cancelled: number;
    completionRate: number;
    averageValue: number;
    repeatCustomerRate: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    retention: number;
    lifetime: number;
    satisfaction: number;
  };
  performance: {
    averageDeliveryTime: number;
    qualityRating: number;
    responseTime: number;
    capacity: number;
    efficiency: number;
  };
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  forecast?: number;
}

export interface CustomerInsight {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date;
  averageRating: number;
  preferences: {
    garmentTypes: string[];
    styles: string[];
    priceRange: { min: number; max: number };
    timeline: number;
  };
  lifetimeValue: number;
  riskLevel: 'low' | 'medium' | 'high';
  notes: string[];
}

export interface MarketInsight {
  trendingStyles: { name: string; growth: number; demand: number }[];
  seasonalTrends: { season: string; styles: string[]; revenue: number }[];
  competitorAnalysis: {
    averagePrice: number;
    averageRating: number;
    averageDeliveryTime: number;
    yourPosition: 'above' | 'below' | 'average';
  };
  recommendations: {
    type: 'pricing' | 'style' | 'marketing' | 'capacity';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'high' | 'medium' | 'low';
  }[];
}

// Add references to imported types
export type { CustomerProfile } from './tailorCRM';
export type { PortfolioProject } from './portfolio';
export type { InventoryItem, TimeEntry, CapacityPlan, AutomatedReport } from './businessOperations';