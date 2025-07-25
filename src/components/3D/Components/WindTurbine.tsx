import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cylinder, Box } from '@react-three/drei'
import * as THREE from 'three'

interface WindTurbineProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  windSpeed?: number
}

export const WindTurbine: React.FC<WindTurbineProps> = ({ 
  position, 
  rotation = [0, 0, 0], 
  windSpeed = 10 
}) => {
  const rotorRef = useRef<THREE.Group>(null)
  const nacelleLightRef = useRef<THREE.Mesh>(null)

  // Animate turbine rotation based on wind speed
  useFrame((state) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.z += (windSpeed / 100) * 0.1
    }
    
    if (nacelleLightRef.current) {
      const material = nacelleLightRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Tower */}
      <Cylinder
        args={[1.2, 2, 30]}
        position={[0, 15, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#e5e7eb" />
      </Cylinder>
      
      {/* Foundation */}
      <Cylinder
        args={[3, 3, 2]}
        position={[0, 1, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#6b7280" />
      </Cylinder>
      
      {/* Nacelle */}
      <Box
        args={[6, 2.5, 3]}
        position={[0, 30, 0]}
        castShadow
      >
        <meshStandardMaterial color="#9ca3af" />
      </Box>
      
      {/* Hub */}
      <Cylinder
        args={[1, 1, 2]}
        position={[3, 30, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial color="#4b5563" />
      </Cylinder>
      
      {/* Rotor Assembly */}
      <group ref={rotorRef} position={[4, 30, 0]}>
        {/* Blade 1 */}
        <Box
          args={[12, 0.3, 0.8]}
          position={[6, 0, 0]}
          castShadow
        >
          <meshStandardMaterial color="#f3f4f6" />
        </Box>
        
        {/* Blade 2 */}
        <Box
          args={[12, 0.3, 0.8]}
          position={[-3, 5.2, 0]}
          rotation={[0, 0, Math.PI * 2 / 3]}
          castShadow
        >
          <meshStandardMaterial color="#f3f4f6" />
        </Box>
        
        {/* Blade 3 */}
        <Box
          args={[12, 0.3, 0.8]}
          position={[-3, -5.2, 0]}
          rotation={[0, 0, Math.PI * 4 / 3]}
          castShadow
        >
          <meshStandardMaterial color="#f3f4f6" />
        </Box>
      </group>
      
      {/* Aviation Warning Light */}
      <mesh 
        ref={nacelleLightRef}
        position={[0, 32.5, 0]}
      >
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial 
          color="#ef4444"
          emissive={new THREE.Color('#ef4444')}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Power Cable */}
      <Cylinder
        args={[0.1, 0.1, 15]}
        position={[-0.8, 7.5, 0]}
        castShadow
      >
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      
      {/* Transformer Box */}
      <Box
        args={[2, 1.5, 1.5]}
        position={[4, 0.75, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#374151" />
      </Box>
      
      {/* Wind Direction Indicator */}
      <Box
        args={[0.5, 0.1, 1]}
        position={[-3, 30.5, 0]}
        rotation={[0, windSpeed * 0.01, 0]}
      >
        <meshStandardMaterial color="#fbbf24" />
      </Box>
      
      {/* Service Platform */}
      <Box
        args={[3, 0.2, 2]}
        position={[0, 28, 0]}
        castShadow
      >
        <meshStandardMaterial color="#6b7280" />
      </Box>
    </group>
  )
}
