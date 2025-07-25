import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const AIContainer = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 900px;
  height: 80%;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 25px;
  padding: 30px;
  z-index: 2000;
  overflow-y: auto;
`

const AIHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  h2 {
    color: #f1f5f9;
    font-size: 24px;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 15px;
  }
`

const CloseButton = styled.button`
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  cursor: pointer;
  font-size: 18px;
  
  &:hover {
    background: rgba(239, 68, 68, 0.3);
  }
`

const PredictionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`

const PredictionCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 15px;
  padding: 20px;
  
  .prediction-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    
    .prediction-icon {
      font-size: 24px;
    }
    
    .prediction-title {
      color: #f1f5f9;
      font-size: 16px;
      font-weight: 600;
    }
    
    .confidence {
      margin-left: auto;
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
  }
  
  .prediction-content {
    color: #cbd5e1;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 15px;
  }
  
  .prediction-metrics {
    display: flex;
    gap: 15px;
    
    .metric {
      flex: 1;
      text-align: center;
      
      .metric-value {
        color: #f1f5f9;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 4px;
      }
      
      .metric-label {
        color: #94a3b8;
        font-size: 11px;
        text-transform: uppercase;
      }
    }
  }
`

const MLModelStatus = styled.div`
  background: rgba(30, 41, 59, 0.4);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  
  .model-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 15px;
  }
  
  .model-item {
    background: rgba(15, 23, 42, 0.6);
    border-radius: 10px;
    padding: 15px;
    
    .model-name {
      color: #f1f5f9;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .model-accuracy {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      
      .label {
        color: #94a3b8;
        font-size: 12px;
      }
      
      .value {
        color: #10b981;
        font-size: 12px;
        font-weight: 600;
      }
    }
    
    .model-status {
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 8px;
      
      &.training {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
      }
      
      &.active {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
      }
      
      &.updating {
        background: rgba(59, 130, 246, 0.2);
        color: #3b82f6;
      }
    }
  }
`

interface Prediction {
  id: string
  title: string
  icon: string
  content: string
  confidence: number
  timeframe: string
  impact: 'low' | 'medium' | 'high'
  metrics: {
    label: string
    value: string
  }[]
}

interface MLModel {
  name: string
  accuracy: number
  status: 'training' | 'active' | 'updating'
  lastUpdated: string
}

interface AIProps {
  onClose: () => void
}

