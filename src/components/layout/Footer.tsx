// src/components/layout/Footer.tsx
import React from 'react'
import { Link } from 'react-router-dom'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="text-2xl font-display font-bold mb-4">
              VirtualTailor
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered custom tailoring platform connecting customers with skilled artisans worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="font-semibold mb-4">For Customers</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/register/customer" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link to="/measurements" className="hover:text-white transition-colors">Measurements Guide</Link></li>
              <li><Link to="/garment-types" className="hover:text-white transition-colors">Garment Types</Link></li>
              <li><Link to="/cultural-styles" className="hover:text-white transition-colors">Cultural Styles</Link></li>
            </ul>
          </div>

          {/* For Tailors */}
          <div>
            <h3 className="font-semibold mb-4">For Tailors</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/register/tailor" className="hover:text-white transition-colors">Join as Tailor</Link></li>
              <li><Link to="/tailor-resources" className="hover:text-white transition-colors">Resources</Link></li>
              <li><Link to="/business-tools" className="hover:text-white transition-colors">Business Tools</Link></li>
              <li><Link to="/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 VirtualTailor. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 text-sm hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="text-gray-400 text-sm hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}