import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const LoadingContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  z-index: 9999;
`

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
`

const Logo = styled.div`
  font-size: 48px;
  filter: drop-shadow(0 0 20px #3b82f6);
`

const AppName = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const LoadingSpinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  margin-bottom: 24px;
`

const LoadingText = styled(motion.p)`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`

const LoadingSubtext = styled(motion.p)`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 8px;
`

const ProgressBar = styled.div`
  width: 300px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1px;
  margin-top: 24px;
  overflow: hidden;
`

const Progress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  border-radius: 1px;
`

export const LoadingScreen: React.FC = () => {
  return (
    <LoadingContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <LogoContainer
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Logo>⚡</Logo>
        <AppName>GridMind Pro</AppName>
      </LogoContainer>
      
      <LoadingSpinner
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      
      <LoadingText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        Initializing 3D Grid Environment
      </LoadingText>
      
      <LoadingSubtext
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.3 }}
      >
        Loading physics engine and electrical models...
      </LoadingSubtext>
      
      <ProgressBar>
        <Progress
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
        />
      </ProgressBar>
    </LoadingContainer>
  )
}
