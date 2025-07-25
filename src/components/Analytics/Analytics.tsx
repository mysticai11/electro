import React from 'react'
import styled from 'styled-components'

const AnalyticsContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  min-height: 100vh;
  color: #333;
`

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`

const ComingSoon = styled.div`
  text-align: center;
  font-size: 1.5rem;
  opacity: 0.8;
`

export const Analytics: React.FC = () => {
  return (
    <AnalyticsContainer>
      <Title>Grid Analytics & AI Optimization</Title>
      <ComingSoon>
        Analytics coming soon! This will include AI-powered grid optimization,
        predictive analytics, and performance insights.
      </ComingSoon>
    </AnalyticsContainer>
  )
}
