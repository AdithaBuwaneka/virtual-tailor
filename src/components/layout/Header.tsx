// src/components/layout/Header.tsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, User, Settings, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui'

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
    navigate('/')
  }

  const getDashboardLink = () => {
    if (!user) return '/'
    return `/${user.role}/dashboard`
  }

  const UserDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <span className="hidden md:block text-sm font-medium">
          {user?.firstName} {user?.lastName}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <Link
              to={getDashboardLink()}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              <User className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Profile Settings
            </Link>
            <hr className="my-1" />
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-display font-bold text-gradient">
              VirtualTailor
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/how-it-works" 
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link 
              to="/browse-tailors" 
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              Find Tailors
            </Link>
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              About
            </Link>
            {!isAuthenticated && (
              <Link 
                to="/register/tailor" 
                className="text-tailor-600 hover:text-tailor-700 transition-colors font-medium"
              >
                Become a Tailor
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Button
                  as={Link}
                  to="/register/customer"
                  size="sm"
                >
                  Get Started
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-600 hover:text-gray-900"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              <Link
                to="/how-it-works"
                className="block text-gray-600 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/browse-tailors"
                className="block text-gray-600 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Find Tailors
              </Link>
              <Link
                to="/about"
                className="block text-gray-600 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              {!isAuthenticated && (
                <>
                  <Link
                    to="/register/tailor"
                    className="block text-tailor-600 hover:text-tailor-700 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Become a Tailor
                  </Link>
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <Link
                      to="/login"
                      className="block w-full text-center py-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Button
                      as={Link}
                      to="/register/customer"
                      fullWidth
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}