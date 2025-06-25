// src/components/ai/ConfidenceIndicator.tsx
import React from 'react'
import { clsx } from 'clsx'
import { Target, AlertTriangle, CheckCircle } from 'lucide-react'

interface ConfidenceIndicatorProps {
  confidence: number
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  size = 'medium',
  showText = true
}) => {
  const getConfidenceLevel = () => {
    if (confidence >= 0.9) return 'high'
    if (confidence >= 0.8) return 'medium'
    return 'low'
  }
  
  const getIcon = () => {
    const level = getConfidenceLevel()
    switch (level) {
      case 'high':
        return CheckCircle
      case 'medium':
        return Target
      case 'low':
        return AlertTriangle
    }
  }
  
  const getColors = () => {
    const level = getConfidenceLevel()
    switch (level) {
      case 'high':
        return 'text-green-700 bg-green-100 border-green-200'
      case 'medium':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200'
      case 'low':
        return 'text-red-700 bg-red-100 border-red-200'
    }
  }
  
  const getSizes = () => {
    switch (size) {
      case 'small':
        return 'text-xs px-2 py-1'
      case 'medium':
        return 'text-sm px-3 py-1'
      case 'large':
        return 'text-base px-4 py-2'
    }
  }
  
  const Icon = getIcon()
  const percentage = Math.round(confidence * 100)
  
  return (
    <div className={clsx(
      'inline-flex items-center rounded-full border font-medium',
      getColors(),
      getSizes()
    )}>
      <Icon className={clsx(
        'mr-1',
        size === 'small' && 'h-3 w-3',
        size === 'medium' && 'h-4 w-4',
        size === 'large' && 'h-5 w-5'
      )} />
      {showText && (
        <span>
          {percentage}%
          {size !== 'small' && ` confidence`}
        </span>
      )}
    </div>
  )
}