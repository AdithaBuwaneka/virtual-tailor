import React from 'react';
import { AdminOrderAnalytics } from '@/components/admin';

const OrderAnalyticsPage: React.FC = () => {  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Order Analytics</h1>
        <p className="text-gray-600 mt-2">View comprehensive order analytics and reports</p>
      </div>
      <AdminOrderAnalytics />
    </div>
  );
};

export default OrderAnalyticsPage;
