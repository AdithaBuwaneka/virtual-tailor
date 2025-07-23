// src/components/layout/Layout.tsx
import React from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { AdminNavigation } from '@/components/admin'

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {isAdminPage ? (
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <AdminNavigation />
            </div>
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </main>
      <Footer />
    </div>
  )
}