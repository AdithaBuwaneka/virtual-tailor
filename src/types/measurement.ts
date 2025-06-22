// src/types/measurement.ts
export interface BasicMeasurements {
  height: number;
  chest: number;
  waist: number;
  age?: number;
  gender?: 'male' | 'female';
}

export interface CompleteMeasurements extends BasicMeasurements {
  hip: number;
  thigh: number;
  inseam: number;
  sleeveLength: number;
  shoulderWidth: number;
  neck: number;
  ankle: number;
  wrist: number;
  bicep: number;
  forearm: number;
  calf: number;
}

export interface MeasurementPrediction {
  measurements: CompleteMeasurements;
  confidenceScores: Record<string, number>;
  modelVersion: string;
  processingTime: number;
}

export interface MeasurementProfile {
  id: string;
  userId: string;
  basicMeasurements: BasicMeasurements;
  aiPredictions: CompleteMeasurements;
  confidenceScores: Record<string, number>;
  userAdjustments?: Partial<CompleteMeasurements>;
  tailorVerified: boolean;
  createdAt: string;
  updatedAt: string;
}