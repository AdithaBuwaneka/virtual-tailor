// src/components/ai/ProgressTracker.tsx
import React from 'react'
import { clsx } from 'clsx'
import { Check, Brain, User, CheckCircle } from 'lucide-react'

interface ProgressTrackerProps {
  currentStep: 'input' | 'processing' | 'review' | 'complete'
  className?: string
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  currentStep, 
  className 
}) => {
  const steps = [
    {
      id: 'input',
      name: '3 Basic Inputs',
      description: 'Height, Chest, Waist',
      icon: User,
      status: getStepStatus('input', currentStep)
    },
    {
      id: 'processing',
      name: 'AI Processing',
      description: 'Smart completion',
      icon: Brain,
      status: getStepStatus('processing', currentStep)
    },
    {
      id: 'review',
      name: 'Review & Adjust',
      description: 'Verify measurements',
      icon: Check,
      status: getStepStatus('review', currentStep)
    },
    {
      id: 'complete',
      name: 'Complete',
      description: 'Profile ready',
      icon: CheckCircle,
      status: getStepStatus('complete', currentStep)
    }
  ]
  
  return (
    <div className={clsx('w-full flex justify-center', className)}>
      <div className="flex items-center justify-center max-w-4xl">
        {steps.map((step, index) => {
          const Icon = step.icon
          
          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                    step.status === 'completed' && 'bg-green-600 border-green-600 text-white',
                    step.status === 'current' && 'bg-primary-600 border-primary-600 text-white animate-pulse',
                    step.status === 'upcoming' && 'bg-gray-100 border-gray-300 text-gray-400'
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                
                {/* Step Info */}
                <div className="mt-2 text-center">
                  <div
                    className={clsx(
                      'text-sm font-medium',
                      step.status === 'completed' && 'text-green-600',
                      step.status === 'current' && 'text-primary-600',
                      step.status === 'upcoming' && 'text-gray-400'
                    )}
                  >
                    {step.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={clsx(
                    'w-16 md:w-24 lg:w-32 h-0.5 mx-4 transition-all duration-300',
                    step.status === 'completed' ? 'bg-green-600' : 'bg-gray-300'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getStepStatus(stepId: string, currentStep: string): 'completed' | 'current' | 'upcoming' {
  const stepOrder = ['input', 'processing', 'review', 'complete']
  const currentIndex = stepOrder.indexOf(currentStep)
  const stepIndex = stepOrder.indexOf(stepId)
  
  if (stepIndex < currentIndex) return 'completed'
  if (stepIndex === currentIndex) return 'current'
  return 'upcoming'
}
