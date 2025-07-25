import React from 'react'
import styled from 'styled-components'

const LibraryContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
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

export const ComponentLibrary: React.FC = () => {
  return (
    <LibraryContainer>
      <Title>Electrical Component Library</Title>
      <ComingSoon>
        Component library coming soon! This will include a comprehensive catalog
        of electrical grid components for design and simulation.
      </ComingSoon>
    </LibraryContainer>
  )
}
