// src/components/ai/MeasurementCard.tsx
import React from 'react'
import { Edit2, Check, X, User } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { ConfidenceIndicator } from './ConfidenceIndicator'
import { MEASUREMENT_LABELS, MEASUREMENT_DESCRIPTIONS, formatMeasurement } from '@/utils/measurementHelpers'
import type { CompleteMeasurements } from '@/types'

interface MeasurementCardProps {
  field: keyof CompleteMeasurements
  value: number
  confidence: number
  isEditing: boolean
  editValue: string
  onEdit: () => void
  onEditValueChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
  isProcessing: boolean
  isUserAdjusted?: boolean
}

export const MeasurementCard: React.FC<MeasurementCardProps> = ({
  field,
  value,
  confidence,
  isEditing,
  editValue,
  onEdit,
  onEditValueChange,
  onSave,
  onCancel,
  isProcessing,
  isUserAdjusted = false
}) => {
  return (
    <div className={`measurement-card relative ${isEditing ? 'ring-2 ring-primary-500' : ''}`}>
      {/* User Adjusted Badge */}
      {isUserAdjusted && (
        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <User className="h-3 w-3 mr-1" />
          Adjusted
        </div>
      )}
      
      {/* Measurement Info */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900">
            {MEASUREMENT_LABELS[field]}
          </h4>
          <ConfidenceIndicator confidence={confidence} />
        </div>
        <p className="text-xs text-gray-500">
          {MEASUREMENT_DESCRIPTIONS[field]}
        </p>
      </div>
      
      {/* Value Display/Edit */}
      {isEditing ? (
        <div className="space-y-3">
          <Input
            type="number"
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
            placeholder="Enter measurement"
            rightIcon={<span className="text-gray-400 text-sm">cm</span>}
            className="text-center text-lg font-medium"
            autoFocus
          />
          
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onSave}
              loading={isProcessing}
              disabled={isProcessing || !editValue}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            {formatMeasurement(value)}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onEdit}
            disabled={isProcessing}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}