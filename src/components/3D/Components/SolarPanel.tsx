import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Plane } from '@react-three/drei'
import * as THREE from 'three'

interface SolarPanelProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  sunAngle?: number
  efficiency?: number
}

export const SolarPanel: React.FC<SolarPanelProps> = ({ 
  position, 
  rotation = [0, 0, 0], 
  sunAngle = Math.PI / 4,
  efficiency = 0.85 
}) => {
  const panelGroupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const energyParticlesRef = useRef<THREE.Points>(null)

  // Animate panel tracking and energy visualization
  useFrame((state) => {
    if (panelGroupRef.current) {
      // Solar tracking - rotate panels to follow sun
      panelGroupRef.current.rotation.y = sunAngle + Math.sin(state.clock.elapsedTime * 0.1) * 0.1
      panelGroupRef.current.rotation.x = -0.3 + Math.sin(state.clock.elapsedTime * 0.05) * 0.05
    }
    
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = efficiency * (0.3 + Math.sin(state.clock.elapsedTime) * 0.1)
    }
    
    if (energyParticlesRef.current) {
      energyParticlesRef.current.rotation.y += 0.01
    }
  })

  // Create energy particle system
  const particleCount = 100
  const particlePositions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 20
    particlePositions[i * 3 + 1] = Math.random() * 10
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  return (
    <group position={position} rotation={rotation}>
      {/* Foundation */}
      <Box
        args={[12, 0.5, 8]}
        position={[0, 0.25, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#6b7280" />
      </Box>
      
      {/* Support Structure */}
      <Box
        args={[1, 6, 1]}
        position={[-4, 3, -2]}
        castShadow
      >
        <meshStandardMaterial color="#4b5563" />
      </Box>
      <Box
        args={[1, 6, 1]}
        position={[4, 3, -2]}
        castShadow
      >
        <meshStandardMaterial color="#4b5563" />
      </Box>
      <Box
        args={[1, 4, 1]}
        position={[-4, 2, 2]}
        castShadow
      >
        <meshStandardMaterial color="#4b5563" />
      </Box>
      <Box
        args={[1, 4, 1]}
        position={[4, 2, 2]}
        castShadow
      >
        <meshStandardMaterial color="#4b5563" />
      </Box>
      
      {/* Cross Beams */}
      <Box
        args={[8, 0.3, 0.3]}
        position={[0, 5.5, -2]}
        castShadow
      >
        <meshStandardMaterial color="#374151" />
      </Box>
      <Box
        args={[8, 0.3, 0.3]}
        position={[0, 3.5, 2]}
        castShadow
      >
        <meshStandardMaterial color="#374151" />
      </Box>
      
      {/* Solar Panel Array */}
      <group ref={panelGroupRef} position={[0, 4, 0]}>
        {/* Main Panel Grid */}
        {Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 4 }, (_, col) => (
            <group key={`${row}-${col}`} position={[
              (col - 1.5) * 2.5,
              0,
              (row - 2.5) * 1.5
            ]}>
              {/* Panel Frame */}
              <Box
                args={[2.3, 0.1, 1.3]}
                position={[0, 0.05, 0]}
                castShadow
              >
                <meshStandardMaterial color="#1f2937" />
              </Box>
              
              {/* Solar Cells */}
              <Plane
                args={[2.2, 1.2]}
                position={[0, 0.1, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <meshStandardMaterial 
                  color="#1e40af"
                  metalness={0.3}
                  roughness={0.1}
                  emissive={new THREE.Color('#3b82f6')}
                  emissiveIntensity={0.1}
                />
              </Plane>
              
              {/* Cell Grid Lines */}
              <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2.2, 1.2]} />
                <meshBasicMaterial 
                  color="#1e3a8a"
                  transparent
                  opacity={0.3}
                  wireframe
                />
              </mesh>
            </group>
          ))
        )}
        
        {/* Energy Collection Visualization */}
        <mesh ref={glowRef} position={[0, 0.2, 0]}>
          <planeGeometry args={[10, 6]} />
          <meshStandardMaterial 
            color="#fbbf24"
            transparent
            opacity={0.1}
            emissive={new THREE.Color('#fbbf24')}
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
      
      {/* Energy Particles */}
      <points ref={energyParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#fbbf24"
          size={0.1}
          transparent
          opacity={0.6}
        />
      </points>
      
      {/* Inverter Box */}
      <Box
        args={[2, 1.5, 1]}
        position={[6, 0.75, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#374151" />
      </Box>
      
      {/* Power Cables */}
      <Box
        args={[0.2, 0.2, 8]}
        position={[3, 1, 0]}
        castShadow
      >
        <meshStandardMaterial color="#1f2937" />
      </Box>
      
      {/* Monitoring Equipment */}
      <Box
        args={[1, 0.8, 0.5]}
        position={[5.5, 2, 0]}
        castShadow
      >
        <meshStandardMaterial color="#6b7280" />
      </Box>
      
      {/* Status Light */}
      <mesh position={[5.5, 2.5, 0.3]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial 
          color="#10b981"
          emissive={new THREE.Color('#10b981')}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Weather Station */}
      <Box
        args={[0.5, 2, 0.5]}
        position={[-6, 1, 0]}
        castShadow
      >
        <meshStandardMaterial color="#9ca3af" />
      </Box>
      
      {/* Sun Tracker */}
      <mesh position={[-6, 2.5, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial 
          color="#fbbf24"
          emissive={new THREE.Color('#fbbf24')}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}
