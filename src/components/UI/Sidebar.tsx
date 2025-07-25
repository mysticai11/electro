import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const SidebarContainer = styled(motion.aside)`
  width: 300px;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
  z-index: 900;
`

const SidebarSection = styled.div`
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
`

const ComponentItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
  }
`

const ComponentIcon = styled.div<{ color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
`

const ComponentInfo = styled.div`
  flex: 1;
`

const ComponentName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 2px;
`

const ComponentType = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`

const ToolSection = styled.div`
  padding: 16px 24px;
`

const ToolButton = styled(motion.button)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  background: ${props => props.active ? 'rgba(59, 130, 246, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#3b82f6' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }
`

const components = [
  { id: 'powerPlant', name: 'Power Plant', type: 'Generation', icon: '🏭', color: '#ef4444' },
  { id: 'transformer', name: 'Transformer', type: 'Transmission', icon: '⚡', color: '#f59e0b' },
  { id: 'substation', name: 'Substation', type: 'Distribution', icon: '🔌', color: '#10b981' },
  { id: 'transmissionLine', name: 'Transmission Line', type: 'Connection', icon: '📡', color: '#3b82f6' },
  { id: 'turbine', name: 'Wind Turbine', type: 'Renewable', icon: '🌪️', color: '#06b6d4' },
  { id: 'solar', name: 'Solar Panel', type: 'Renewable', icon: '☀️', color: '#f59e0b' },
  { id: 'breaker', name: 'Circuit Breaker', type: 'Protection', icon: '🔒', color: '#8b5cf6' },
  { id: 'meter', name: 'Smart Meter', type: 'Monitoring', icon: '📊', color: '#06b6d4' },
]

const tools = [
  { id: 'select', name: 'Select', icon: '👆', active: true },
  { id: 'move', name: 'Move', icon: '🤏' },
  { id: 'rotate', name: 'Rotate', icon: '🔄' },
  { id: 'connect', name: 'Connect', icon: '🔗' },
  { id: 'measure', name: 'Measure', icon: '📏' },
]

export const Sidebar: React.FC = () => {
  return (
    <SidebarContainer
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <ToolSection>
        <SectionTitle>Tools</SectionTitle>
        {tools.map((tool) => (
          <ToolButton
            key={tool.id}
            active={tool.active}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{tool.icon}</span>
            {tool.name}
          </ToolButton>
        ))}
      </ToolSection>

      <SidebarSection>
        <SectionTitle>Component Library</SectionTitle>
        {components.map((component, index) => (
          <ComponentItem
            key={component.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            draggable
          >
            <ComponentIcon color={component.color}>
              {component.icon}
            </ComponentIcon>
            <ComponentInfo>
              <ComponentName>{component.name}</ComponentName>
              <ComponentType>{component.type}</ComponentType>
            </ComponentInfo>
          </ComponentItem>
        ))}
      </SidebarSection>

      <SidebarSection>
        <SectionTitle>Grid Properties</SectionTitle>
        <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
          <div style={{ marginBottom: '8px' }}>Voltage: 120V AC</div>
          <div style={{ marginBottom: '8px' }}>Frequency: 60 Hz</div>
          <div style={{ marginBottom: '8px' }}>Load: 85% of capacity</div>
          <div style={{ marginBottom: '8px' }}>Efficiency: 94.2%</div>
        </div>
      </SidebarSection>
    </SidebarContainer>
  )
}
