import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const HeaderContainer = styled(motion.header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 24px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  
  &::before {
    content: '⚡';
    font-size: 24px;
    filter: drop-shadow(0 0 10px #3b82f6);
  }
`

const NavItems = styled.nav`
  display: flex;
  align-items: center;
  gap: 24px;
`

const NavItem = styled(motion.button)`
  padding: 8px 16px;
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }
`

const StatusIndicator = styled.div<{ status: 'online' | 'offline' | 'simulating' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 12px;
  font-weight: 500;
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => {
      switch (props.status) {
        case 'online': return '#10b981'
        case 'simulating': return '#f59e0b'
        default: return '#ef4444'
      }
    }};
    animation: ${props => props.status === 'simulating' ? 'pulse 2s infinite' : 'none'};
  }
`

const ConnectionStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`

export const Header: React.FC = () => {
  return (
    <HeaderContainer
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Logo>
        GridMind Pro
      </Logo>
      
      <NavItems>
        <NavItem
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="active"
        >
          3D Viewer
        </NavItem>
        <NavItem
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Dashboard
        </NavItem>
        <NavItem
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Analytics
        </NavItem>
        <NavItem
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sandbox
        </NavItem>
      </NavItems>
      
      <ConnectionStatus>
        <StatusIndicator status="online">
          System Online
        </StatusIndicator>
        <span>Real-time Data</span>
        <span>|</span>
        <span>99.9% Uptime</span>
      </ConnectionStatus>
    </HeaderContainer>
  )
}
