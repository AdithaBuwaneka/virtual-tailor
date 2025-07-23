// src/utils/measurementHelpers.ts
export const MEASUREMENT_LABELS: Record<string, string> = {
  height: 'Height',
  chest: 'Chest',
  waist: 'Waist',
  hip: 'Hip',
  thigh: 'Thigh',
  inseam: 'Inseam',
  sleeveLength: 'Sleeve Length',
  shoulderWidth: 'Shoulder Width',
  neck: 'Neck',
  ankle: 'Ankle',
  wrist: 'Wrist',
  bicep: 'Bicep',
  forearm: 'Forearm',
  calf: 'Calf'
}

export const MEASUREMENT_DESCRIPTIONS: Record<string, string> = {
  height: 'Your total height from head to toe',
  chest: 'Around the fullest part of your chest',
  waist: 'Around your natural waistline',
  hip: 'Around the fullest part of your hips',
  thigh: 'Around the fullest part of your thigh',
  inseam: 'From crotch to ankle along inside leg',
  sleeveLength: 'From shoulder to wrist',
  shoulderWidth: 'From shoulder tip to shoulder tip',
  neck: 'Around the base of your neck',
  ankle: 'Around your ankle bone',
  wrist: 'Around your wrist bone',
  bicep: 'Around the fullest part of your upper arm',
  forearm: 'Around the fullest part of your forearm',
  calf: 'Around the fullest part of your calf'
}

export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.9) return 'text-green-600 bg-green-100'
  if (confidence >= 0.8) return 'text-yellow-600 bg-yellow-100'
  return 'text-red-600 bg-red-100'
}

export const getConfidenceText = (confidence: number): string => {
  if (confidence >= 0.9) return 'High Confidence'
  if (confidence >= 0.8) return 'Medium Confidence'
  return 'Low Confidence'
}

export const formatMeasurement = (value: number): string => {
  return `${value} cm`
}

export const validateMeasurement = (field: string, value: number): string | undefined => {
  const ranges: Record<string, { min: number; max: number }> = {
    height: { min: 100, max: 250 },
    chest: { min: 60, max: 180 },
    waist: { min: 50, max: 160 },
    hip: { min: 60, max: 180 },
    thigh: { min: 30, max: 100 },
    inseam: { min: 50, max: 120 },
    sleeveLength: { min: 40, max: 100 },
    shoulderWidth: { min: 30, max: 80 },
    neck: { min: 25, max: 60 },
    ankle: { min: 15, max: 40 },
    wrist: { min: 10, max: 25 },
    bicep: { min: 20, max: 60 },
    forearm: { min: 15, max: 50 },
    calf: { min: 20, max: 60 }
  }
  
  const range = ranges[field]
  if (!range) return undefined
  
  if (value < range.min) {
    return `${MEASUREMENT_LABELS[field]} should be at least ${range.min}cm`
  }
  
  if (value > range.max) {
    return `${MEASUREMENT_LABELS[field]} should be at most ${range.max}cm`
  }
  
  return undefined
}