export const AIPredictiveAnalytics: React.FC<AIProps> = ({ onClose }) => {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [mlModels] = useState<MLModel[]>([
    { name: 'ARIMA Load Forecasting', accuracy: 97.2, status: 'active', lastUpdated: '2 min ago' },
    { name: 'CNN Fault Detection', accuracy: 99.1, status: 'active', lastUpdated: '1 min ago' },
    { name: 'LSTM Renewable Prediction', accuracy: 94.8, status: 'active', lastUpdated: '3 min ago' },
    { name: 'SVM Price Forecasting', accuracy: 91.3, status: 'training', lastUpdated: '15 min ago' },
    { name: 'Random Forest Maintenance', accuracy: 96.7, status: 'active', lastUpdated: '5 min ago' },
    { name: 'Deep Q-Learning DR', accuracy: 93.9, status: 'updating', lastUpdated: '8 min ago' },
    { name: 'Kalman State Estimation', accuracy: 98.8, status: 'active', lastUpdated: '30 sec ago' },
    { name: 'GAN Contingency Analysis', accuracy: 95.4, status: 'active', lastUpdated: '4 min ago' }
  ])

  const [forecastData] = useState([
    { time: '00:00', actual: 42000, predicted: 41800, confidence: 0.95 },
    { time: '04:00', actual: 38000, predicted: 38200, confidence: 0.93 },
    { time: '08:00', actual: 55000, predicted: 54700, confidence: 0.96 },
    { time: '12:00', actual: 62000, predicted: 61500, confidence: 0.94 },
    { time: '16:00', actual: 58000, predicted: 58300, confidence: 0.95 },
    { time: '20:00', actual: 52000, predicted: 51800, confidence: 0.97 },
    { time: '24:00', actual: null, predicted: 45000, confidence: 0.92 }
  ])

  useEffect(() => {
    // Generate professional AI predictions based on real electrical engineering principles
    const generatePredictions = () => {
      const newPredictions: Prediction[] = [
        {
          id: '1',
          title: 'N-1 Contingency Analysis',
          icon: '⚡',
          content: 'AI analysis predicts potential N-1 contingency violation. Loss of 345kV line TL-North would cause 108% loading on parallel circuit during peak demand (18:00-20:00). System stability margin reduces to 4.2%.',
          confidence: 96,
          timeframe: '18-20 hours',
          impact: 'high',
          metrics: [
            { label: 'Peak Load', value: '68.5 GW' },
            { label: 'N-1 Margin', value: '4.2%' }
          ]
        },
        {
          id: '2',
          title: 'Thermal Overload Risk',
          icon: '🌡️',
          content: 'IEEE 738 thermal model predicts conductor temperature will reach 95°C on Line TL-345-South. Ambient temp 38°C + solar radiation 950 W/m² + current loading 1850A exceeds 75°C rating. Automatic load shedding recommended.',
          confidence: 94,
          timeframe: '4-6 hours',
          impact: 'high',
          metrics: [
            { label: 'Conductor Temp', value: '95°C' },
            { label: 'Thermal Risk', value: '92%' }
          ]
        },
        {
          id: '3',
          title: 'Voltage Stability Analysis',
          icon: '📊',
          content: 'P-V curve analysis shows voltage collapse margin of 127 MW at Bus-345-Central. Heavy load pocket with insufficient reactive power support. Capacitor bank switching at 14:30 will improve V-Q margin by 18%.',
          confidence: 91,
          timeframe: '6-8 hours',
          impact: 'medium',
          metrics: [
            { label: 'V-Collapse', value: '127 MW' },
            { label: 'Reactive', value: '+50 MVAR' }
          ]
        },
        {
          id: '4',
          title: 'Economic Dispatch Optimization',
          icon: '💰',
          content: 'Lagrangian optimization identifies $847/hr savings by redistributing 450 MW from inefficient gas peakers (heat rate 12,000 BTU/kWh) to combined cycle units (7,200 BTU/kWh). Carbon emissions reduce by 180 tons CO₂/day.',
          confidence: 98,
          timeframe: '2-4 hours',
          impact: 'medium',
          metrics: [
            { label: 'Cost Savings', value: '$847/hr' },
            { label: 'CO₂ Reduction', value: '180 t/day' }
          ]
        },
        {
          id: '5',
          title: 'Transient Stability Assessment',
          icon: '⚖️',
          content: 'Critical Clearing Time (CCT) analysis shows 180ms margin for 3-phase fault at Bus-500-Alpha. Rotor angle stability maintained with 94.3° max swing. Generator coherency grouping optimal for current loading pattern.',
          confidence: 89,
          timeframe: 'Real-time',
          impact: 'low',
          metrics: [
            { label: 'CCT Margin', value: '180 ms' },
            { label: 'Max Swing', value: '94.3°' }
          ]
        },
        {
          id: '6',
          title: 'Renewable Integration Forecast',
          icon: '�',
          content: 'NWP models predict 2,340 MW wind generation (78% capacity factor) and 1,890 MW solar (peak irradiance 980 W/m²). Grid inertia drops to 4.1s. Frequency response adequacy maintained with synthetic inertia from wind farms.',
          confidence: 93,
          timeframe: '12-36 hours',
          impact: 'medium',
          metrics: [
            { label: 'Wind CF', value: '78%' },
            { label: 'Grid Inertia', value: '4.1s' }
          ]
        }
      ]
      setPredictions(newPredictions)
    }

    generatePredictions()
  }, [])

  return (
    <AIContainer
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AIHeader>
        <h2>
          <span style={{ fontSize: '28px' }}>🔮</span>
          AI Predictive Analytics Engine
        </h2>
        <CloseButton onClick={onClose}>×</CloseButton>
      </AIHeader>

      {/* ML Model Status */}
      <MLModelStatus>
        <h3 style={{ color: '#f1f5f9', fontSize: '18px', margin: '0 0 15px 0' }}>
          🤖 Machine Learning Models
        </h3>
        <div className="model-grid">
          {mlModels.map(model => (
            <div key={model.name} className="model-item">
              <div className="model-name">{model.name}</div>
              <div className="model-accuracy">
                <span className="label">Accuracy</span>
                <span className="value">{model.accuracy}%</span>
              </div>
              <div className={`model-status ${model.status}`}>
                {model.status.toUpperCase()} • {model.lastUpdated}
              </div>
            </div>
          ))}
        </div>
      </MLModelStatus>

      {/* Load Forecasting Chart */}
      <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '15px', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ color: '#f1f5f9', fontSize: '16px', marginBottom: '15px' }}>
          📈 24-Hour Load Forecast vs Actual
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke="#10b981" 
              fill="rgba(16, 185, 129, 0.2)" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              strokeDasharray="5,5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Predictions Grid */}
      <PredictionGrid>
        {predictions.map((prediction, index) => (
          <PredictionCard
            key={prediction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="prediction-header">
              <span className="prediction-icon">{prediction.icon}</span>
              <span className="prediction-title">{prediction.title}</span>
              <span className="confidence">{prediction.confidence}%</span>
            </div>
            <div className="prediction-content">{prediction.content}</div>
            <div className="prediction-metrics">
              {prediction.metrics.map(metric => (
                <div key={metric.label} className="metric">
                  <div className="metric-value">{metric.value}</div>
                  <div className="metric-label">{metric.label}</div>
                </div>
              ))}
            </div>
          </PredictionCard>
        ))}
      </PredictionGrid>
    </AIContainer>
  )
}
