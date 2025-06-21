// src/pages/shared/Home.tsx
import React from 'react'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-tailor-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 mb-6">
            AI-Powered <span className="text-gradient">Custom Tailoring</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Get perfect-fitting garments with just 3 measurements. Our AI completes your profile 
            and connects you with skilled tailors worldwide.
          </p>
          
          {/* Key Innovation Highlight */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 max-w-2xl mx-auto border border-primary-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Revolutionary 3-Step Process</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
                <p className="text-sm font-medium">Input 3 Basic Measurements</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
                <p className="text-sm font-medium">AI Completes Your Profile</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
                <p className="text-sm font-medium">Connect with Expert Tailors</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register/customer" 
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors shadow-lg"
            >
              Start Your Measurements
            </Link>
            <Link 
              to="/register/tailor" 
              className="bg-tailor-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-tailor-700 transition-colors shadow-lg"
            >
              Join as Tailor
            </Link>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center text-gray-900 mb-12">
            Why Choose VirtualTailor?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Accuracy</h3>
              <p className="text-gray-600">95%+ accurate measurements from just 3 inputs using advanced machine learning</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-tailor-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3-Minute Setup</h3>
              <p className="text-gray-600">Complete your measurement profile in under 3 minutes, not 30+ minutes</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Artisans</h3>
              <p className="text-gray-600">Connect with verified tailors worldwide for authentic cultural garments</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home