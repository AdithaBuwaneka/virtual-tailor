// components/customer/OrderModificationModal.tsx - Order Modification Request Component
import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import type { OrderModificationRequest } from '../../types/order';

interface OrderModificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onSubmit: (request: Partial<OrderModificationRequest>) => void;
}

export const OrderModificationModal: React.FC<OrderModificationModalProps> = ({
  isOpen,
  onClose,
  orderId,
  onSubmit
}) => {
  const [modificationType, setModificationType] = useState<string>('');
  const [reason, setReason] = useState('');
  const [specificChanges, setSpecificChanges] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      orderId,
      type: modificationType as OrderModificationRequest['type'],
      reason,
      requestedChanges: { description: specificChanges },
      status: 'pending'
    });
    
    // Reset form
    setModificationType('');
    setReason('');
    setSpecificChanges('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Request Order Changes</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Warning Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-amber-800 font-medium">Important Notice</h4>
                <p className="text-amber-700 text-sm mt-1">
                  Changes may affect your order timeline and pricing. Your tailor will review and respond to your request.
                </p>
              </div>
            </div>
          </div>

          {/* Modification Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type of Change
            </label>
            <div className="space-y-2">
              {[
                { value: 'measurement_change', label: 'Measurement Adjustments' },
                { value: 'design_change', label: 'Design Modifications' },
                { value: 'timeline_change', label: 'Timeline Adjustment' },
                { value: 'cancellation', label: 'Order Cancellation' }
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="modificationType"
                    value={option.value}
                    checked={modificationType === option.value}
                    onChange={(e) => setModificationType(e.target.value)}
                    className="mr-3 text-blue-600"
                    required
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Specific Changes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe Your Changes
            </label>
            <textarea
              value={specificChanges}
              onChange={(e) => setSpecificChanges(e.target.value)}
              placeholder="Please provide specific details about the changes you'd like to make..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Change
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Help us understand why you need these changes..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};