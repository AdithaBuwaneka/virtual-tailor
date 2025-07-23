// pages/tailor/Orders.tsx - Tailor Order Management Page
import React from 'react';
import { OrderManagement } from '@/components/tailor/OrderManagement';
import { useOrderStore } from '@/store/orderStore';

interface TailorOrdersPageProps {
  tailorId?: string;
}

const TailorOrdersPage: React.FC<TailorOrdersPageProps> = ({ tailorId = 'current-tailor' }) => {
  const { getTailorOrders, updateOrderStatus, addProgressUpdate } = useOrderStore();
  
  // In a real app, we would get the tailor ID from auth context or props
  const orders = getTailorOrders(tailorId);
  
  // Mocked image upload handler
  const handleImageUpload = async (images: File[]): Promise<string[]> => {
    // In a real app, this would upload to a service like S3/Cloudinary
    console.log('Uploading images:', images);
    
    // Return mock image URLs
    return images.map((_, idx) => `https://example.com/mockimage_${idx}.jpg`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">No Orders Yet</h2>
          <p className="text-gray-600">
            You don't have any orders to manage yet. When customers place orders, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-8">
          {orders.map(order => (            <OrderManagement 
              key={order.id} 
              order={order}
              onUpdateStatus={(orderId, status) => updateOrderStatus(orderId, status)}
              onAddProgressUpdate={(orderId, update) => addProgressUpdate(orderId, update)}
              onUploadImages={handleImageUpload}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TailorOrdersPage;