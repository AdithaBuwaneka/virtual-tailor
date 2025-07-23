// src/utils/paymentHelpers.ts - Payment Utility Functions
export const paymentHelpers = {
  calculateFees: (subtotal: number) => {
    const platformFeeRate = 0.05; // 5%
    const stripeFeeRate = 0.029; // 2.9%
    const stripeFeeFixed = 0.30;
    
    const platformFee = subtotal * platformFeeRate;
    const stripeFee = (subtotal * stripeFeeRate) + stripeFeeFixed;
    const total = subtotal + platformFee + stripeFee;
    const tailorAmount = subtotal - platformFee;
    
    return {
      subtotal,
      platformFee,
      stripeFee,
      total,
      tailorAmount
    };
  },

  formatCurrency: (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  },

  getPaymentStatusColor: (status: string) => {
    switch (status) {
      case 'succeeded': return 'text-green-700 bg-green-100';
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'processing': return 'text-blue-700 bg-blue-100';
      case 'failed': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  },

  validatePaymentAmount: (amount: number, min: number = 1, max: number = 10000) => {
    if (!amount || amount < min) {
      return `Amount must be at least $${min}`;
    }
    if (amount > max) {
      return `Amount cannot exceed $${max}`;
    }
    return null;
  },

  generateInvoiceNumber: () => {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `INV-${year}-${timestamp}`;
  },

  calculateRefundAmount: (originalAmount: number, platformFee: number, stripeFee: number) => {
    // Typically, platform fees are non-refundable, but processing fees might be partially refundable
    const refundableStripeFee = stripeFee * 0.5; // 50% of Stripe fee refunded
    return originalAmount - platformFee + refundableStripeFee;
  }
};
