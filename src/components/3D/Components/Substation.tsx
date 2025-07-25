import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cylinder } from '@react-three/drei'
import * as THREE from 'three'

interface SubstationProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  voltage: number
  load: number
}

export const Substation: React.FC<SubstationProps> = ({ 
  position, 
  rotation = [0, 0, 0], 
  voltage,
  load 
}) => {
  // Calculate visual intensity based on voltage and load
  const voltageIntensity = Math.min(voltage / 500000, 1) // Normalize to 500kV max
  const switchgearRef = useRef<THREE.Group>(null)
  const transformerRef = useRef<THREE.Mesh>(null)
  const arcLightRef = useRef<THREE.Mesh>(null)
  const coolingFanRef = useRef<THREE.Group>(null)

  // Animate based on electrical activity
  useFrame((state) => {
    const loadFactor = load / 100
    const time = state.clock.elapsedTime
    
    if (transformerRef.current) {
      // Transformer vibration based on load
      transformerRef.current.position.y = 2 + Math.sin(time * 60) * loadFactor * 0.02
    }
    
    if (arcLightRef.current) {
      const material = arcLightRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = Math.max(0.1, loadFactor * voltageIntensity * (0.5 + Math.sin(time * 10) * 0.3))
    }
    
    if (coolingFanRef.current) {
      coolingFanRef.current.rotation.z += loadFactor * 0.2
    }
    
    if (switchgearRef.current) {
      // Electrical field visualization
      switchgearRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material as THREE.MeshStandardMaterial
          if (material.emissive) {
            material.emissiveIntensity = 0.1 + Math.sin(time * 5 + index) * loadFactor * 0.1
          }
        }
      })
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Perimeter Fence */}
      <group>
        {/* Fence Posts */}
        {Array.from({ length: 20 }, (_, i) => {
          const angle = (i / 20) * Math.PI * 2
          const radius = 25
          return (
            <Cylinder
              key={i}
              args={[0.1, 0.1, 4]}
              position={[
                Math.cos(angle) * radius,
                2,
                Math.sin(angle) * radius
              ]}
              castShadow
            >
              <meshStandardMaterial color="#6b7280" />
            </Cylinder>
          )
        })}
        
        {/* Warning Signs */}
        <Box
          args={[2, 1.5, 0.1]}
          position={[20, 3, 0]}
          castShadow
        >
          <meshStandardMaterial color="#dc2626" />
        </Box>
      </group>
      
      {/* Main Transformer */}
      <mesh ref={transformerRef} castShadow receiveShadow>
        <boxGeometry args={[8, 4, 6]} />
        <meshStandardMaterial 
          color="#4b5563"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      
      {/* Transformer Cooling System */}
      <group ref={coolingFanRef} position={[4.5, 2, 0]}>
        {Array.from({ length: 3 }, (_, i) => (
          <group key={i} position={[0, i * 1.5 - 1.5, 0]}>
            <Cylinder
              args={[0.8, 0.8, 0.2]}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
            >
              <meshStandardMaterial color="#374151" />
            </Cylinder>
            {/* Fan Blades */}
            {Array.from({ length: 6 }, (_, j) => (
              <Box
                key={j}
                args={[0.6, 0.05, 0.1]}
                position={[0.3 * Math.cos(j * Math.PI / 3), 0, 0.3 * Math.sin(j * Math.PI / 3)]}
                rotation={[0, j * Math.PI / 3, Math.PI / 2]}
              >
                <meshStandardMaterial color="#6b7280" />
              </Box>
            ))}
          </group>
        ))}
      </group>
      
      {/* Oil Conservator Tank */}
      <Cylinder
        args={[1.5, 1.5, 3]}
        position={[0, 6, 0]}
        castShadow
      >
        <meshStandardMaterial color="#9ca3af" />
      </Cylinder>
      
      {/* Switchgear */}
      <group ref={switchgearRef} position={[-8, 0, 0]}>
        {Array.from({ length: 3 }, (_, i) => (
          <group key={i} position={[0, 0, i * 4 - 4]}>
            {/* Switch Cabinet */}
            <Box
              args={[2, 6, 3]}
              position={[0, 3, 0]}
              castShadow
            >
              <meshStandardMaterial 
                color="#374151"
                emissive={new THREE.Color('#3b82f6')}
                emissiveIntensity={0.1}
              />
            </Box>
            
            {/* Busbar */}
            <Box
              args={[0.3, 0.3, 3]}
              position={[1.5, 6.5, 0]}
              castShadow
            >
              <meshStandardMaterial 
                color="#fbbf24"
                metalness={0.8}
                roughness={0.1}
              />
            </Box>
            
            {/* Insulators */}
            <Cylinder
              args={[0.2, 0.3, 2]}
              position={[1.5, 8, 0]}
              castShadow
            >
              <meshStandardMaterial color="#f3f4f6" />
            </Cylinder>
          </group>
        ))}
      </group>
      
      {/* High Voltage Lines */}
      <group position={[0, 12, 0]}>
        {Array.from({ length: 4 }, (_, i) => (
          <group key={i}>
            {/* Support Tower */}
            <Box
              args={[0.5, 8, 0.5]}
              position={[i * 8 - 12, 4, 0]}
              castShadow
            >
              <meshStandardMaterial color="#6b7280" />
            </Box>
            
            {/* Cross Arms */}
            <Box
              args={[6, 0.3, 0.3]}
              position={[i * 8 - 12, 7.5, 0]}
              castShadow
            >
              <meshStandardMaterial color="#4b5563" />
            </Box>
            
            {/* Power Lines */}
            {Array.from({ length: 3 }, (_, j) => (
              <mesh
                key={j}
                position={[i * 8 - 12, 7.5, (j - 1) * 2]}
              >
                <cylinderGeometry args={[0.05, 0.05, 8]} />
                <meshStandardMaterial 
                  color="#1f2937"
                  emissive={new THREE.Color('#3b82f6')}
                  emissiveIntensity={load / 200}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      
      {/* Control Room */}
      <Box
        args={[6, 3, 4]}
        position={[12, 1.5, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#e5e7eb" />
      </Box>
      
      {/* Control Room Windows */}
      <Box
        args={[4, 1.5, 0.1]}
        position={[11.9, 2, 0]}
        castShadow
      >
        <meshStandardMaterial 
          color="#3b82f6"
          transparent
          opacity={0.3}
        />
      </Box>
      
      {/* Lightning Rods */}
      {Array.from({ length: 4 }, (_, i) => (
        <group key={i}>
          <Cylinder
            args={[0.05, 0.05, 6]}
            position={[
              8 * Math.cos(i * Math.PI / 2),
              15,
              8 * Math.sin(i * Math.PI / 2)
            ]}
            castShadow
          >
            <meshStandardMaterial color="#fbbf24" />
          </Cylinder>
          
          {/* Lightning Rod Tip */}
          <mesh
            position={[
              8 * Math.cos(i * Math.PI / 2),
              18,
              8 * Math.sin(i * Math.PI / 2)
            ]}
          >
            <sphereGeometry args={[0.1]} />
            <meshStandardMaterial 
              color="#fbbf24"
              emissive={new THREE.Color('#fbbf24')}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
      
      {/* Electrical Arc Visualization */}
      <mesh ref={arcLightRef} position={[0, 8, 0]}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial 
          color="#a855f7"
          transparent
          opacity={0.3}
          emissive={new THREE.Color('#a855f7')}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Ground Grid */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial 
          color="#6b7280"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Emergency Equipment */}
      <Box
        args={[1, 1.5, 0.5]}
        position={[15, 0.75, 8]}
        castShadow
      >
        <meshStandardMaterial color="#dc2626" />
      </Box>
      
      {/* Monitoring Sensors */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh
          key={i}
          position={[
            5 * Math.cos(i * Math.PI / 3),
            1,
            5 * Math.sin(i * Math.PI / 3)
          ]}
        >
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial 
            color="#10b981"
            emissive={new THREE.Color('#10b981')}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}
