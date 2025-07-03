// src/components/measurement/MeasurementPoints.tsx
import React, { useState } from 'react'
import { Html } from '@react-three/drei'

interface MeasurementPointsProps {
  onPointClick?: (measurement: string) => void
  activePoint?: string | null
}

interface MeasurementPoint {
  id: string
  position: [number, number, number]
  label: string
  color: string
}

export const MeasurementPoints: React.FC<MeasurementPointsProps> = ({
  onPointClick,
  activePoint
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)
  
  // Define measurement point positions relative to the human model
  const measurementPoints: MeasurementPoint[] = [
    { id: 'height', position: [0, 75, 0], label: 'Height', color: '#3b82f6' },
    { id: 'chest', position: [0, 50, 15], label: 'Chest', color: '#10b981' },
    { id: 'waist', position: [0, 25, 15], label: 'Waist', color: '#8b5cf6' },
    { id: 'hip', position: [0, 12, 15], label: 'Hip', color: '#f59e0b' },
    { id: 'shoulderWidth', position: [20, 55, 5], label: 'Shoulder', color: '#ef4444' },
    { id: 'sleeveLength', position: [-25, 35, 0], label: 'Sleeve', color: '#06b6d4' },
    { id: 'inseam', position: [-8, -25, 5], label: 'Inseam', color: '#84cc16' },
    { id: 'thigh', position: [-8, -10, 10], label: 'Thigh', color: '#f97316' },
    { id: 'neck', position: [0, 64, 8], label: 'Neck', color: '#ec4899' }
  ]
  
  return (
    <group>
      {measurementPoints.map((point) => (
        <MeasurementPoint
          key={point.id}
          point={point}
          isActive={activePoint === point.id}
          isHovered={hoveredPoint === point.id}
          onClick={() => onPointClick?.(point.id)}
          onHover={(hovered) => setHoveredPoint(hovered ? point.id : null)}
        />
      ))}
    </group>
  )
}

interface MeasurementPointComponentProps {
  point: MeasurementPoint
  isActive: boolean
  isHovered: boolean
  onClick: () => void
  onHover: (hovered: boolean) => void
}

const MeasurementPoint: React.FC<MeasurementPointComponentProps> = ({
  point,
  isActive,
  isHovered,
  onClick,
  onHover
}) => {
  const scale = isActive ? 1.5 : isHovered ? 1.2 : 1
  const opacity = isActive ? 1 : isHovered ? 0.9 : 0.7
  
  return (
    <group position={point.position}>
      {/* Point Sphere */}
      <mesh
        onClick={onClick}
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
        scale={scale}
      >
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial 
          color={point.color} 
          transparent 
          opacity={opacity}
          emissive={point.color}
          emissiveIntensity={isActive ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Pulsing ring for active point */}
      {isActive && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3, 4, 32]} />
          <meshBasicMaterial 
            color={point.color} 
            transparent 
            opacity={0.5}
            side={2}
          />
        </mesh>
      )}
      
      {/* Label */}
      {(isHovered || isActive) && (
        <Html
          position={[0, 4, 0]}
          center
          style={{
            pointerEvents: 'none',
            transform: 'translate3d(-50%, -50%, 0)'
          }}
        >
          <div className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
            {point.label}
          </div>
        </Html>
      )}
    </group>
  )
}