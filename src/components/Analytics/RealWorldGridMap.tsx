import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const GridMapContainer = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 250px;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 20px;
  padding: 20px;
  z-index: 1000;
`

const MapHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 15px;
  
  h3 {
    color: #f1f5f9;
    font-size: 16px;
    margin: 0;
  }
  
  .region-selector {
    display: flex;
    gap: 10px;
  }
`

const RegionButton = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  background: ${props => props.active ? '#3b82f6' : 'rgba(30, 41, 59, 0.6)'};
  border: 1px solid ${props => props.active ? '#3b82f6' : 'rgba(148, 163, 184, 0.2)'};
  border-radius: 8px;
  color: ${props => props.active ? 'white' : '#94a3b8'};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#2563eb' : 'rgba(59, 130, 246, 0.2)'};
  }
`

const GridMap = styled.div`
  background: rgba(30, 41, 59, 0.4);
  border-radius: 12px;
  height: 140px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.1);
`

const GridRegion = styled(motion.div)<{ 
  x: number; 
  y: number; 
  load: number; 
  status: 'normal' | 'warning' | 'critical' 
}>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => 
    props.status === 'critical' ? '#ef4444' :
    props.status === 'warning' ? '#f59e0b' :
    '#10b981'
  };
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 50%;
    border: 1px solid ${props => 
      props.status === 'critical' ? '#ef4444' :
      props.status === 'warning' ? '#f59e0b' :
      '#10b981'
    };
    opacity: 0.6;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.3;
    }
    100% {
      transform: scale(1);
      opacity: 0.6;
    }
  }
`

