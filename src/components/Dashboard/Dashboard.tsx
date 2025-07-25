import React, { useState } from 'react'
import styled from 'styled-components'
import { AnimatePresence } from 'framer-motion'
import { GridAnalytics } from '../Analytics/GridAnalytics'
import { CircuitDesigner } from '../Library/CircuitDesigner'
import { RealWorldGridMap } from '../Analytics/RealWorldGridMap'
import { AIPredictiveAnalytics } from '../Analytics/AIPredictiveAnalytics'
import { GridViewer } from '../3D/GridViewer'

const DashboardContainer = styled.div`
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  min-height: 100vh;
  overflow: hidden;
`

const ControlPanel = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  z-index: 1001;
`

const ControlButton = styled.button<{ active?: boolean }>`
  padding: 12px 24px;
  background: ${props => props.active ? 
    'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 
    'rgba(15, 23, 42, 0.8)'
  };
  border: 1px solid ${props => props.active ? '#3b82f6' : 'rgba(148, 163, 184, 0.3)'};
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 
      'linear-gradient(135deg, #2563eb, #1e40af)' : 
      'rgba(30, 41, 59, 0.9)'
    };
    border-color: #60a5fa;
  }
`

const MainContent = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`

export const Dashboard: React.FC = () => {
  const [showAnalytics, setShowAnalytics] = useState(true)
  const [showCircuitDesigner, setShowCircuitDesigner] = useState(true)
  const [showGridMap, setShowGridMap] = useState(true)
  const [showAIPredictions, setShowAIPredictions] = useState(false)

  return (
    <DashboardContainer>
      <ControlPanel>
        <ControlButton
          active={showAnalytics}
          onClick={() => setShowAnalytics(!showAnalytics)}
        >
          📊 Analytics
        </ControlButton>
        <ControlButton
          active={showCircuitDesigner}
          onClick={() => setShowCircuitDesigner(!showCircuitDesigner)}
        >
          🔌 Circuit Designer
        </ControlButton>
        <ControlButton
          active={showGridMap}
          onClick={() => setShowGridMap(!showGridMap)}
        >
          🌍 Grid Map
        </ControlButton>
        <ControlButton
          active={showAIPredictions}
          onClick={() => setShowAIPredictions(!showAIPredictions)}
        >
          🔮 AI Predictions
        </ControlButton>
      </ControlPanel>

      <MainContent>
        {/* 3D Grid Visualization */}
        <GridViewer />
        
        {/* Real-time Analytics Panel */}
        {showAnalytics && <GridAnalytics />}
        
        {/* Circuit Design Tools */}
        {showCircuitDesigner && <CircuitDesigner />}
        
        {/* Real-world Grid Map */}
        {showGridMap && <RealWorldGridMap />}
        
        {/* AI Predictive Analytics Modal */}
        <AnimatePresence>
          {showAIPredictions && (
            <AIPredictiveAnalytics onClose={() => setShowAIPredictions(false)} />
          )}
        </AnimatePresence>
      </MainContent>
    </DashboardContainer>
  )
}
