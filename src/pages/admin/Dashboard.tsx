// src/pages/admin/Dashboard.tsx
import React from 'react';
import { AdminDashboard as AdminDashboardComponent } from '@/components/admin';

const AdminDashboard: React.FC = () => {  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor platform performance and AI system health</p>
      </div>
      
      <AdminDashboardComponent />
    </div>
  )
}

export default AdminDashboard