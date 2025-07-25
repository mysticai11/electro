import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AnalyticsState {
  realTimeData: {
    enabled: boolean
    updateInterval: number
    lastUpdate: number
    connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error'
  }
  metrics: {
    power: {
      generated: number
      consumed: number
      peak: number
      average: number
      trend: 'up' | 'down' | 'stable'
      history: Array<{ timestamp: number; value: number }>
    }
    voltage: {
      current: number
      target: number
      deviation: number
      stability: number
      history: Array<{ timestamp: number; value: number }>
    }
    frequency: {
      current: number
      target: number
      deviation: number
      stability: number
      history: Array<{ timestamp: number; value: number }>
    }
    efficiency: {
      overall: number
      generation: number
      transmission: number
      distribution: number
      trend: 'improving' | 'declining' | 'stable'
      history: Array<{ timestamp: number; value: number }>
    }
    reliability: {
      uptime: number
      availability: number
      mtbf: number
      mttr: number
      incidents: number
      criticalAlerts: number
    }
    environmental: {
      carbonFootprint: number
      renewablePercentage: number
      efficiency: number
      emissions: { co2: number; nox: number; so2: number }
    }
  }
  alerts: Array<{
    id: string
    type: 'critical' | 'warning' | 'info'
    category: 'power' | 'voltage' | 'frequency' | 'temperature' | 'equipment' | 'security'
    title: string
    description: string
    component?: string
    location?: string
    severity: 1 | 2 | 3 | 4 | 5
    timestamp: number
    acknowledged: boolean
    resolved: boolean
    actions: Array<{ id: string; title: string; description: string; completed: boolean }>
  }>
  forecasting: {
    enabled: boolean
    horizon: '1h' | '6h' | '24h' | '7d' | '30d'
    confidence: number
    lastUpdate: number
    predictions: {
      load: Array<{ timestamp: number; value: number; confidence: number }>
      generation: Array<{ timestamp: number; value: number; confidence: number }>
      maintenance: Array<{ component: string; probability: number; timeframe: string }>
      failures: Array<{ component: string; probability: number; impact: 'low' | 'medium' | 'high' }>
    }
  }
  optimization: {
    enabled: boolean
    algorithm: 'genetic' | 'particle-swarm' | 'ant-colony' | 'neural-network'
    objective: 'cost' | 'efficiency' | 'reliability' | 'environmental'
    constraints: Record<string, { min?: number; max?: number; target?: number }>
    recommendations: Array<{
      id: string
      type: 'load-balance' | 'voltage-regulation' | 'generation-dispatch' | 'maintenance-schedule'
      description: string
      impact: { efficiency: number; cost: number; reliability: number }
      priority: 'low' | 'medium' | 'high' | 'critical'
      implementable: boolean
      estimatedTime: string
    }>
    schedule: Array<{
      id: string
      action: string
      component: string
      scheduledTime: number
      duration: number
      status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
    }>
  }
  reports: {
    available: Array<{
      id: string
      type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'incident'
      title: string
      description: string
      period: { start: number; end: number }
      generated: number
      size: string
      format: 'pdf' | 'csv' | 'json' | 'xlsx'
    }>
    generating: boolean
    lastGenerated: number
  }
}

