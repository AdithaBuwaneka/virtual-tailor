// Updated src/App.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { useAuth } from '@/hooks/useAuth'
//import { LoadingSpinner } from '@/components/ui'
import TailorOrdersPage from '@/pages/tailor/Orders'

// Import pages
import Home from '@/pages/shared/Home'
import Login from '@/pages/auth/Login'
import CustomerRegister from '@/pages/auth/CustomerRegister'
import TailorRegister from '@/pages/auth/TailorRegister'
import CustomerDashboard from '@/pages/customer/Dashboard'
import Measurements from '@/pages/customer/Measurements'
import TailorBrowse from '@/pages/customer/TailorBrowse'
import TailorProfile from '@/pages/customer/TailorProfile'
import OrderCreate from '@/pages/customer/OrderCreate'
import TailorDashboard from '@/pages/tailor/Dashboard'
import AdminDashboard from '@/pages/admin/Dashboard'
import UserManagementPage from '@/pages/admin/UserManagement'
import OrderAnalyticsPage from '@/pages/admin/OrderAnalytics'
import QualityControlPage from '@/pages/admin/QualityControl'
import SystemHealthPage from '@/pages/admin/SystemHealth'
import PaymentMonitoring from '@/pages/admin/PaymentMonitoring'
import AdminSettings from '@/pages/admin/Settings'
import Chat from '@/pages/customer/chat'
import { CustomerOrders } from '@/pages/customer/Orders'
import { CustomerOrderDetails } from '@/pages/customer/OrderDetails'

// Import payment routes
import { 
  CustomerPaymentRoutes, 
  TailorPaymentRoutes, 
  AdminPaymentRoutes 
} from '@/routes/PaymentRoutes'

// Protected Route Component
// TEMPORARY: Bypass ProtectedRoute for development
// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   allowedRoles: string[];
// }
//
// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
//   const { user, isLoading } = useAuth();
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner size="xl" />
//       </div>
//     );
//   }
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
//   if (!allowedRoles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }
//   return <>{children}</>;
// };
// Proper ProtectedRoute with authentication
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    switch (user.role) {
      case 'customer':
        return <Navigate to="/customer/dashboard" replace />;
      case 'tailor':
        return <Navigate to="/tailor/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

// Redirect authenticated users away from auth pages
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  
  return <>{children}</>;
};

// Default redirect component for authenticated users
const DefaultRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } 
        />
        <Route 
          path="/register/customer" 
          element={
            <AuthRoute>
              <CustomerRegister />
            </AuthRoute>
          } 
        />
        <Route 
          path="/register/tailor" 
          element={
            <AuthRoute>
              <TailorRegister />
            </AuthRoute>
          } 
        />

        {/* Customer Routes */}
        <Route 
          path="/customer/*" 
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<CustomerDashboard />} />
                  <Route path="measurements" element={<Measurements />} />
                  <Route path="tailors" element={<TailorBrowse />} />
                  <Route path="tailors/:tailorId" element={<TailorProfile />} />
                  <Route path="order/create" element={<OrderCreate />} />
                  <Route path="orders" element={<CustomerOrders />} />
                  <Route path="orders/:orderId" element={<CustomerOrderDetails />} />
                  <Route path="chat" element={<Chat />} />
                  {/* Payment Routes */}
                  <Route path="payments/*" element={<CustomerPaymentRoutes />} />
                  <Route path="*" element={<Navigate to="/customer/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Tailor Routes */}
        <Route 
          path="/tailor/*" 
          element={
            <ProtectedRoute allowedRoles={['tailor']}>
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<TailorDashboard />} />
                  <Route path="orders" element={<TailorOrdersPage />} />
                  {/* For detailed order management, you can add a route like below if you have a page for it: */}
                  {/* <Route path="orders/:orderId" element={<OrderManagementPage />} /> */}
                  <Route path="profile" element={<div className="p-8"><h1 className="text-2xl font-bold">Profile Management (Coming Soon)</h1></div>} />
                  <Route path="analytics" element={<div className="p-8"><h1 className="text-2xl font-bold">Analytics (Coming Soon)</h1></div>} />
                  {/* Payment Routes */}
                  <Route path="payments/*" element={<TailorPaymentRoutes />} />
                  <Route path="*" element={<Navigate to="/tailor/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<UserManagementPage />} />
                  <Route path="orders/analytics" element={<OrderAnalyticsPage />} />
                  <Route path="quality/control" element={<QualityControlPage />} />
                  <Route path="system/health" element={<SystemHealthPage />} />
                  <Route path="payments/monitoring" element={<PaymentMonitoring />} />
                  <Route path="settings" element={<AdminSettings />} />
                  {/* Payment Routes */}
                  <Route path="payments/*" element={<AdminPaymentRoutes />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Payment Routes */}
        <Route 
          path="/payment/*" 
          element={
            <ProtectedRoute allowedRoles={['customer', 'tailor', 'admin']}>
              <Layout>
                <Routes>
                  <Route path="customer" element={<CustomerPaymentRoutes />} />
                  <Route path="tailor" element={<TailorPaymentRoutes />} />
                  <Route path="admin" element={<AdminPaymentRoutes />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Catch all - redirect to appropriate dashboard */}
        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </div>
  )
}

export default App