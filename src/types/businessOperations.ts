// types/businessOperations.ts - Business Operations Types
export interface InventoryItem {
  id: string;
  name: string;
  category: 'fabric' | 'thread' | 'button' | 'zipper' | 'lining' | 'interfacing' | 'trim' | 'tool' | 'equipment';
  subcategory: string;
  description: string;
  
  // Stock Management
  currentStock: number;
  unit: string; // yards, meters, pieces, spools, etc.
  minimumStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  maxStock: number;
  
  // Pricing
  costPerUnit: number;
  currency: string;
  supplier: string;
  supplierSku?: string;
  lastPurchasePrice: number;
  lastPurchaseDate?: Date;
  
  // Properties
  color?: string;
  material?: string;
  weight?: number;
  width?: number; // for fabrics
  composition?: string;
  careInstructions?: string;
  
  // Location & Organization
  location: string; // shelf, bin, room
  barcode?: string;
  images: string[];
  
  // Usage Tracking
  usageHistory: InventoryUsage[];
  reservedQuantity: number; // amount reserved for active orders
  availableQuantity: number; // current - reserved
  
  // Status
  status: 'active' | 'discontinued' | 'backordered' | 'low_stock' | 'out_of_stock';
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryUsage {
  id: string;
  orderId?: string;
  projectId?: string;
  quantityUsed: number;
  purpose: string; // "Order #123 - Suit jacket", "Sample creation", etc.
  usedAt: Date;
  usedBy: string;
  notes?: string;
}

export interface TimeEntry {
  id: string;
  tailorId: string;
  projectId?: string;
  orderId?: string;
  taskType: 'consultation' | 'design' | 'pattern_making' | 'cutting' | 'sewing' | 'fitting' | 'finishing' | 'admin' | 'marketing';
  taskDescription: string;
  
  // Time Tracking
  startTime: Date;
  endTime?: Date;
  totalMinutes: number;
  breakMinutes: number;
  productiveMinutes: number;
  
  // Billing
  hourlyRate: number;
  billableMinutes: number;
  totalCost: number;
  isBillable: boolean;
  clientRate?: number;
  
  // Productivity
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  qualityRating: 1 | 2 | 3 | 4 | 5;
  efficiency: number; // estimated vs actual time
  
  // Status
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  notes: string;
  attachments: string[];
  createdAt: Date;
}

export interface ProductivityMetrics {
  totalHours: number;
  billableHours: number;
  billabilityRate: number;
  averageHourlyRate: number;
  totalRevenue: number;
  
  // By Task Type
  taskBreakdown: {
    taskType: string;
    hours: number;
    percentage: number;
    revenue: number;
  }[];
  
  // Efficiency Metrics
  averageEfficiency: number;
  averageQuality: number;
  onTimeDelivery: number;
  
  // Trends
  weeklyTrends: {
    week: string;
    hours: number;
    revenue: number;
    efficiency: number;
  }[];
}

export interface CapacityPlan {
  id: string;
  tailorId: string;
  startDate: Date;
  endDate: Date;
  
  // Capacity Settings
  dailyWorkingHours: number;
  workingDaysPerWeek: number;
  maxConcurrentOrders: number;
  bufferTimePercentage: number; // for unexpected delays
  
  // Current Allocation
  allocatedHours: number;
  availableHours: number;
  utilizationRate: number;
  
  // Bookings
  bookings: CapacityBooking[];
  
  // Forecasting
  demandForecast: number;
  capacityRecommendations: string[];
}

export interface CapacityBooking {
  id: string;
  orderId: string;
  orderTitle: string;
  customerId: string;
  customerName: string;
  estimatedHours: number;
  startDate: Date;
  endDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  actualHours?: number;
}

export interface AutomatedReport {
  id: string;
  name: string;
  description: string;
  reportType: 'financial' | 'productivity' | 'inventory' | 'customer' | 'custom';
  
  // Schedule
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number; // for weekly reports
  dayOfMonth?: number; // for monthly reports
  time: string; // HH:MM format
  
  // Recipients
  recipients: string[]; // email addresses
  includeCharts: boolean;
  format: 'pdf' | 'excel' | 'email_summary';
  
  // Data Configuration
  dateRange: 'last_7_days' | 'last_30_days' | 'last_quarter' | 'custom';
  customDateRange?: { start: Date; end: Date };
  metrics: string[];
  filters: Record<string, unknown>;
  
  // Status
  isActive: boolean;
  lastSent?: Date;
  nextSendDate: Date;
  createdAt: Date;
}