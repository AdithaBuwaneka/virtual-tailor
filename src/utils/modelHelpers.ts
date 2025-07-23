// src/utils/modelHelpers.ts
import { useGLTF } from '@react-three/drei'

// Preload models for better performance
export const preloadMeasurementModels = () => {
  const modelPaths = [
    '/models/waist-guide.glb' // Currently available model
    // Add more models as they become available:
    // '/models/height-guide.glb',
    // '/models/chest-guide.glb',
    // '/models/hip-guide.glb',
    // '/models/shoulder-guide.glb',
    // '/models/sleeve-guide.glb',
    // '/models/inseam-guide.glb',
    // '/models/thigh-guide.glb',
    // '/models/neck-guide.glb'
  ]
  
  modelPaths.forEach(path => {
    useGLTF.preload(path)
  })
}
