import React from 'react';
import { AdminSystemHealth } from '@/components/admin';

const SystemHealthPage: React.FC = () => {  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">System Health</h1>
        <p className="text-gray-600 mt-2">Monitor platform performance and AI system health</p>
      </div>
      <AdminSystemHealth />
    </div>
  );
};

export default SystemHealthPage;
