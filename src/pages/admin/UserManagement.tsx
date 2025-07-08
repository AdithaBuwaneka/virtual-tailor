import React from 'react';
import { AdminUserManagement } from '@/components/admin';

const UserManagementPage: React.FC = () => {  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage platform users and permissions</p>
      </div>
      <AdminUserManagement />
    </div>
  );
};

export default UserManagementPage;