const DataPanel = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;
`

const DataCard = styled.div`
  flex: 1;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  
  .data-value {
    color: #f1f5f9;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .data-label {
    color: #94a3b8;
    font-size: 10px;
    text-transform: uppercase;
  }
  
  .data-change {
    font-size: 10px;
    margin-top: 2px;
    
    &.positive { color: #10b981; }
    &.negative { color: #ef4444; }
  }
`

interface GridRegionData {
  id: string
  name: string
  x: number
  y: number
  load: number
  capacity: number
  status: 'normal' | 'warning' | 'critical'
  generation: number
  demand: number
}

interface RealTimeGridData {
  timestamp: Date
  totalLoad: number
  totalCapacity: number
  renewableGeneration: number
  fossilGeneration: number
  frequency: number
  voltage: number
}

export const RealWorldGridMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<'ERCOT' | 'PJM' | 'CAISO' | 'NYISO'>('ERCOT')
  const [gridData, setGridData] = useState<RealTimeGridData>({
    timestamp: new Date(),
    totalLoad: 45780,
    totalCapacity: 85000,
    renewableGeneration: 15200,
    fossilGeneration: 30580,
    frequency: 60.01,
    voltage: 345.2
  })
  
  const [regions, setRegions] = useState<GridRegionData[]>([
    { id: 'north_texas', name: 'North Texas (NCTC)', x: 30, y: 20, load: 8500, capacity: 12000, status: 'normal', generation: 9200, demand: 8500 },
    { id: 'houston', name: 'Houston (CenterPoint)', x: 25, y: 70, load: 12400, capacity: 15000, status: 'warning', generation: 11800, demand: 12400 },
    { id: 'austin', name: 'Austin Energy', x: 35, y: 60, load: 6200, capacity: 8500, status: 'normal', generation: 7100, demand: 6200 },
    { id: 'dallas', name: 'Oncor (Dallas)', x: 45, y: 25, load: 9800, capacity: 12500, status: 'normal', generation: 10200, demand: 9800 },
    { id: 'san_antonio', name: 'CPS Energy', x: 30, y: 80, load: 5400, capacity: 7000, status: 'normal', generation: 6100, demand: 5400 },
    { id: 'west_texas', name: 'West Texas (SWEPCO)', x: 15, y: 45, load: 3400, capacity: 8000, status: 'critical', generation: 7200, demand: 3400 }
  ])

  // Simulate real-time updates from grid APIs
  useEffect(() => {
    const interval = setInterval(() => {
      // Update main grid data
      setGridData(prev => ({
        ...prev,
        timestamp: new Date(),
        totalLoad: prev.totalLoad + (Math.random() - 0.5) * 1000,
        renewableGeneration: Math.max(0, prev.renewableGeneration + (Math.random() - 0.5) * 500),
        fossilGeneration: Math.max(0, prev.fossilGeneration + (Math.random() - 0.5) * 300),
        frequency: 60 + (Math.random() - 0.5) * 0.1,
        voltage: 345 + (Math.random() - 0.5) * 5
      }))

      // Update regional data
      setRegions(prev => prev.map(region => {
        const loadChange = (Math.random() - 0.5) * 200
        const newLoad = Math.max(0, region.load + loadChange)
        const loadPercentage = (newLoad / region.capacity) * 100
        
        let newStatus: 'normal' | 'warning' | 'critical' = 'normal'
        if (loadPercentage > 90) newStatus = 'critical'
        else if (loadPercentage > 75) newStatus = 'warning'
        
        return {
          ...region,
          load: newLoad,
          demand: newLoad,
          generation: Math.max(0, region.generation + (Math.random() - 0.5) * 150),
          status: newStatus
        }
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getRegionMap = () => {
    switch (selectedRegion) {
      case 'CAISO':
        return [
          { id: 'norcal', name: 'NP26 (NorCal)', x: 20, y: 30, load: 5200, capacity: 7500, status: 'normal' as const, generation: 6100, demand: 5200 },
          { id: 'socal', name: 'SP26 (SoCal)', x: 35, y: 70, load: 15400, capacity: 18000, status: 'warning' as const, generation: 16200, demand: 15400 },
          { id: 'zp26', name: 'ZP26 (Central)', x: 30, y: 50, load: 4800, capacity: 6200, status: 'normal' as const, generation: 5400, demand: 4800 },
          { id: 'imperial', name: 'Imperial Valley', x: 45, y: 85, load: 800, capacity: 1200, status: 'normal' as const, generation: 950, demand: 800 }
        ]
      case 'PJM':
        return [
          { id: 'rto', name: 'PJM RTO Zone', x: 70, y: 40, load: 18500, capacity: 22000, status: 'warning' as const, generation: 19800, demand: 18500 },
          { id: 'ppl', name: 'PPL Electric', x: 75, y: 45, load: 8200, capacity: 10500, status: 'normal' as const, generation: 9400, demand: 8200 },
          { id: 'pepco', name: 'Pepco Holdings', x: 70, y: 55, load: 6800, capacity: 8500, status: 'normal' as const, generation: 7600, demand: 6800 },
          { id: 'aep', name: 'AEP Ohio', x: 55, y: 40, load: 4200, capacity: 5800, status: 'normal' as const, generation: 5100, demand: 4200 }
        ]
      case 'NYISO':
        return [
          { id: 'nyc', name: 'Zone J (NYC)', x: 80, y: 30, load: 8500, capacity: 10500, status: 'warning' as const, generation: 9200, demand: 8500 },
          { id: 'li', name: 'Zone K (Long Island)', x: 85, y: 35, load: 4200, capacity: 5500, status: 'normal' as const, generation: 4800, demand: 4200 },
          { id: 'central', name: 'Zone C (Central)', x: 75, y: 25, load: 3800, capacity: 5200, status: 'normal' as const, generation: 4500, demand: 3800 },
          { id: 'west', name: 'Zone A (West)', x: 65, y: 20, load: 2800, capacity: 4000, status: 'normal' as const, generation: 3400, demand: 2800 }
        ]
      default:
        return regions
    }
  }

  const currentRegions = selectedRegion === 'ERCOT' ? regions : getRegionMap()
  const totalCurrentLoad = currentRegions.reduce((sum, r) => sum + r.load, 0)
  const totalCurrentCapacity = currentRegions.reduce((sum, r) => sum + r.capacity, 0)
  const systemUtilization = (totalCurrentLoad / totalCurrentCapacity) * 100

  return (
    <GridMapContainer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <MapHeader>
        <h3>🌍 Real-time Grid Monitor</h3>
        <div className="region-selector">
          {(['ERCOT', 'CAISO', 'PJM', 'NYISO'] as const).map(region => (
            <RegionButton
              key={region}
              active={selectedRegion === region}
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </RegionButton>
          ))}
        </div>
      </MapHeader>

      <GridMap>
        {currentRegions.map(region => (
          <GridRegion
            key={region.id}
            x={region.x}
            y={region.y}
            load={region.load}
            status={region.status}
            whileHover={{ scale: 1.3 }}
            title={`${region.name}: ${region.load.toFixed(0)}MW / ${region.capacity}MW (${((region.load/region.capacity)*100).toFixed(1)}%)`}
          />
        ))}
        
        {/* Grid interconnections */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {currentRegions.map((region, index) => 
            currentRegions.slice(index + 1).map(otherRegion => (
              <line
                key={`${region.id}-${otherRegion.id}`}
                x1={`${region.x + 2}%`}
                y1={`${region.y + 2}%`}
                x2={`${otherRegion.x + 2}%`}
                y2={`${otherRegion.y + 2}%`}
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))
          )}
        </svg>
      </GridMap>

      <DataPanel>
        <DataCard>
          <div className="data-value">{totalCurrentLoad.toFixed(0)}</div>
          <div className="data-label">Total Load (MW)</div>
          <div className="data-change positive">+2.3%</div>
        </DataCard>
        <DataCard>
          <div className="data-value">{systemUtilization.toFixed(1)}</div>
          <div className="data-label">Utilization (%)</div>
          <div className="data-change negative">-0.8%</div>
        </DataCard>
        <DataCard>
          <div className="data-value">{gridData.frequency.toFixed(2)}</div>
          <div className="data-label">Frequency (Hz)</div>
          <div className="data-change positive">+0.01</div>
        </DataCard>
        <DataCard>
          <div className="data-value">{(gridData.renewableGeneration / (gridData.renewableGeneration + gridData.fossilGeneration) * 100).toFixed(0)}</div>
          <div className="data-label">Renewable (%)</div>
          <div className="data-change positive">+3.2%</div>
        </DataCard>
      </DataPanel>
    </GridMapContainer>
  )
}
