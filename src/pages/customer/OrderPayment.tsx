// pages/customer/OrderPayment.tsx - Integrated Order Payment Page
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';
import { PaymentForm } from '../../components/payment/PaymentForm';
import { PaymentSuccess } from '../../components/payment/PaymentSuccess';
import type { PaymentIntent } from '../../types/payment';


export const OrderPayment: React.FC = () => {  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getOrder, updateOrderStatus } = useOrderStore();
  
  const [currentStep, setCurrentStep] = useState<'payment' | 'success'>('payment');
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const order = orderId ? getOrder(orderId) : null;

  useEffect(() => {
    if (!order || !user) {
      navigate('/customer/orders');
      return;
    }

    // Verify order belongs to current user
    if (order.customer.id !== user.id) {
      navigate('/customer/orders');
      return;
    }    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      navigate(`/customer/orders/${orderId}`);
      return;
    }
  }, [order, user, orderId, navigate]);
  
  const handlePaymentSuccess = async (completedPayment: PaymentIntent) => {
    setPaymentIntent(completedPayment);
    
    // Update order payment status
    if (order) {
      // Update order status and payment status
      const updatedOrder = { ...order, paymentStatus: 'paid' };
      updateOrderStatus(updatedOrder.id, updatedOrder.status);
    }
    
    setCurrentStep('success');
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setIsProcessing(false);
  };

  const handleViewOrder = () => {
    navigate(`/customer/orders/${orderId}`);
  };

  const handleContactTailor = () => {
    // Open chat with tailor
    console.log('Opening chat with tailor');
  };

  const handleDownloadReceipt = () => {
    // Download payment receipt
    console.log('Downloading receipt');
  };

  if (!order || !user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600">The order you're trying to pay for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Order Created</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'payment' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-green-600 text-white'
              }`}>
                {currentStep === 'payment' ? '2' : '✓'}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">Payment</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'success' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {currentStep === 'success' ? '✓' : '3'}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-600">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {currentStep === 'payment' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Garment</span>
                <span className="text-gray-900">{order.garmentType} - {order.style}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tailor</span>
                <span className="text-gray-900">{order.tailor.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Timeline</span>
                <span className="text-gray-900">{order.timeline} weeks</span>
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price</span>
                  <span className="text-gray-900">${order.basePrice.toFixed(2)}</span>
                </div>
                
                {order.customizations.map((custom, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{custom.name}</span>
                    <span className="text-gray-900">${custom.price.toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span className="text-gray-900">Subtotal</span>
                  <span className="text-gray-900">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-gray-900 mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">                <p><span className="text-gray-600">Name:</span> {`${order.customer.firstName} ${order.customer.lastName}`}</p>
                <p><span className="text-gray-600">Email:</span> {order.customer.email}</p>
                <p><span className="text-gray-600">Order ID:</span> #{order.id.slice(-8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <PaymentForm
              order={order}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      )}      {currentStep === 'success' && paymentIntent && order && (
        <div className="flex justify-center">
          <PaymentSuccess
            paymentIntent={paymentIntent}
            order={order}
            onViewOrder={handleViewOrder}
            onContactTailor={handleContactTailor}
            onDownloadReceipt={handleDownloadReceipt}
          />
        </div>
      )}
    </div>
  );
};