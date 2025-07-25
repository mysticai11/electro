import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface CameraControllerProps {
  enableDamping?: boolean
  dampingFactor?: number
  enableZoom?: boolean
  enablePan?: boolean
  enableRotate?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
  minDistance?: number
  maxDistance?: number
  minPolarAngle?: number
  maxPolarAngle?: number
  target?: [number, number, number]
}

export const CameraController: React.FC<CameraControllerProps> = ({
  enableDamping = true,
  dampingFactor = 0.05,
  enableZoom = true,
  enablePan = true,
  enableRotate = true,
  autoRotate = false,
  autoRotateSpeed = 0.5,
  minDistance = 10,
  maxDistance = 500,
  minPolarAngle = 0,
  maxPolarAngle = Math.PI,
  target = [0, 0, 0]
}) => {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()

  // Initialize camera position
  React.useEffect(() => {
    camera.position.set(50, 30, 50)
    camera.lookAt(new THREE.Vector3(...target))
  }, [camera, target])

  useFrame(() => {
    if (controlsRef.current && enableDamping) {
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={enableDamping}
      dampingFactor={dampingFactor}
      enableZoom={enableZoom}
      enablePan={enablePan}
      enableRotate={enableRotate}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={minPolarAngle}
      maxPolarAngle={Math.min(maxPolarAngle, Math.PI / 2.1)}
      target={new THREE.Vector3(...target)}
      // Smooth controls for better UX
      zoomSpeed={0.6}
      panSpeed={0.8}
      rotateSpeed={0.4}
    />
  )
}
