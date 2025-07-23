// pages/customer/OrderDetails.tsx - Individual Order Details Page
import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';
import { OrderTrackingComponent } from '../../components/customer/OrderTracking';
import { OrderModificationModal } from '../../components/customer/OrderModificationModal';
import { initializeMockOrderData } from '../../data/mockOrderData';
import type { OrderModificationRequest } from '@/types';

export const CustomerOrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuthStore();
  const { getOrder, getOrderTracking, requestModification, orders } = useOrderStore();
  const [showModificationModal, setShowModificationModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize mock data if no orders exist
    if (orders.length === 0) {
      initializeMockOrderData();
    }
  }, [orders.length]);

  if (!orderId) {
    return <Navigate to="/customer/orders" replace />;
  }

  const order = getOrder(orderId);
  const tracking = getOrderTracking(orderId);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link
            to="/customer/orders"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // Verify the order belongs to the current user
  if (user && order.customer.id !== user.id) {
    return <Navigate to="/customer/orders" replace />;
  }

  const handleRequestModification = () => {
    setShowModificationModal(true);
  };

  const handleContactTailor = () => {
    // Navigate to chat with tailor
    navigate(`/customer/chat?tailorId=${order.tailor.id}&orderId=${order.id}`);
  };

  const handleSubmitModification = (modificationRequest: Partial<OrderModificationRequest>) => {
    requestModification(modificationRequest);
    // Show success message
    console.log('Modification request submitted:', modificationRequest);
  };

  if (!tracking) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Order Details...</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-4">
        <button onClick={() => navigate('/customer/orders')} className="text-primary-600 hover:underline mb-4">&larr; Back to Orders</button>
      </div>
      <OrderTrackingComponent
        tracking={tracking}
        onRequestModification={handleRequestModification}
        onContactTailor={handleContactTailor}
      />
      
      <OrderModificationModal
        isOpen={showModificationModal}
        onClose={() => setShowModificationModal(false)}
        orderId={orderId}
        onSubmit={handleSubmitModification}
      />
    </>
  );
};