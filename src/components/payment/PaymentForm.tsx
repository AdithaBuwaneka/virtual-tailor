// components/payment/PaymentForm.tsx - Stripe Payment Form Component
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Lock, 
  Loader,
  Shield 
} from 'lucide-react';
import { PaymentStatus } from '../../types/payment';
import type { PaymentIntent, PaymentMethod } from '../../types/payment';
import type { Order } from '../../types/order';

interface PaymentFormProps {
  order: Order;
  onPaymentSuccess: (paymentIntent: PaymentIntent) => void;
  onPaymentError: (error: string) => void;
  isProcessing?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  order,
  onPaymentSuccess,
  onPaymentError,
  isProcessing = false
}) => {  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('new');
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<PaymentMethod[]>([]);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    saveCard: false
  });
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Mock saved payment methods (in real app, fetch from API)
  useEffect(() => {
    setSavedPaymentMethods([
      {
        id: 'pm_1',
        customerId: order.customer.id,
        type: 'card',
        brand: 'visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
        stripePaymentMethodId: 'pm_stripe_1',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'pm_2',
        customerId: order.customer.id,
        type: 'card',
        brand: 'mastercard',
        last4: '5555',
        expiryMonth: 8,
        expiryYear: 2026,
        isDefault: false,
        stripePaymentMethodId: 'pm_stripe_2',
        createdAt: new Date('2024-03-20')
      }
    ]);
  }, [order.customer.id]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const calculateFees = () => {
    const subtotal = order.totalPrice;
    const platformFeeRate = 0.05; // 5% platform fee
    const stripeFeeRate = 0.029; // 2.9% + $0.30 Stripe fee
    const stripeFeeFixed = 0.30;
    
    const platformFee = subtotal * platformFeeRate;
    const stripeFee = (subtotal * stripeFeeRate) + stripeFeeFixed;
    const total = subtotal + platformFee + stripeFee;
    
    return {
      subtotal,
      platformFee,
      stripeFee,
      total
    };
  };

  const fees = calculateFees();

  const validatePaymentForm = (): string | null => {
    if (!agreementAccepted) {
      return 'Please accept the terms and conditions';
    }

    if (selectedPaymentMethod === 'new') {
      if (!cardDetails.number.trim()) {
        return 'Card number is required';
      }
      
      if (cardDetails.number.replace(/\s/g, '').length < 16) {
        return 'Please enter a valid card number';
      }
      
      if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
        return 'Please enter a valid expiry date';
      }
      
      if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
        return 'Please enter a valid CVC code';
      }
      
      if (!cardDetails.name.trim()) {
        return 'Cardholder name is required';
      }
    }
    
    return null;
  };

  const handlePayment = async () => {
    const validationError = validatePaymentForm();
    if (validationError) {
      onPaymentError(validationError);
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing (in real app, call Stripe API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save card if user opted to do so
      if (selectedPaymentMethod === 'new' && cardDetails.saveCard) {
        // In a real app, this would call API to save the card to the customer's account
        console.log('Saving card for future use');
      }

      const paymentIntent: PaymentIntent = {
        id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId: order.id,
        customerId: order.customer.id,
        tailorId: order.tailor.id,
        amount: fees.total,
        currency: 'usd',
        status: PaymentStatus.SUCCEEDED,
        platformFee: fees.platformFee,
        tailorAmount: fees.subtotal - fees.platformFee,
        stripePaymentIntentId: `pi_stripe_${Date.now()}`,
        createdAt: new Date(),
        confirmedAt: new Date()
      };

      onPaymentSuccess(paymentIntent);
    } catch {
      onPaymentError('Payment processing failed. Please check your payment details and try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getCardBrandIcon = (brand: string) => {
    switch (brand) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'amex': return '💳';
      default: return '💳';
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Secure Payment</h2>
        </div>
        <p className="text-sm text-gray-600">
          Your payment is protected by 256-bit SSL encryption
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">${fees.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Platform Fee (5%)</span>
            <span className="text-gray-900">${fees.platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Processing Fee</span>
            <span className="text-gray-900">${fees.stripeFee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-medium">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${fees.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
        
        <div className="space-y-3">
          {/* Saved Payment Methods */}
          {savedPaymentMethods.map((method) => (
            <label key={method.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedPaymentMethod === method.id}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="mr-3 text-blue-600"
              />
              <div className="flex items-center gap-2 flex-grow">
                <span className="text-lg">{getCardBrandIcon(method.brand || '')}</span>
                <span className="text-gray-900">
                  •••• •••• •••• {method.last4}
                </span>
                <span className="text-sm text-gray-600">
                  {method.expiryMonth}/{method.expiryYear}
                </span>
                {method.isDefault && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
            </label>
          ))}

          {/* New Payment Method */}
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="new"
              checked={selectedPaymentMethod === 'new'}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="mr-3 text-blue-600"
            />
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900">Use a new card</span>
            </div>
          </label>
        </div>
      </div>

      {/* New Card Details */}
      {selectedPaymentMethod === 'new' && (
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              value={cardDetails.number}
              onChange={(e) => setCardDetails(prev => ({
                ...prev,
                number: formatCardNumber(e.target.value)
              }))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails(prev => ({
                  ...prev,
                  expiry: formatExpiry(e.target.value)
                }))}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVC
              </label>
              <input
                type="text"
                value={cardDetails.cvc}
                onChange={(e) => setCardDetails(prev => ({
                  ...prev,
                  cvc: e.target.value.replace(/\D/g, '').slice(0, 4)
                }))}
                placeholder="123"
                maxLength={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardDetails.name}
              onChange={(e) => setCardDetails(prev => ({
                ...prev,
                name: e.target.value
              }))}
              placeholder="John Doe"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={cardDetails.saveCard}
              onChange={(e) => setCardDetails(prev => ({
                ...prev,
                saveCard: e.target.checked
              }))}
              className="mr-2 text-blue-600"
            />
            <span className="text-sm text-gray-700">
              Save this card for future payments
            </span>
          </label>
        </div>
      )}

      {/* Terms Agreement */}
      <div className="mb-6">
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={agreementAccepted}
            onChange={(e) => setAgreementAccepted(e.target.checked)}
            className="mt-1 mr-3 text-blue-600"
            required
          />
          <span className="text-sm text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={processing || isProcessing || !agreementAccepted}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing || isProcessing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pay ${fees.total.toFixed(2)}
          </>
        )}
      </button>

      {/* Security Notice */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔒 Your payment information is encrypted and secure
        </p>
      </div>
    </div>
  );
};