import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cylinder, Sphere } from '@react-three/drei'
import * as THREE from 'three'

interface TransformerProps {
  position: [number, number, number]
  voltage: number
  status: 'online' | 'offline' | 'maintenance'
}

export const Transformer: React.FC<TransformerProps> = ({ 
  position, 
  voltage = 230, 
  status = 'online' 
}) => {
  const sparkRef = useRef<THREE.Group>(null)

  // Animate electrical sparks
  useFrame((state) => {
    if (sparkRef.current && status === 'online') {
      sparkRef.current.rotation.y = state.clock.elapsedTime * 2
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

  const getVoltageColor = () => {
    if (voltage >= 500) return '#dc2626'
    if (voltage >= 230) return '#f59e0b'
    if (voltage >= 115) return '#10b981'
    return '#3b82f6'
  }

  return (
    <group position={position}>
      {/* Main Transformer Tank */}
      <Box
        args={[3, 4, 5]}
        position={[0, 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#4a5568" />
      </Box>
      
      {/* Oil Tank */}
      <Cylinder
        args={[1.5, 1.5, 3]}
        position={[0, 1.5, -3]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#2d3748" />
      </Cylinder>
      
      {/* Bushings */}
      <Cylinder
        args={[0.2, 0.2, 2]}
        position={[-1, 5, 0]}
        castShadow
      >
        <meshStandardMaterial color="#92400e" />
      </Cylinder>
      
      <Cylinder
        args={[0.2, 0.2, 2]}
        position={[0, 5, 0]}
        castShadow
      >
        <meshStandardMaterial color="#92400e" />
      </Cylinder>
      
      <Cylinder
        args={[0.2, 0.2, 2]}
        position={[1, 5, 0]}
        castShadow
      >
        <meshStandardMaterial color="#92400e" />
      </Cylinder>
      
      {/* Voltage Level Indicator */}
      <Box
        args={[0.8, 0.8, 0.1]}
        position={[0, 3, 2.55]}
      >
        <meshStandardMaterial 
          color="#1f2937"
        />
      </Box>
      
      {/* Voltage Display */}
      <Box
        args={[0.6, 0.4, 0.05]}
        position={[0, 3, 2.6]}
      >
        <meshStandardMaterial 
          color={getVoltageColor()}
          emissive={new THREE.Color(getVoltageColor())}
          emissiveIntensity={0.2}
        />
      </Box>
      
      {/* Status Indicator */}
      <Sphere
        args={[0.3]}
        position={[1.8, 3.5, 0]}
      >
        <meshStandardMaterial 
          color={getStatusColor()}
          emissive={new THREE.Color(getStatusColor())}
          emissiveIntensity={0.5}
        />
      </Sphere>
      
      {/* Electrical Sparks Effect */}
      {status === 'online' && (
        <group ref={sparkRef}>
          <Sphere
            args={[0.1]}
            position={[-1, 6, 0]}
          >
            <meshBasicMaterial 
              color="#60a5fa" 
              transparent 
              opacity={0.8}
            />
          </Sphere>
          <Sphere
            args={[0.08]}
            position={[0, 6.1, 0]}
          >
            <meshBasicMaterial 
              color="#a78bfa" 
              transparent 
              opacity={0.6}
            />
          </Sphere>
          <Sphere
            args={[0.06]}
            position={[1, 5.9, 0]}
          >
            <meshBasicMaterial 
              color="#34d399" 
              transparent 
              opacity={0.7}
            />
          </Sphere>
        </group>
      )}
      
      {/* Cooling Fins */}
      <Box
        args={[0.1, 3, 4]}
        position={[-1.7, 2, 0]}
        castShadow
      >
        <meshStandardMaterial color="#374151" />
      </Box>
      <Box
        args={[0.1, 3, 4]}
        position={[1.7, 2, 0]}
        castShadow
      >
        <meshStandardMaterial color="#374151" />
      </Box>
      
      {/* Ground Connection */}
      <Cylinder
        args={[0.1, 0.1, 2]}
        position={[0, 1, 2.5]}
        castShadow
      >
        <meshStandardMaterial color="#059669" />
      </Cylinder>
    </group>
  )
}
