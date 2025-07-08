import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Users, BarChart2, Shield, Activity, 
  CreditCard, Settings
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center px-4 py-3 text-sm font-medium rounded-md mb-1 
        ${isActive 
          ? 'bg-primary-100 text-primary-600' 
          : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
};

const AdminNavigation: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 px-4">Admin Navigation</h3>
      <nav>
        <NavItem to="/admin/dashboard" icon={<Home size={18} />} label="Dashboard" />
        <NavItem to="/admin/users" icon={<Users size={18} />} label="User Management" />
        <NavItem to="/admin/orders/analytics" icon={<BarChart2 size={18} />} label="Order Analytics" />
        <NavItem to="/admin/quality/control" icon={<Shield size={18} />} label="Quality Control" />
        <NavItem to="/admin/system/health" icon={<Activity size={18} />} label="System Health" />
        <NavItem to="/admin/payments/monitoring" icon={<CreditCard size={18} />} label="Payment Monitoring" />
        <NavItem to="/admin/settings" icon={<Settings size={18} />} label="Settings" />
      </nav>
    </div>
  );
};

export default AdminNavigation;
