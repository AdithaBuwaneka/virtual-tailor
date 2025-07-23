// components/tailor/OrderQueue.tsx - Tailor's Incoming Orders
import React, { useState } from 'react';
import { Clock, User, Ruler, DollarSign, CheckCircle, X, Eye, MessageCircle } from 'lucide-react';
import type { Order } from '@/types';
import { OrderStatus } from '@/types';

interface OrderQueueProps {
  orders: Order[];
  onAcceptOrder: (orderId: string) => void;
  onRejectOrder: (orderId: string, reason: string) => void;
  onViewDetails: (orderId: string) => void;
  onContactCustomer: (customerId: string) => void;
}

export const OrderQueue: React.FC<OrderQueueProps> = ({
  orders,
  onAcceptOrder,
  onRejectOrder,
  onViewDetails,
  onContactCustomer
}) => {
  const [rejectModal, setRejectModal] = useState<{orderId: string; isOpen: boolean}>({
    orderId: '',
    isOpen: false
  });
  const [rejectReason, setRejectReason] = useState('');

  const pendingOrders = orders.filter(order => order.status === OrderStatus.PENDING_ACCEPTANCE);
  const activeOrders = orders.filter(order => 
    order.status !== OrderStatus.PENDING_ACCEPTANCE && 
    order.status !== OrderStatus.COMPLETED &&
    order.status !== OrderStatus.CANCELLED
  );

  const handleRejectOrder = () => {
    onRejectOrder(rejectModal.orderId, rejectReason);
    setRejectModal({orderId: '', isOpen: false});
    setRejectReason('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_ACCEPTANCE: return 'text-yellow-700 bg-yellow-100';
      case OrderStatus.ACCEPTED: return 'text-green-700 bg-green-100';
      case OrderStatus.IN_PROGRESS: return 'text-blue-700 bg-blue-100';
      case OrderStatus.QUALITY_REVIEW: return 'text-purple-700 bg-purple-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };  // Helper function to safely get customer name
  const getCustomerName = (order: Order): string => {
    try {
      return `${order.customer.firstName} ${order.customer.lastName}`;
    } catch {
      return "Customer";
    }
  };

  return (
    <div className="space-y-8">
      {/* Pending Orders Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Pending Orders ({pendingOrders.length})
          </h2>
          <div className="text-sm text-gray-600">
            Respond within 24 hours to maintain your response rate
          </div>
        </div>

        <div className="grid gap-4">
          {pendingOrders.map((order) => (
            <div key={order.id} className="bg-white border border-yellow-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{getCustomerName(order)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{formatPrice(order.totalPrice)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{order.garmentType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {order.timeline} weeks
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {order.requirements?.slice(0, 150)}...
                  </p>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => onViewDetails(order.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </button>
                  <button
                    onClick={() => onContactCustomer(order.customer.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => onAcceptOrder(order.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept Order
                </button>
                <button
                  onClick={() => setRejectModal({orderId: order.id, isOpen: true})}
                  className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Decline
                </button>
              </div>
            </div>
          ))}

          {pendingOrders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pending orders at the moment</p>
            </div>
          )}
        </div>
      </div>

      {/* Active Orders Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Active Orders ({activeOrders.length})
        </h2>

        <div className="grid gap-4">
          {activeOrders.map((order) => (
            <div key={order.id} className="bg-white border border-blue-100 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{getCustomerName(order)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{formatPrice(order.totalPrice)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{order.garmentType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        Due: {new Date(order.expectedDelivery).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onViewDetails(order.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Manage Order
                </button>
              </div>
            </div>
          ))}

          {activeOrders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active orders to manage</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Order Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Decline Order
              </h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for declining this order. This helps customers understand and improves future matches.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter your reason for declining..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                required
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setRejectModal({orderId: '', isOpen: false})}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectOrder}
                  disabled={!rejectReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Decline Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
