// src/utils/constants.ts
export const MEASUREMENT_FIELDS = [
  'height',
  'chest',
  'waist',
  'hip',
  'thigh',
  'inseam',
  'sleeveLength',
  'shoulderWidth',
  'neck',
  'ankle',
  'wrist',
  'bicep',
  'forearm',
  'calf'
] as const;

export const GARMENT_TYPES = [
  'shirt',
  'pants',
  'dress',
  'suit',
  'traditional-saree',
  'traditional-kurta',
  'traditional-sarong',
  'jacket',
  'blouse',
  'skirt'
] as const;

export const CULTURAL_STYLES = [
  'western',
  'traditional-sinhala',
  'traditional-tamil',
  'traditional-muslim',
  'indo-western',
  'modern-fusion'
] as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  MEASUREMENTS: {
    COMPLETE: '/measurements/complete',
    ADJUST: '/measurements/adjust',
    PROFILE: '/measurements/profile',
  },
  TAILORS: {
    BROWSE: '/tailors',
    PROFILE: '/tailors/:id',
    SEARCH: '/tailors/search',
  },
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: '/orders/:id',
    UPDATE: '/orders/:id',
  },
  AI: {
    PREDICT: '/ai/predict-measurements',
    REPREDICTION: '/ai/smart-reprediction',
    CHATBOT: '/ai/chatbot',
  }
} as const;