const initialState: AnalyticsState = {
  realTimeData: {
    enabled: false,
    updateInterval: 1000,
    lastUpdate: 0,
    connectionStatus: 'disconnected',
  },
  metrics: {
    power: {
      generated: 0,
      consumed: 0,
      peak: 0,
      average: 0,
      trend: 'stable',
      history: [],
    },
    voltage: {
      current: 120,
      target: 120,
      deviation: 0,
      stability: 100,
      history: [],
    },
    frequency: {
      current: 60,
      target: 60,
      deviation: 0,
      stability: 100,
      history: [],
    },
    efficiency: {
      overall: 0,
      generation: 0,
      transmission: 0,
      distribution: 0,
      trend: 'stable',
      history: [],
    },
    reliability: {
      uptime: 99.9,
      availability: 99.9,
      mtbf: 8760,
      mttr: 4,
      incidents: 0,
      criticalAlerts: 0,
    },
    environmental: {
      carbonFootprint: 0,
      renewablePercentage: 0,
      efficiency: 0,
      emissions: { co2: 0, nox: 0, so2: 0 },
    },
  },
  alerts: [],
  forecasting: {
    enabled: false,
    horizon: '24h',
    confidence: 0,
    lastUpdate: 0,
    predictions: {
      load: [],
      generation: [],
      maintenance: [],
      failures: [],
    },
  },
  optimization: {
    enabled: false,
    algorithm: 'neural-network',
    objective: 'efficiency',
    constraints: {},
    recommendations: [],
    schedule: [],
  },
  reports: {
    available: [],
    generating: false,
    lastGenerated: 0,
  },
}

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    toggleRealTimeData: (state) => {
      state.realTimeData.enabled = !state.realTimeData.enabled
    },
    setUpdateInterval: (state, action: PayloadAction<number>) => {
      state.realTimeData.updateInterval = Math.max(100, action.payload)
    },
    setConnectionStatus: (state, action: PayloadAction<AnalyticsState['realTimeData']['connectionStatus']>) => {
      state.realTimeData.connectionStatus = action.payload
    },
    updateMetrics: (state, action: PayloadAction<Partial<AnalyticsState['metrics']>>) => {
      const timestamp = Date.now()
      
      // Update metrics and add to history
      Object.keys(action.payload).forEach(metricKey => {
        const metric = action.payload[metricKey as keyof AnalyticsState['metrics']]
        if (metric && state.metrics[metricKey as keyof AnalyticsState['metrics']]) {
          Object.assign(state.metrics[metricKey as keyof AnalyticsState['metrics']], metric)
          
          // Add to history if it has a current value
          if ('current' in metric && typeof metric.current === 'number') {
            const history = (state.metrics[metricKey as keyof AnalyticsState['metrics']] as any).history
            if (Array.isArray(history)) {
              history.push({ timestamp, value: metric.current })
              // Keep only last 1000 points
              if (history.length > 1000) {
                history.shift()
              }
            }
          }
        }
      })
      
      state.realTimeData.lastUpdate = timestamp
    },
    addAlert: (state, action: PayloadAction<Omit<AnalyticsState['alerts'][0], 'id' | 'timestamp'>>) => {
      const alert = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      }
      state.alerts.unshift(alert)
      
      // Update critical alerts count
      state.metrics.reliability.criticalAlerts = state.alerts.filter(a => a.type === 'critical' && !a.resolved).length
    },
    acknowledgeAlert: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find(a => a.id === action.payload)
      if (alert) {
        alert.acknowledged = true
      }
    },
    resolveAlert: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find(a => a.id === action.payload)
      if (alert) {
        alert.resolved = true
        state.metrics.reliability.criticalAlerts = state.alerts.filter(a => a.type === 'critical' && !a.resolved).length
      }
    },
    updateAlertAction: (state, action: PayloadAction<{ alertId: string; actionId: string; completed: boolean }>) => {
      const alert = state.alerts.find(a => a.id === action.payload.alertId)
      if (alert) {
        const alertAction = alert.actions.find(a => a.id === action.payload.actionId)
        if (alertAction) {
          alertAction.completed = action.payload.completed
        }
      }
    },
    toggleForecasting: (state) => {
      state.forecasting.enabled = !state.forecasting.enabled
    },
    setForecastingHorizon: (state, action: PayloadAction<AnalyticsState['forecasting']['horizon']>) => {
      state.forecasting.horizon = action.payload
    },
    updatePredictions: (state, action: PayloadAction<Partial<AnalyticsState['forecasting']['predictions']>>) => {
      state.forecasting.predictions = { ...state.forecasting.predictions, ...action.payload }
      state.forecasting.lastUpdate = Date.now()
    },
    toggleOptimization: (state) => {
      state.optimization.enabled = !state.optimization.enabled
    },
    setOptimizationAlgorithm: (state, action: PayloadAction<AnalyticsState['optimization']['algorithm']>) => {
      state.optimization.algorithm = action.payload
    },
    setOptimizationObjective: (state, action: PayloadAction<AnalyticsState['optimization']['objective']>) => {
      state.optimization.objective = action.payload
    },
    updateOptimizationConstraints: (state, action: PayloadAction<AnalyticsState['optimization']['constraints']>) => {
      state.optimization.constraints = action.payload
    },
    addRecommendation: (state, action: PayloadAction<AnalyticsState['optimization']['recommendations'][0]>) => {
      state.optimization.recommendations.push(action.payload)
    },
    removeRecommendation: (state, action: PayloadAction<string>) => {
      state.optimization.recommendations = state.optimization.recommendations.filter(r => r.id !== action.payload)
    },
    scheduleOptimization: (state, action: PayloadAction<AnalyticsState['optimization']['schedule'][0]>) => {
      state.optimization.schedule.push(action.payload)
    },
    updateScheduleStatus: (state, action: PayloadAction<{ id: string; status: AnalyticsState['optimization']['schedule'][0]['status'] }>) => {
      const item = state.optimization.schedule.find(s => s.id === action.payload.id)
      if (item) {
        item.status = action.payload.status
      }
    },
    generateReport: (state, action: PayloadAction<{ type: AnalyticsState['reports']['available'][0]['type']; title: string; description: string; period: { start: number; end: number } }>) => {
      state.reports.generating = true
      const report = {
        id: Date.now().toString(),
        ...action.payload,
        generated: Date.now(),
        size: '2.5 MB',
        format: 'pdf' as const,
      }
      state.reports.available.unshift(report)
      state.reports.lastGenerated = Date.now()
    },
    setReportGenerating: (state, action: PayloadAction<boolean>) => {
      state.reports.generating = action.payload
    },
    removeReport: (state, action: PayloadAction<string>) => {
      state.reports.available = state.reports.available.filter(r => r.id !== action.payload)
    },
  },
})

export const {
  toggleRealTimeData,
  setUpdateInterval,
  setConnectionStatus,
  updateMetrics,
  addAlert,
  acknowledgeAlert,
  resolveAlert,
  updateAlertAction,
  toggleForecasting,
  setForecastingHorizon,
  updatePredictions,
  toggleOptimization,
  setOptimizationAlgorithm,
  setOptimizationObjective,
  updateOptimizationConstraints,
  addRecommendation,
  removeRecommendation,
  scheduleOptimization,
  updateScheduleStatus,
  generateReport,
  setReportGenerating,
  removeReport,
} = analyticsSlice.actions
