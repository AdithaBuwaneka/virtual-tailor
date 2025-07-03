// src/components/ai/AIProcessingStep.tsx
import React, { useEffect, useState } from 'react'
import { Brain, Cpu, Zap, Target } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui'

export const AIProcessingStep: React.FC = () => {
  const [progress, setProgress] = useState(0)
  const [currentTask, setCurrentTask] = useState(0)
  
  const tasks = [
    {
      icon: Brain,
      title: 'Analyzing Your Inputs',
      description: 'Processing height, chest, and waist measurements'
    },
    {
      icon: Cpu,
      title: 'Accessing ANSUR II Database',
      description: 'Comparing with 6,068 anthropometric samples'
    },
    {
      icon: Target,
      title: 'Calculating Correlations',
      description: 'Applying machine learning algorithms'
    },
    {
      icon: Zap,
      title: 'Generating Predictions',
      description: 'Creating your complete measurement profile'
    }
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2
        
        // Update current task based on progress
        if (newProgress >= 25 && currentTask === 0) setCurrentTask(1)
        if (newProgress >= 50 && currentTask === 1) setCurrentTask(2)
        if (newProgress >= 75 && currentTask === 2) setCurrentTask(3)
        
        return Math.min(newProgress, 100)
      })
    }, 40)
    
    return () => clearInterval(interval)
  }, [currentTask])
  
  return (
    <div className="p-8 text-center">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4 relative">
          <Brain className="h-10 w-10 text-primary-600 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-primary-200 animate-spin border-t-primary-600"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          AI Processing Your Measurements
        </h2>
        <p className="text-gray-600 max-w-lg mx-auto">
          Our advanced machine learning system is analyzing your inputs and generating your complete measurement profile
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Processing...</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Current Task */}
      <div className="max-w-lg mx-auto">
        {tasks.map((task, index) => {
          const Icon = task.icon
          const isActive = index === currentTask
          const isCompleted = index < currentTask
          
          return (
            <div
              key={index}
              className={`flex items-start p-4 rounded-lg mb-4 transition-all duration-300 ${
                isActive
                  ? 'bg-primary-50 border-2 border-primary-200'
                  : isCompleted
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                  isActive
                    ? 'bg-primary-100 text-primary-600'
                    : isCompleted
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isActive ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              
              <div className="text-left">
                <h3
                  className={`font-medium ${
                    isActive
                      ? 'text-primary-900'
                      : isCompleted
                      ? 'text-green-900'
                      : 'text-gray-500'
                  }`}
                >
                  {task.title}
                </h3>
                <p
                  className={`text-sm ${
                    isActive
                      ? 'text-primary-700'
                      : isCompleted
                      ? 'text-green-700'
                      : 'text-gray-500'
                  }`}
                >
                  {task.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Fun Facts */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Did you know?</h3>
        <p className="text-sm text-gray-700">
          Traditional custom tailoring requires taking 15-20+ measurements, which can take 30+ minutes. 
          Our AI achieves 95%+ accuracy using just your 3 basic measurements in under 30 seconds!
        </p>
      </div>
    </div>
  )
}