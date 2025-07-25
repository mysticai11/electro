import React, { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid, Stats, Sky } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import styled from 'styled-components'
import { GridScene } from './GridScene'
import { CameraController } from './CameraController'
import { GridEnvironment } from './GridEnvironment'

const ViewerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
`

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
`

const UIOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 100;
`

const ViewControls = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: auto;
`

const ControlButton = styled.button`
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  &.active {
    background: rgba(59, 130, 246, 0.3);
    border-color: #3b82f6;
  }
`

const SimulationControls = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  pointer-events: auto;
`

const PlayButton = styled.button<{ playing?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.playing ? '#ef4444' : '#10b981'};
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`

const SpeedControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 12px;
`

const SpeedSlider = styled.input`
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
  }
`

const MetricsPanel = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 12px;
  pointer-events: auto;
  min-width: 200px;
`

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const MetricLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
`

const MetricValue = styled.span<{ status?: 'good' | 'warning' | 'critical' }>`
  font-weight: 600;
  color: ${props => {
    switch (props.status) {
      case 'good': return '#10b981'
      case 'warning': return '#f59e0b'
      case 'critical': return '#ef4444'
      default: return '#ffffff'
    }
  }};
`

export const GridViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <ViewerContainer>
      <CanvasContainer>
        <Canvas
          ref={canvasRef}
          camera={{ position: [50, 30, 50], fov: 60 }}
          shadows
          gl={{ 
            antialias: true, 
            alpha: false,
            powerPreference: "high-performance"
          }}
        >
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight
              position={[100, 100, 50]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={200}
              shadow-camera-left={-50}
              shadow-camera-right={50}
              shadow-camera-top={50}
              shadow-camera-bottom={-50}
            />
            
            {/* Environment */}
            <Sky 
              distance={450000}
              sunPosition={[100, 20, 100]}
              inclination={0}
              azimuth={0.25}
            />
            <Environment preset="sunset" />
            
            {/* Physics World */}
            <Physics 
              gravity={[0, -9.81, 0]}
              defaultContactMaterial={{
                friction: 0.4,
                restitution: 0.3,
              }}
            >
              {/* Grid Floor */}
              <Grid
                args={[200, 200]}
                cellSize={1}
                cellThickness={0.5}
                cellColor="#6f6f6f"
                sectionSize={10}
                sectionThickness={1}
                sectionColor="#9d4edd"
                fadeDistance={100}
                fadeStrength={1}
                followCamera={false}
                infiniteGrid={true}
              />
              
              {/* Main Grid Scene */}
              <GridScene />
              
              {/* Grid Environment Elements */}
              <GridEnvironment />
            </Physics>
            
            {/* Camera Controls */}
            <CameraController />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={200}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2}
            />
            
            {/* Performance Monitor */}
            <Stats />
          </Suspense>
        </Canvas>
      </CanvasContainer>
      
      {/* UI Overlays */}
      <UIOverlay>
        {/* Metrics Panel */}
        <MetricsPanel>
          <h4 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
            Real-time Grid Metrics
          </h4>
          <MetricRow>
            <MetricLabel>Total Power:</MetricLabel>
            <MetricValue status="good">2.4 GW</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>Grid Load:</MetricLabel>
            <MetricValue status="warning">85%</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>Frequency:</MetricLabel>
            <MetricValue status="good">60.0 Hz</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>Voltage:</MetricLabel>
            <MetricValue status="good">120.2 V</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>Efficiency:</MetricLabel>
            <MetricValue status="good">94.2%</MetricValue>
          </MetricRow>
          <MetricRow>
            <MetricLabel>Components:</MetricLabel>
            <MetricValue>847</MetricValue>
          </MetricRow>
        </MetricsPanel>
        
        {/* View Controls */}
        <ViewControls>
          <ControlButton className="active">3D View</ControlButton>
          <ControlButton>Schematic</ControlButton>
          <ControlButton>Satellite</ControlButton>
          <ControlButton>Thermal</ControlButton>
          <ControlButton>Analytics</ControlButton>
        </ViewControls>
        
        {/* Simulation Controls */}
        <SimulationControls>
          <PlayButton>
            ▶️
          </PlayButton>
          <SpeedControl>
            <span>Speed:</span>
            <SpeedSlider
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              defaultValue="1"
            />
            <span>1.0x</span>
          </SpeedControl>
          <ControlButton>Reset</ControlButton>
          <ControlButton>Export</ControlButton>
        </SimulationControls>
      </UIOverlay>
    </ViewerContainer>
  )
}
