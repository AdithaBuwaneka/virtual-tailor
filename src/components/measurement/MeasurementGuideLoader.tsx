// src/components/measurement/MeasurementGuideLoader.tsx
import React, { Suspense, useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html, Environment } from '@react-three/drei'
import { LoadingSpinner, Button } from '@/components/ui'
import { RotateCcw, ZoomIn, ZoomOut, Play, Pause } from 'lucide-react'
import * as THREE from 'three'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

interface GLBModelProps {
  url: string
  position?: [number, number, number]
  scale?: number
  autoRotate?: boolean
}

// GLB Model Component with auto-rotation
const GLBModel: React.FC<GLBModelProps> = ({ 
  url, 
  position = [0, 0, 0], 
  scale = 1, 
  autoRotate = false 
}) => {
  const meshRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(url)
  
  // Auto-rotate the model
  useFrame((state) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })
  
  return (
    <group ref={meshRef} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

// Loading fallback
const ModelLoader: React.FC = () => (
  <Html center>
    <div className="flex flex-col items-center p-6 bg-white/90 backdrop-blur-sm rounded-lg">
      <LoadingSpinner size="lg" />
      <p className="mt-3 text-gray-600 font-medium">Loading 3D Guide...</p>
    </div>
  </Html>
)

interface MeasurementGuideLoaderProps {
  measurementType: string
  className?: string
  showInstructions?: boolean
}

export const MeasurementGuideLoader: React.FC<MeasurementGuideLoaderProps> = ({
  measurementType,
  className = "w-full h-96",
  showInstructions = true
}) => {
  const [modelScale, setModelScale] = useState(0.3)
  const [autoRotate, setAutoRotate] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modelPosition, setModelPosition] = useState<[number, number, number]>([0, -4.0, 0])
  const controlsRef = useRef<OrbitControlsImpl>(null)
    // Map measurement types to GLB file paths
  const modelPaths: Record<string, string> = {
    height: '/models/waist-guide.glb', // Using waist guide as fallback
    chest: '/models/waist-guide.glb', 
    waist: '/models/waist-guide.glb',
    hip: '/models/waist-guide.glb',
    shoulder: '/models/waist-guide.glb',
    sleeve: '/models/waist-guide.glb',
    inseam: '/models/waist-guide.glb',
    thigh: '/models/waist-guide.glb',
    neck: '/models/waist-guide.glb'
  }
  
  // Measurement instructions
  const instructions: Record<string, string> = {
    height: "Stand straight against a wall. Measure from the top of your head to the floor.",
    chest: "Wrap the measuring tape around the fullest part of your chest, keeping it level.",
    waist: "Measure around your natural waistline - the narrowest part of your torso.",
    hip: "Measure around the fullest part of your hips, typically 7-9 inches below your waist.",
    shoulder: "Measure from the tip of one shoulder to the tip of the other.",
    sleeve: "Measure from your shoulder down to your wrist.",
    inseam: "Measure from your crotch down to your ankle along the inside of your leg.",
    thigh: "Measure around the fullest part of your thigh.",
    neck: "Measure around the base of your neck where a collar would sit."
  }
  
  const currentModelPath = modelPaths[measurementType]
  const currentInstruction = instructions[measurementType]
  
  // Keyboard controls for model positioning
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const moveDistance = 0.2
      
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          setModelPosition(prev => [prev[0], prev[1] + moveDistance, prev[2]])
          break
        case 'ArrowDown':
          event.preventDefault()
          setModelPosition(prev => [prev[0], prev[1] - moveDistance, prev[2]])
          break
        case 'ArrowLeft':
          event.preventDefault()
          setModelPosition(prev => [prev[0] - moveDistance, prev[1], prev[2]])
          break
        case 'ArrowRight':
          event.preventDefault()
          setModelPosition(prev => [prev[0] + moveDistance, prev[1], prev[2]])
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  // Handle zoom and controls
  const handleZoomIn = () => {
    if (controlsRef.current) {
      const distance = controlsRef.current.getDistance()
      const newDistance = Math.max(distance - 0.5, 3)
      controlsRef.current.object.position.normalize().multiplyScalar(newDistance)
      controlsRef.current.update()
    }
  }
  
  const handleZoomOut = () => {
    if (controlsRef.current) {
      const distance = controlsRef.current.getDistance()
      const newDistance = Math.min(distance + 0.5, 12)
      controlsRef.current.object.position.normalize().multiplyScalar(newDistance)
      controlsRef.current.update()
    }
  }
  
  const handleReset = () => {
    setModelScale(0.3)
    setAutoRotate(false)
    setModelPosition([0, -4.0, 0]) // Reset model position
    if (controlsRef.current) {
      // Reset camera to initial position that shows full body
      controlsRef.current.object.position.set(0, 0, 8)
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }
  }
    if (!currentModelPath) {
    return (
      <div className={`${className} rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50`}>
        <p className="text-gray-500">Guide model not available for {measurementType}</p>
      </div>
    )
  }
  
  return (
    <div className={`${className} rounded-lg overflow-hidden border border-gray-200 bg-gradient-to-b from-blue-50 to-white relative`}>
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-50">
          <div className="text-center p-6">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-gray-600 text-sm mb-2">{error}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setError(null)
                window.location.reload()
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* 3D Canvas */}
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
            style={{ width: '100%', height: '100%' }}
            onCreated={({ gl }) => {
              gl.setSize(gl.domElement.clientWidth, gl.domElement.clientHeight)
            }}
            onError={(error) => {
              console.error('3D Canvas Error:', error)
              setError('Failed to load 3D model viewer')
            }}
          >
        {/* Enhanced Camera Controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={12}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          zoomSpeed={1}
          rotateSpeed={0.8}
          panSpeed={1}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          dampingFactor={0.1}
          enableDamping={true}
          target={[0, 0, 0]}
        />
        
        {/* Improved Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={20}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-3, 2, -3]} intensity={0.4} />
        <pointLight position={[3, 2, 3]} intensity={0.3} />
        
        {/* Environment */}
        <Environment preset="warehouse" />
        
        {/* Load GLB Model */}
        <Suspense fallback={<ModelLoader />}>
          <GLBModel 
            url={currentModelPath}
            position={modelPosition}
            scale={modelScale}
            autoRotate={false}
          />
        </Suspense>
      </Canvas>
        {/* Enhanced Controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          className="w-10 h-10 p-0 bg-white/95 hover:bg-white border shadow-sm"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          className="w-10 h-10 p-0 bg-white/95 hover:bg-white border shadow-sm"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`w-10 h-10 p-0 bg-white/95 hover:bg-white border shadow-sm ${autoRotate ? 'bg-blue-50 border-blue-200' : ''}`}
          title={autoRotate ? "Stop Rotation" : "Start Rotation"}
        >
          {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="w-10 h-10 p-0 bg-white/95 hover:bg-white border shadow-sm"
          title="Reset View"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
        {/* Model Scale Controls */}
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-sm rounded p-2 text-xs font-medium text-gray-700 border shadow-sm">
          Size: {modelScale.toFixed(1)}x
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setModelScale(prev => Math.min(prev + 0.1, 2.5))}
          className="w-8 h-8 p-0 bg-white/95 hover:bg-white text-lg font-bold"
          title="Increase Size"
        >
          +
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setModelScale(prev => Math.max(prev - 0.1, 0.3))}
          className="w-8 h-8 p-0 bg-white/95 hover:bg-white text-lg font-bold"
          title="Decrease Size"
        >
          -
        </Button>      </div>
      
      {/* Instructions */}
      {showInstructions && currentInstruction && (
        <div className="absolute bottom-3 left-3 right-20 bg-black/90 text-white p-4 rounded-lg backdrop-blur-sm">
          <div className="text-sm font-semibold mb-2 text-blue-200 flex items-center">
            📏 How to measure {measurementType}:
          </div>
          <div className="text-sm leading-relaxed">{currentInstruction}</div>
        </div>
      )}
      
      {/* Enhanced Control Help */}
      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm p-3 rounded-lg text-xs border shadow-lg max-w-52">
        <div className="font-semibold text-gray-800 mb-2">💡 Controls:</div>
        <div className="space-y-1 text-gray-600">
          <div>🖱️ <strong>Left drag:</strong> Rotate view</div>
          <div>🔍 <strong>Wheel:</strong> Zoom in/out</div>
          <div>🖱️ <strong>Right drag:</strong> Pan around</div>
          <div>⚙️ <strong>Buttons:</strong> Zoom & controls</div>
          <div>⌨️ <strong>Arrow keys:</strong> Move model</div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}