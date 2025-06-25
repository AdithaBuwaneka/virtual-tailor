// src/components/measurement/MobileOptimized3D.tsx
import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { HumanModel } from './HumanModel'
import { Button } from '@/components/ui'
import { RotateCcw, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

interface MobileOptimized3DProps {
  measurements?: {
    height: number;
    chest: number;
    waist: number;
    [key: string]: number | undefined;
  }
  className?: string
}

export const MobileOptimized3D: React.FC<MobileOptimized3DProps> = ({
  measurements,
  className = "w-full h-64"
}) => {
  const [autoRotate, setAutoRotate] = useState(true)
  const [zoom, setZoom] = useState(200)
  
  // Touch-friendly controls
  const handleZoomIn = () => setZoom(prev => Math.max(100, prev - 50))
  const handleZoomOut = () => setZoom(prev => Math.min(400, prev + 50))
  const handleReset = () => {
    setZoom(200)
    setAutoRotate(true)
  }
  
  return (
    <div className={`${className} rounded-lg overflow-hidden border border-gray-200 relative`}>
      {/* Mobile Controls */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          className="w-8 h-8 p-0"
        >
          <ZoomIn className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          className="w-8 h-8 p-0"
        >
          <ZoomOut className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAutoRotate(!autoRotate)}
          className="w-8 h-8 p-0"
        >
          <RotateCw className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="w-8 h-8 p-0"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 100, zoom], fov: 50 }}
        performance={{ min: 0.5 }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
      >
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          minDistance={100}
          maxDistance={400}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          touches={{
            ONE: 2, // TOUCH.ROTATE
            TWO: 1  // TOUCH.DOLLY_PAN
          }}
        />
        
        {/* Simplified lighting for mobile */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        
        {/* Human Model */}
        <HumanModel 
          measurements={measurements}
          position={[0, -50, 0]}
        />
      </Canvas>
      
      {/* Touch Instructions */}
      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs p-2 rounded">
        <div>👆 Touch to rotate</div>
        <div>🤏 Pinch to zoom</div>
      </div>
    </div>
  )
}
