// types/order.ts - Enhanced Order Management Types

// Define the OrderStatus as both a type and an enum for compatibility
export type OrderStatus =
  | 'pending_acceptance'
  | 'accepted'
  | 'materials_sourcing'
  | 'in_progress'
  | 'quality_review'
  | 'completed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export const OrderStatus = {
  PENDING_ACCEPTANCE: 'pending_acceptance' as OrderStatus,
  ACCEPTED: 'accepted' as OrderStatus,
  MATERIALS_SOURCING: 'materials_sourcing' as OrderStatus,
  IN_PROGRESS: 'in_progress' as OrderStatus,
  QUALITY_REVIEW: 'quality_review' as OrderStatus,
  COMPLETED: 'completed' as OrderStatus,
  SHIPPED: 'shipped' as OrderStatus,
  DELIVERED: 'delivered' as OrderStatus,
  CANCELLED: 'cancelled' as OrderStatus
} as const;

export interface OrderMilestone {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  completedAt?: Date;
  estimatedDate?: Date;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface ProgressUpdate {
  id: string;
  orderId?: string;
  timestamp?: string;
  type?: 'status_change' | 'progress_photo' | 'note' | 'milestone';
  title?: string;
  message?: string;
  description?: string;
  images?: string[];
  createdAt?: Date;
  createdBy?: {
    id: string;
    name: string;
    role: 'customer' | 'tailor' | 'admin';
  };
}

export interface OrderTracking {
  id?: string;
  orderId: string;
  status?: OrderStatus;
  currentStatus?: OrderStatus;
  timeline?: Array<{
    status: OrderStatus;
    timestamp: string;
    message: string;
  }>;
  milestones?: OrderMilestone[];
  progressUpdates: ProgressUpdate[];
  deliveryEstimate?: Date | null;
  estimatedCompletion?: Date;
  trackingNumber?: string;
  shippingCarrier?: string;
  shippingUpdates?: ShippingUpdate[];
}

export interface ShippingUpdate {
  id: string;
  status: string;
  location: string;
  description: string;
  timestamp: Date;
}

export interface OrderModificationRequest {
  id: string;
  orderId: string;
  type: 'measurement_change' | 'design_change' | 'timeline_change' | 'cancellation';
  requestedChanges: Record<string, unknown>;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestedAt: Date;
  respondedAt?: Date;
  response?: string;
}

export type OrderCreate = {
  tailorId: string;
  measurementProfileId: string;
  garmentType: string;
  specifications: {
    style: string;
    fabric: string;
    color: string;
    culturalStyle: string;
    customizations: string[];
  };
  timeline: {
    rushOrder: boolean;
  };
  deliveryInfo: {
    address: string;
    method: 'delivery';
  };
  notes?: string;
};

export interface Order {
  id: string;
  customer: import('./user').Customer;
  tailor: import('./user').Tailor;
  garmentType: string;
  style: string;
  measurements: Record<string, number>;
  requirements: string;
  timeline: number;
  basePrice: number;
  customizations: Array<{ name: string; price: number }>;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  expectedDelivery: Date;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}