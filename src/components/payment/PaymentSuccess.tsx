// components/payment/PaymentSuccess.tsx - Payment Confirmation Component
import React from 'react';
import { CheckCircle, Download, MessageCircle, Eye } from 'lucide-react';
import type { PaymentIntent } from '../../types/payment';
import type { Order } from '../../types/order';

interface PaymentSuccessProps {
  paymentIntent: PaymentIntent;
  order: Order;
  onViewOrder: () => void;
  onContactTailor: () => void;
  onDownloadReceipt: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  paymentIntent,
  order,
  onViewOrder,
  onContactTailor,
  onDownloadReceipt
}) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border p-6 text-center">
      {/* Success Icon */}
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600">
          Your order has been confirmed and payment processed
        </p>
      </div>

      {/* Payment Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Payment ID</span>
            <span className="text-gray-900 font-mono">
              {paymentIntent.id.slice(-12).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Paid</span>
            <span className="text-gray-900 font-semibold">
              ${paymentIntent.amount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order</span>
            <span className="text-gray-900">
              #{order.id.slice(-8).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tailor</span>            <span className="text-gray-900">
              {order.tailor.businessName}
            </span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">What happens next?</h3>
        <div className="text-left space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <span className="text-blue-600">1.</span>
            <span>Your tailor will review and accept your order</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">2.</span>
            <span>Materials will be sourced and construction begins</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">3.</span>
            <span>You'll receive progress updates throughout the process</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">4.</span>
            <span>Your custom garment will be shipped upon completion</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onViewOrder}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Track Your Order
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onContactTailor}
            className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Message Tailor
          </button>
          <button
            onClick={onDownloadReceipt}
            className="flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Receipt
          </button>
        </div>
      </div>      {/* Payment Protection Notice */}
      <div className="mt-6">
        <div className="p-3 bg-blue-50 rounded-lg mb-3">
          <p className="text-xs text-blue-700">
            <strong>Payment Protection:</strong> Your funds are held securely in escrow until your order is completed and delivered.
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-700">
            <strong>Transaction ID:</strong> {paymentIntent.id.slice(-16).toUpperCase()} • {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};