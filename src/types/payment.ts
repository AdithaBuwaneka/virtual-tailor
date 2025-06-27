// types/payment.ts - Payment System Types
export interface PaymentIntent {
  id: string;
  orderId: string;
  customerId: string;
  tailorId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  platformFee: number;
  tailorAmount: number;
  stripePaymentIntentId?: string;
  createdAt: Date;
  confirmedAt?: Date;
  metadata?: Record<string, unknown>;
}

export const PaymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded'
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export interface PaymentMethod {
  id: string;
  customerId: string;
  type: 'card' | 'bank_account' | 'digital_wallet';
  brand?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  stripePaymentMethodId: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  paymentIntentId: string;
  orderId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string;
  createdAt: Date;
  processedAt?: Date;
  failureReason?: string;
  refundAmount?: number;
  refundReason?: string;
}

export const TransactionType = {
  PAYMENT: 'payment',
  REFUND: 'refund',
  PAYOUT: 'payout',
  FEE: 'fee',
  CHARGEBACK: 'chargeback'
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export interface EscrowAccount {
  id: string;
  orderId: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: EscrowStatus;
  holdUntil: Date;
  releasedAt?: Date;
  releasedAmount?: number;
  platformFee: number;
  tailorAmount: number;
  disputeId?: string;
}

export const EscrowStatus = {
  HELD: 'held',
  RELEASED: 'released',
  DISPUTED: 'disputed',
  REFUNDED: 'refunded'
} as const;

export type EscrowStatus = typeof EscrowStatus[keyof typeof EscrowStatus];

export interface TailorPayout {
  id: string;
  tailorId: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  escrowAccountIds: string[];
  stripeTransferId?: string;
  scheduledDate: Date;
  processedAt?: Date;
  failureReason?: string;
  bankAccount?: string;
}

export const PayoutStatus = {
  SCHEDULED: 'scheduled',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const;

export type PayoutStatus = typeof PayoutStatus[keyof typeof PayoutStatus];

export interface Invoice {
  id: string;
  orderId: string;
  customerId: string;
  tailorId: string;
  invoiceNumber: string;
  subtotal: number;
  platformFee: number;
  taxes: number;
  total: number;
  currency: string;
  status: InvoiceStatus;
  issuedAt: Date;
  dueAt: Date;
  paidAt?: Date;
  items: InvoiceItem[];
}

export const InvoiceStatus = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
} as const;

export type InvoiceStatus = typeof InvoiceStatus[keyof typeof InvoiceStatus];

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
