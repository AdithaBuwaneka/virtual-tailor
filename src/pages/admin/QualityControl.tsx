import React from 'react';
import { AdminQualityControl } from '@/components/admin';

const QualityControlPage: React.FC = () => {  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Quality Control</h1>
        <p className="text-gray-600 mt-2">Monitor and ensure platform quality standards</p>
      </div>
      <AdminQualityControl />
    </div>
  );
};

export default QualityControlPage;
