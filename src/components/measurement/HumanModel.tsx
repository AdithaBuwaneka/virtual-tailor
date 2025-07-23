// src/components/measurement/HumanModel.tsx
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cylinder, Sphere, Box } from '@react-three/drei'
import * as THREE from 'three'

interface HumanModelProps {
  measurements?: {
    height: number
    chest: number
    waist: number
  }
  position?: [number, number, number]
}

export const HumanModel: React.FC<HumanModelProps> = ({
  measurements,
  position = [0, 0, 0]
}) => {
  const groupRef = useRef<THREE.Group>(null)
  
  // Calculate proportions based on measurements
  const proportions = useMemo(() => {
    if (!measurements) {
      return {
        height: 175,
        chestWidth: 96,
        waistWidth: 84,
        scale: 1
      }
    }
    
    const scale = measurements.height / 175 // 175cm as baseline
    return {
      height: measurements.height,
      chestWidth: measurements.chest,
      waistWidth: measurements.waist,
      scale
    }
  }, [measurements])
  
  // Subtle animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
  })
  
  const bodyColor = '#fdbcb4' // Skin tone
  const clothingColor = '#4f46e5' // Indigo for clothing
  
  return (
    <group ref={groupRef} position={position} scale={proportions.scale}>
      {/* Head */}
      <Sphere args={[8, 16, 16]} position={[0, 75, 0]}>
        <meshLambertMaterial color={bodyColor} />
      </Sphere>
      
      {/* Neck */}
      <Cylinder args={[3, 3, 8, 12]} position={[0, 64, 0]}>
        <meshLambertMaterial color={bodyColor} />
      </Cylinder>
      
      {/* Torso (Chest area) */}
      <Box 
        args={[proportions.chestWidth / 4, 25, 12]} 
        position={[0, 45, 0]}
      >
        <meshLambertMaterial color={clothingColor} />
      </Box>
      
      {/* Waist */}
      <Box 
        args={[proportions.waistWidth / 4, 15, 10]} 
        position={[0, 25, 0]}
      >
        <meshLambertMaterial color={clothingColor} />
      </Box>
      
      {/* Hips */}
      <Box args={[proportions.chestWidth / 3.5, 12, 12]} position={[0, 12, 0]}>
        <meshLambertMaterial color={clothingColor} />
      </Box>
      
      {/* Left Arm */}
      <group position={[-proportions.chestWidth / 6, 45, 0]}>
        {/* Upper arm */}
        <Cylinder args={[3, 3, 20, 12]} position={[-8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshLambertMaterial color={clothingColor} />
        </Cylinder>
        {/* Forearm */}
        <Cylinder args={[2.5, 2.5, 18, 12]} position={[-22, -8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshLambertMaterial color={bodyColor} />
        </Cylinder>
        {/* Hand */}
        <Sphere args={[3, 12, 12]} position={[-32, -8, 0]}>
          <meshLambertMaterial color={bodyColor} />
        </Sphere>
      </group>
      
      {/* Right Arm */}
      <group position={[proportions.chestWidth / 6, 45, 0]}>
        {/* Upper arm */}
        <Cylinder args={[3, 3, 20, 12]} position={[8, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <meshLambertMaterial color={clothingColor} />
        </Cylinder>
        {/* Forearm */}
        <Cylinder args={[2.5, 2.5, 18, 12]} position={[22, -8, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <meshLambertMaterial color={bodyColor} />
        </Cylinder>
        {/* Hand */}
        <Sphere args={[3, 12, 12]} position={[32, -8, 0]}>
          <meshLambertMaterial color={bodyColor} />
        </Sphere>
      </group>
      
      {/* Left Leg */}
      <group position={[-8, 0, 0]}>
        {/* Thigh */}
        <Cylinder args={[4, 4, 25, 12]} position={[0, -15, 0]}>
          <meshLambertMaterial color={clothingColor} />
        </Cylinder>
        {/* Shin */}
        <Cylinder args={[3, 3, 22, 12]} position={[0, -40, 0]}>
          <meshLambertMaterial color={bodyColor} />
        </Cylinder>
        {/* Foot */}
        <Box args={[4, 3, 12]} position={[0, -54, 4]}>
          <meshLambertMaterial color="#2d3748" />
        </Box>
      </group>
      
      {/* Right Leg */}
      <group position={[8, 0, 0]}>
        {/* Thigh */}
        <Cylinder args={[4, 4, 25, 12]} position={[0, -15, 0]}>
          <meshLambertMaterial color={clothingColor} />
        </Cylinder>
        {/* Shin */}
        <Cylinder args={[3, 3, 22, 12]} position={[0, -40, 0]}>
          <meshLambertMaterial color={bodyColor} />
        </Cylinder>
        {/* Foot */}
        <Box args={[4, 3, 12]} position={[0, -54, 4]}>
          <meshLambertMaterial color="#2d3748" />
        </Box>
      </group>
    </group>
  )
}