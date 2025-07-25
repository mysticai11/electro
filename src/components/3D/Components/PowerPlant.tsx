import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cylinder, Sphere } from '@react-three/drei'
import { useBox } from '@react-three/cannon'
import * as THREE from 'three'

interface PowerPlantProps {
  position: [number, number, number]
  status: 'online' | 'offline' | 'maintenance'
  capacity: number
}

export const PowerPlant: React.FC<PowerPlantProps> = ({ 
  position, 
  status = 'online'
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const smokeRef = useRef<THREE.Mesh>(null)
  
  // Physics body for the main building
  useBox(() => ({
    position,
    args: [8, 6, 12],
    type: 'Static',
  }))

  // Animate smoke particles
  useFrame((state) => {
    if (smokeRef.current && status === 'online') {
      smokeRef.current.position.y = 12 + Math.sin(state.clock.elapsedTime * 2) * 0.5
      const material = smokeRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  const getStatusColor = () => {
    switch (status) {
      case 'online': return '#10b981'
      case 'offline': return '#ef4444'
      case 'maintenance': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Main Building */}
      <Box
        args={[8, 6, 12]}
        position={[0, 3, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#4a5568" />
      </Box>
      
      {/* Cooling Towers */}
      <Cylinder
        args={[2, 3, 8]}
        position={[-6, 4, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#718096" />
      </Cylinder>
      
      <Cylinder
        args={[2, 3, 8]}
        position={[6, 4, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#718096" />
      </Cylinder>
      
      {/* Chimney */}
      <Cylinder
        args={[0.8, 0.8, 16]}
        position={[0, 8, -4]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#2d3748" />
      </Cylinder>
      
      {/* Smoke Effect */}
      {status === 'online' && (
        <Sphere
          ref={smokeRef}
          args={[1.5]}
          position={[0, 12, -4]}
        >
          <meshBasicMaterial 
            color="#e2e8f0" 
            transparent 
            opacity={0.3}
          />
        </Sphere>
      )}
      
      {/* Status Indicator */}
      <Sphere
        args={[0.5]}
        position={[0, 8, 6]}
      >
        <meshStandardMaterial 
          color={getStatusColor()}
          emissive={new THREE.Color(getStatusColor())}
          emissiveIntensity={0.3}
        />
      </Sphere>
      
      {/* Electrical Infrastructure */}
      <Box
        args={[1, 8, 1]}
        position={[4, 4, 6]}
        castShadow
      >
        <meshStandardMaterial color="#2d3748" />
      </Box>
      
      <Box
        args={[1, 8, 1]}
        position={[-4, 4, 6]}
        castShadow
      >
        <meshStandardMaterial color="#2d3748" />
      </Box>
      
      {/* Power Lines Connection Points */}
      <Sphere
        args={[0.3]}
        position={[4, 8, 6]}
      >
        <meshStandardMaterial color="#fbbf24" />
      </Sphere>
      
      <Sphere
        args={[0.3]}
        position={[-4, 8, 6]}
      >
        <meshStandardMaterial color="#fbbf24" />
      </Sphere>
    </group>
  )
}
