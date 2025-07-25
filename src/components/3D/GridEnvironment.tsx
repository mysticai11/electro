import React from 'react'
import { Plane, Sky, Environment } from '@react-three/drei'
import * as THREE from 'three'

interface GridEnvironmentProps {
  showGrid?: boolean
  showSky?: boolean
  groundColor?: string
  skyIntensity?: number
  sunPosition?: [number, number, number]
  environmentPreset?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby'
}

export const GridEnvironment: React.FC<GridEnvironmentProps> = ({
  showGrid = true,
  showSky = true,
  groundColor = '#2d3748',
  sunPosition = [100, 20, 100],
  environmentPreset = 'city'
}) => {
  return (
    <group>
      {/* Environment Lighting */}
      <Environment preset={environmentPreset} />
      
      {/* Ambient Lighting */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* Directional Light (Sun) */}
      <directionalLight
        position={sunPosition}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={300}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      
      {/* Secondary Light for Fill */}
      <directionalLight
        position={[-50, 30, -50]}
        intensity={0.3}
        color="#87ceeb"
      />
      
      {/* Sky */}
      {showSky && (
        <Sky
          distance={450000}
          sunPosition={sunPosition}
          inclination={0}
          azimuth={0.25}
          mieCoefficient={0.005}
          mieDirectionalG={0.07}
          rayleigh={3}
          turbidity={10}
        />
      )}
      
      {/* Ground Plane */}
      <Plane
        args={[1000, 1000]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color={groundColor}
          roughness={0.8}
          metalness={0.1}
        />
      </Plane>
      
      {/* Grid Overlay */}
      {showGrid && (
        <Plane
          args={[1000, 1000]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
        >
          <meshBasicMaterial 
            color="#4a5568"
            transparent
            opacity={0.2}
            wireframe
          />
        </Plane>
      )}
      
      {/* Underground Infrastructure Indication */}
      <Plane
        args={[1000, 1000]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -5, 0]}
      >
        <meshStandardMaterial 
          color="#1a202c"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.8}
        />
      </Plane>
      
      {/* Atmospheric Fog Effect */}
      <fog attach="fog" args={['#718096', 100, 800]} />
      
      {/* Particle Effects for Atmosphere */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(
              Array.from({ length: 3000 }, () => (Math.random() - 0.5) * 1000)
            ), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#e2e8f0"
          size={0.5}
          transparent
          opacity={0.1}
          sizeAttenuation
        />
      </points>
      
      {/* Safety Zones Indicators */}
      <group>
        {/* High Voltage Safety Zone */}
        <mesh position={[0, 0.1, 0]}>
          <ringGeometry args={[45, 50, 32]} />
          <meshBasicMaterial 
            color="#dc2626"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Medium Voltage Safety Zone */}
        <mesh position={[0, 0.1, 0]}>
          <ringGeometry args={[25, 30, 32]} />
          <meshBasicMaterial 
            color="#f59e0b"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Low Voltage Safety Zone */}
        <mesh position={[0, 0.1, 0]}>
          <ringGeometry args={[10, 15, 32]} />
          <meshBasicMaterial 
            color="#10b981"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      
      {/* Wind Indicators */}
      <group>
        {Array.from({ length: 20 }, (_, i) => {
          const angle = (i / 20) * Math.PI * 2
          const radius = 200 + Math.random() * 100
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                5 + Math.random() * 10,
                Math.sin(angle) * radius
              ]}
              rotation={[0, angle, 0]}
            >
              <coneGeometry args={[0.5, 2]} />
              <meshBasicMaterial 
                color="#60a5fa"
                transparent
                opacity={0.3}
              />
            </mesh>
          )
        })}
      </group>
      
      {/* Measurement Reference Points */}
      <group>
        {Array.from({ length: 10 }, (_, i) => (
          <mesh
            key={i}
            position={[i * 20 - 90, 1, 0]}
          >
            <cylinderGeometry args={[0.2, 0.2, 2]} />
            <meshStandardMaterial 
              color="#9ca3af"
              emissive={new THREE.Color('#3b82f6')}
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <mesh
            key={i}
            position={[0, 1, i * 20 - 90]}
          >
            <cylinderGeometry args={[0.2, 0.2, 2]} />
            <meshStandardMaterial 
              color="#9ca3af"
              emissive={new THREE.Color('#3b82f6')}
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
