import React, { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'

interface TransmissionLineProps {
  start: [number, number, number]
  end: [number, number, number]
  voltage: number
  current: number
  isActive?: boolean
  hasFault?: boolean
  powerFlow?: number // MW
  loadCapacity?: number // percentage
}

export const TransmissionLine: React.FC<TransmissionLineProps> = ({ 
  start, 
  end, 
  voltage = 115,
  current = 0,
  isActive = true,
  hasFault = false,
  powerFlow = 0,
  loadCapacity = 0
}) => {
  const energyRef = useRef<THREE.Group>(null)
  const faultRef = useRef<THREE.Mesh>(null)
  const [animationTime, setAnimationTime] = useState(0)

  const distance = useMemo(() => {
    const startVec = new THREE.Vector3(...start)
    const endVec = new THREE.Vector3(...end)
    return startVec.distanceTo(endVec)
  }, [start, end])

  const towerHeight = useMemo(() => Math.max(15, distance * 0.1), [distance])

  // Create sagging curve for realistic power line
  const createCurve = () => {
    const startVec = new THREE.Vector3(...start)
    const endVec = new THREE.Vector3(...end)
    const distance = startVec.distanceTo(endVec)
    const sag = Math.min(distance * 0.05, 2) // 5% sag, max 2 units
    
    const points = []
    const segments = 20
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const point = new THREE.Vector3()
      point.lerpVectors(startVec, endVec, t)
      
      // Add sag using parabolic curve
      const sagAmount = 4 * sag * t * (1 - t)
      point.y -= sagAmount
      
      points.push(point)
    }
    
    return points
  }

  // Energy flow animation with advanced features
  useFrame((state) => {
    setAnimationTime(state.clock.elapsedTime)
    
    if (energyRef.current && isActive) {
      const speed = getParticleSpeed()
      energyRef.current.children.forEach((child, index) => {
        const mesh = child as THREE.Mesh
        const time = state.clock.elapsedTime * speed + index * 0.8
        const t = ((Math.sin(time) + 1) * 0.5) * Math.max(0.1, Math.abs(powerFlow) / 100)
        
        const startVec = new THREE.Vector3(...start)
        const endVec = new THREE.Vector3(...end)
        
        // Reverse direction for negative power flow
        if (powerFlow < 0) {
          mesh.position.lerpVectors(endVec, startVec, t)
        } else {
          mesh.position.lerpVectors(startVec, endVec, t)
        }
        
        // Add sag to particle position
        const sagAmount = 4 * (distance * 0.02 + 2) * t * (1 - t)
        mesh.position.y -= sagAmount
        
        // Fade particles based on load capacity
        const material = mesh.material as THREE.MeshStandardMaterial
        material.opacity = Math.max(0.2, loadCapacity / 100)
        
        // Pulse effect based on current
        const pulse = Math.sin(animationTime * 5 + index) * 0.3 + 0.7
        material.emissiveIntensity = pulse * (current / 1000)
      })
    }
    
    // Fault animation
    if (faultRef.current && hasFault) {
      const intensity = Math.sin(state.clock.elapsedTime * 10) * 0.5 + 0.5
      const material = faultRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = intensity * 2
    }
  })

  // Accurate voltage classification per IEEE standards
  const getVoltageColor = () => {
    if (hasFault) return '#ff0000'
    if (!isActive) return '#6b7280'
    if (voltage >= 800) return '#dc2626'  // Extra High Voltage (800kV+) - Red
    if (voltage >= 345) return '#f59e0b'  // Extra High Voltage (345-799kV) - Orange  
    if (voltage >= 138) return '#10b981'  // High Voltage (115-345kV) - Green
    if (voltage >= 35) return '#3b82f6'   // Medium Voltage (35-138kV) - Blue
    if (voltage >= 1) return '#8b5cf6'    // Low Voltage (1-35kV) - Purple
    return '#94a3b8' // Below 1kV - Gray
  }

  // Conductor sizing based on current capacity (IEEE 738 standards)
  const getLineWidth = () => {
    // Standard conductor sizes: ACSR conductors
    let baseWidth = 0.05
    if (current >= 2000) baseWidth = 0.20      // 1272 kcmil Drake
    else if (current >= 1500) baseWidth = 0.18 // 954 kcmil Rail  
    else if (current >= 1200) baseWidth = 0.15 // 795 kcmil Drake
    else if (current >= 900) baseWidth = 0.12  // 636 kcmil Grosbeak
    else if (current >= 600) baseWidth = 0.10  // 477 kcmil Hawk
    else if (current >= 400) baseWidth = 0.08  // 336 kcmil Linnet
    else if (current >= 200) baseWidth = 0.06  // 4/0 AWG
    
    return hasFault ? baseWidth * 1.5 : baseWidth
  }

  // Power flow calculations based on P = V * I * cos(φ) * √3 for 3-phase
  const calculateRealPower = () => {
    const powerFactor = 0.95 // Typical transmission line power factor
    const threePhaseFactor = Math.sqrt(3)
    return (voltage * 1000 * current * powerFactor * threePhaseFactor) / 1000000 // MW
  }

  // Transmission line impedance calculation (simplified)
  const getLineImpedance = () => {
    // Typical values for overhead transmission lines
    const resistancePerKm = voltage >= 345 ? 0.03 : voltage >= 138 ? 0.08 : 0.15 // Ohms/km
    const reactancePerKm = voltage >= 345 ? 0.3 : voltage >= 138 ? 0.4 : 0.5 // Ohms/km
    const lineLength = distance / 1000 // Convert to km
    
    const resistance = resistancePerKm * lineLength
    const reactance = reactancePerKm * lineLength
    
    return Math.sqrt(resistance * resistance + reactance * reactance)
  }

  // Power loss calculation using I²R formula
  const getPowerLoss = () => {
    const impedance = getLineImpedance()
    const resistanceFactor = 0.7 // R/Z ratio for transmission lines
    const resistance = impedance * resistanceFactor
    return (current * current * resistance) / 1000 // kW losses
  }

  // Thermal rating check (IEEE 738)
  const getThermalUtilization = () => {
    // Conductor thermal ratings at 75°C ambient
    let thermalRating = 400 // Base rating in Amperes
    if (voltage >= 345) thermalRating = 2000
    else if (voltage >= 138) thermalRating = 1200
    else if (voltage >= 69) thermalRating = 800
    
    return Math.min(100, (current / thermalRating) * 100)
  }

  const getEnergyParticleCount = () => {
    const basedOnLoad = Math.max(3, Math.floor(loadCapacity / 20))
    const basedOnCurrent = Math.max(2, Math.floor(current / 500))
    return Math.min(basedOnLoad, basedOnCurrent, 8)
  }

  const getParticleSpeed = () => {
    return Math.max(0.5, current / 1000) * (powerFlow > 0 ? 1 : -1)
  }

  const points = createCurve()

  return (
    <group>
      {/* Main Power Line */}
      <Line
        points={points}
        color={getVoltageColor()}
        lineWidth={getLineWidth()}
        segments
      />
      
      {/* Enhanced Energy Flow Particles */}
      <group ref={energyRef}>
        {Array.from({ length: getEnergyParticleCount() }, (_, index) => (
          <mesh key={index}>
            <sphereGeometry args={[0.08 + (loadCapacity / 1000)]} />
            <meshStandardMaterial 
              color={getVoltageColor()}
              emissive={new THREE.Color(getVoltageColor())}
              emissiveIntensity={isActive ? 0.8 : 0.1}
              transparent
              opacity={isActive ? 0.9 : 0.3}
            />
          </mesh>
        ))}
      </group>
      
      {/* Fault Indicator */}
      {hasFault && (
        <mesh 
          ref={faultRef}
          position={[(start[0] + end[0]) / 2, Math.max(start[1], end[1]) - 2, (start[2] + end[2]) / 2]}
        >
          <octahedronGeometry args={[0.5]} />
          <meshStandardMaterial 
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={1}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
      
      {/* Professional Electrical Information Display */}
      <Billboard position={[(start[0] + end[0]) / 2, Math.max(start[1], end[1]) + 4, (start[2] + end[2]) / 2]}>
        <Text
          fontSize={1.2}
          color={getVoltageColor()}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Arial-Bold.woff"
        >
          {`${voltage}kV | ${current.toFixed(0)}A`}
        </Text>
      </Billboard>
      
      {/* Real Power and Losses */}
      <Billboard position={[(start[0] + end[0]) / 2, Math.max(start[1], end[1]) + 2.5, (start[2] + end[2]) / 2]}>
        <Text
          fontSize={0.8}
          color={getThermalUtilization() > 90 ? "#dc2626" : getThermalUtilization() > 75 ? "#f59e0b" : "#10b981"}
          anchorX="center"
          anchorY="middle"
        >
          {`${calculateRealPower().toFixed(1)}MW | Loss: ${getPowerLoss().toFixed(1)}kW`}
        </Text>
      </Billboard>
      
      {/* Thermal Loading Indicator */}
      <Billboard position={[(start[0] + end[0]) / 2, Math.max(start[1], end[1]) + 1, (start[2] + end[2]) / 2]}>
        <Text
          fontSize={0.7}
          color={getThermalUtilization() > 90 ? "#dc2626" : "#94a3b8"}
          anchorX="center"
          anchorY="middle"
        >
          {`Thermal: ${getThermalUtilization().toFixed(1)}% | Z: ${getLineImpedance().toFixed(2)}Ω`}
        </Text>
      </Billboard>
      
      {/* Realistic Transmission Towers */}
      <group position={[start[0], 0, start[2]]}>
        {/* Main Tower Structure */}
        <mesh castShadow position={[0, towerHeight / 2, 0]}>
          <boxGeometry args={[1, towerHeight, 1]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        
        {/* Cross Arms at different levels */}
        <mesh position={[0, towerHeight * 0.9, 0]} castShadow>
          <boxGeometry args={[8, 0.4, 0.4]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        <mesh position={[0, towerHeight * 0.7, 0]} castShadow>
          <boxGeometry args={[6, 0.4, 0.4]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        <mesh position={[0, towerHeight * 0.5, 0]} castShadow>
          <boxGeometry args={[4, 0.4, 0.4]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        
        {/* Support Braces */}
        <mesh position={[-2, towerHeight * 0.3, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <boxGeometry args={[0.2, towerHeight * 0.6, 0.2]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        <mesh position={[2, towerHeight * 0.3, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
          <boxGeometry args={[0.2, towerHeight * 0.6, 0.2]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        
        {/* Tower Foundation */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <boxGeometry args={[3, 1, 3]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        
        {/* Warning Lights */}
        <mesh position={[0, towerHeight + 1, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial 
            color="#ff0000" 
            emissive="#ff0000"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
      
      <group position={[end[0], 0, end[2]]}>
        {/* Main Tower Structure */}
        <mesh castShadow position={[0, towerHeight / 2, 0]}>
          <boxGeometry args={[1, towerHeight, 1]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        
        {/* Cross Arms at different levels */}
        <mesh position={[0, towerHeight * 0.9, 0]} castShadow>
          <boxGeometry args={[8, 0.4, 0.4]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        <mesh position={[0, towerHeight * 0.7, 0]} castShadow>
          <boxGeometry args={[6, 0.4, 0.4]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        <mesh position={[0, towerHeight * 0.5, 0]} castShadow>
          <boxGeometry args={[4, 0.4, 0.4]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        
        {/* Support Braces */}
        <mesh position={[-2, towerHeight * 0.3, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <boxGeometry args={[0.2, towerHeight * 0.6, 0.2]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        <mesh position={[2, towerHeight * 0.3, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
          <boxGeometry args={[0.2, towerHeight * 0.6, 0.2]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        
        {/* Tower Foundation */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <boxGeometry args={[3, 1, 3]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        
        {/* Warning Lights */}
        <mesh position={[0, towerHeight + 1, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial 
            color="#ff0000" 
            emissive="#ff0000"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
      
      {/* Enhanced Insulators */}
      <group position={[(start[0] + end[0]) / 2, Math.max(start[1], end[1]), (start[2] + end[2]) / 2]}>
        {/* Insulator strings for each phase */}
        {[-2, 0, 2].map((offset, index) => (
          <group key={index} position={[offset, -1, 0]}>
            {/* Insulator discs */}
            {Array.from({ length: Math.floor(voltage / 100) }, (_, discIndex) => (
              <mesh key={discIndex} position={[0, -discIndex * 0.3, 0]}>
                <cylinderGeometry args={[0.15, 0.2, 0.2]} />
                <meshStandardMaterial 
                  color="#f8fafc" 
                  roughness={0.1}
                  metalness={0.8}
                />
              </mesh>
            ))}
            
            {/* Conductor attachment */}
            <mesh position={[0, -Math.floor(voltage / 100) * 0.3 - 0.2, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.3]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Ground Wire */}
      <Line
        points={[
          [start[0], start[1] + towerHeight + 2, start[2]],
          [end[0], end[1] + towerHeight + 2, end[2]]
        ]}
        color="#6b7280"
        lineWidth={0.03}
      />
    </group>
  )
}
