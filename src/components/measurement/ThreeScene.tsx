// src/components/measurement/ThreeScene.tsx
import React, { useEffect, useState, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import * as THREE from 'three'
import { LoadingSpinner } from '@/components/ui'
import { MeasurementPoints } from './MeasurementPoints'

interface ThreeSceneProps {
  measurements?: {
    height: number
    chest: number
    waist: number
  }
  onMeasurementClick?: (measurement: string) => void
  showMeasurementPoints?: boolean
  activePoint?: string | null
  className?: string
}

// Camera controller component
const CameraController: React.FC<{ measurements?: { height?: number } }> = ({ measurements }) => {
  const { camera } = useThree()
  
  useEffect(() => {
    if (measurements?.height) {
      // Adjust camera based on height
      const heightScale = measurements.height / 175 // 175cm as baseline
      camera.position.set(0, heightScale * 100, heightScale * 200)
    }
  }, [camera, measurements])
  
  return null
}

// Responsive scene controller
const ResponsiveScene: React.FC = () => {
  const { size, camera } = useThree()
  
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = size.width / size.height
      camera.updateProjectionMatrix()
    }
  }, [size, camera])
  
  return null
}

// Loading fallback component
const SceneLoader: React.FC = () => (
  <Html center>
    <div className="flex flex-col items-center p-6 bg-white/90 backdrop-blur-sm rounded-lg">
      <LoadingSpinner size="lg" />
      <p className="mt-3 text-gray-600 font-medium">Loading 3D Model...</p>
    </div>
  </Html>
)

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  measurements,
  onMeasurementClick,
  showMeasurementPoints = true,
  activePoint,
  className = "w-full h-96"
}) => {
  const [error, setError] = useState<string | null>(null)
  
  // Handle 3D scene errors
  const handleError = (error: Error) => {
    console.error('3D Scene Error:', error)
    setError('Failed to load 3D visualization')
  }
  
  return (
    <div className={`${className} rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-b from-blue-50 to-white relative`}>
      {error ? (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center p-6">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-gray-600 text-sm">{error}</p>
            <button 
              onClick={() => {
                setError(null)
              }}
              className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <Canvas
          shadows
          camera={{ position: [0, 100, 200], fov: 50 }}
          onError={() => handleError(new Error('3D scene error'))}
          onCreated={() => {}}
        >
          {/* Responsive scene controller */}
          <ResponsiveScene />
          
          {/* Camera controller */}
          <CameraController measurements={measurements} />
          
          {/* Camera controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={100}
            maxDistance={500}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
          
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-10, -10, -5]} intensity={0.3} />
          
          {/* Environment */}
          <Environment preset="studio" />
          
          {/* 3D Content */}
          <Suspense fallback={<SceneLoader />}>
            {/* Human Model */}
            
            {/* Measurement Points */}
            {showMeasurementPoints && (
              <MeasurementPoints 
                onPointClick={onMeasurementClick}
                activePoint={activePoint}
              />
            )}
          </Suspense>
        </Canvas>
      )}
      
      {/* 3D Controls Help */}
      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs p-2 rounded backdrop-blur-sm">
        <div>🖱️ Drag to rotate</div>
        <div>🔍 Scroll to zoom</div>
      </div>
      
      {/* Model Info */}
      {measurements && (
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-3 rounded-lg text-sm">
          <div className="font-medium text-gray-900 mb-1">Model Preview</div>
          <div className="space-y-1 text-gray-600">
            <div>Height: {measurements.height}cm</div>
            <div>Chest: {measurements.chest}cm</div>
            <div>Waist: {measurements.waist}cm</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ThreeScene