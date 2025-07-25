import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { motion } from 'framer-motion'

const AnalyticsContainer = styled(motion.div)`
  position: absolute;
  top: 80px;
  right: 20px;
  width: 400px;
  height: calc(100vh - 100px);
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 20px;
  padding: 20px;
  overflow-y: auto;
  z-index: 1000;
`

const AnalyticsSection = styled.div`
  margin-bottom: 30px;
  
  h3 {
    color: #f1f5f9;
    font-size: 18px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`

const MetricCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  
  .metric-title {
    color: #94a3b8;
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
  
  .metric-value {
    color: #f1f5f9;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .metric-change {
    font-size: 12px;
    &.positive { color: #10b981; }
    &.negative { color: #ef4444; }
    &.neutral { color: #94a3b8; }
  }
`

const AlertCard = styled(motion.div)<{ severity: 'critical' | 'warning' | 'info' }>`
  background: ${props => 
    props.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' :
    props.severity === 'warning' ? 'rgba(245, 158, 11, 0.1)' :
    'rgba(59, 130, 246, 0.1)'
  };
  border: 1px solid ${props => 
    props.severity === 'critical' ? 'rgba(239, 68, 68, 0.3)' :
    props.severity === 'warning' ? 'rgba(245, 158, 11, 0.3)' :
    'rgba(59, 130, 246, 0.3)'
  };
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  
  .alert-title {
    color: ${props => 
      props.severity === 'critical' ? '#ef4444' :
      props.severity === 'warning' ? '#f59e0b' :
      '#3b82f6'
    };
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .alert-description {
    color: #cbd5e1;
    font-size: 12px;
  }
`

interface GridData {
  time: string
  powerGeneration: number
  powerConsumption: number
  voltage: number
  frequency: number
  renewablePercentage: number
}

interface Alert {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info'
  timestamp: Date
}

export const GridAnalytics: React.FC = () => {
  const [realTimeData, setRealTimeData] = useState<GridData[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [systemMetrics, setSystemMetrics] = useState({
    totalGeneration: 8540,
    totalConsumption: 7890,
    systemEfficiency: 94.2,
    carbonEmissions: 2.3,
    renewableShare: 68.5,
    gridStability: 98.7
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const newDataPoint: GridData = {
        time: now.toLocaleTimeString(),
        powerGeneration: 8000 + Math.random() * 1000,
        powerConsumption: 7500 + Math.random() * 800,
        voltage: 229.5 + (Math.random() - 0.5) * 5,
        frequency: 60 + (Math.random() - 0.5) * 0.2,
        renewablePercentage: 65 + Math.random() * 10
      }

      setRealTimeData(prev => [...prev.slice(-19), newDataPoint])

      // Generate random alerts
      if (Math.random() < 0.1) {
        const alertTypes = [
          { title: 'High Load Detected', description: 'Transmission line at 95% capacity', severity: 'warning' as const },
          { title: 'Voltage Fluctuation', description: 'Substation A experiencing voltage instability', severity: 'critical' as const },
          { title: 'Renewable Integration', description: 'Solar farm output increased by 15%', severity: 'info' as const }
        ]
        
        const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)]
        const newAlert: Alert = {
          id: Math.random().toString(36),
          ...randomAlert,
          timestamp: new Date()
        }
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)])
      }

      // Update system metrics
      setSystemMetrics(prev => ({
        totalGeneration: prev.totalGeneration + (Math.random() - 0.5) * 100,
        totalConsumption: prev.totalConsumption + (Math.random() - 0.5) * 80,
        systemEfficiency: Math.max(90, Math.min(100, prev.systemEfficiency + (Math.random() - 0.5) * 2)),
        carbonEmissions: Math.max(0, prev.carbonEmissions + (Math.random() - 0.5) * 0.1),
        renewableShare: Math.max(0, Math.min(100, prev.renewableShare + (Math.random() - 0.5) * 3)),
        gridStability: Math.max(95, Math.min(100, prev.gridStability + (Math.random() - 0.5) * 1))
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const efficiencyData = [
    { name: 'Generation', value: systemMetrics.renewableShare, fill: '#10b981' },
    { name: 'Fossil', value: 100 - systemMetrics.renewableShare, fill: '#6b7280' }
  ]

  return (
    <AnalyticsContainer
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Real-time System Metrics */}
      <AnalyticsSection>
        <h3>⚡ System Overview</h3>
        <MetricCard
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="metric-title">Total Generation</div>
          <div className="metric-value">{systemMetrics.totalGeneration.toFixed(0)} MW</div>
          <div className="metric-change positive">+2.3% from yesterday</div>
        </MetricCard>
        
        <MetricCard
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="metric-title">System Efficiency</div>
          <div className="metric-value">{systemMetrics.systemEfficiency.toFixed(1)}%</div>
          <div className="metric-change positive">+0.5% from last hour</div>
        </MetricCard>

        <MetricCard
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="metric-title">Renewable Share</div>
          <div className="metric-value">{systemMetrics.renewableShare.toFixed(1)}%</div>
          <div className="metric-change positive">+1.2% from last week</div>
        </MetricCard>
      </AnalyticsSection>

      {/* Real-time Power Flow Chart */}
      <AnalyticsSection>
        <h3>📊 Power Flow</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={realTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
            <YAxis stroke="#94a3b8" fontSize={10} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="powerGeneration" 
              stackId="1"
              stroke="#10b981" 
              fill="rgba(16, 185, 129, 0.3)" 
            />
            <Area 
              type="monotone" 
              dataKey="powerConsumption" 
              stackId="2"
              stroke="#f59e0b" 
              fill="rgba(245, 158, 11, 0.3)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </AnalyticsSection>

      {/* Renewable Energy Distribution */}
      <AnalyticsSection>
        <h3>🌱 Energy Mix</h3>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={efficiencyData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              dataKey="value"
            >
              {efficiencyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </AnalyticsSection>

      {/* System Alerts */}
      <AnalyticsSection>
        <h3>🚨 Active Alerts</h3>
        {alerts.length === 0 ? (
          <div style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
            No active alerts
          </div>
        ) : (
          alerts.map(alert => (
            <AlertCard
              key={alert.id}
              severity={alert.severity}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="alert-title">{alert.title}</div>
              <div className="alert-description">{alert.description}</div>
            </AlertCard>
          ))
        )}
      </AnalyticsSection>

      {/* Grid Stability Monitor */}
      <AnalyticsSection>
        <h3>🔧 Grid Health</h3>
        <ResponsiveContainer width="100%" height={100}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[
            { name: 'Stability', value: systemMetrics.gridStability, fill: '#10b981' }
          ]}>
            <RadialBar dataKey="value" cornerRadius={10} fill="#10b981" />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#f1f5f9" fontSize="24" fontWeight="bold">
              {systemMetrics.gridStability.toFixed(1)}%
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </AnalyticsSection>
    </AnalyticsContainer>
  )
}
