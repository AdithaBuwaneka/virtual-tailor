// Integration helper for existing dashboard
// components/customer/DashboardOrdersSection.tsx - Orders section for dashboard
import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, ArrowRight } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';
import type { OrderStatus } from '../../types/order';
import { OrderStatus as OrderStatusEnum } from '../../types/order';

export const DashboardOrdersSection: React.FC = () => {
  const { user } = useAuthStore();
  const { getCustomerOrders } = useOrderStore();

  const customerOrders = user ? getCustomerOrders(user.id) : [];
  const recentOrders = customerOrders
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatusEnum.PENDING_ACCEPTANCE: return 'text-yellow-700 bg-yellow-100';
      case OrderStatusEnum.IN_PROGRESS: return 'text-blue-700 bg-blue-100';
      case OrderStatusEnum.COMPLETED: return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
        <Link
          to="/customer/orders"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {recentOrders.length > 0 ? (
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <Package className="w-8 h-8 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {order.garmentType} - {order.style}
                  </h3>
                  <p className="text-sm text-gray-600">
                    by {order.tailor.businessName}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
                <Link
                  to={`/customer/orders/${order.id}`}
                  className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No orders yet</p>
          <Link
            to="/customer/tailor-browse"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Package className="w-4 h-4" />
            Place Your First Order
          </Link>
        </div>
      )}
    </div>
  );
};