import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface SimulationState {
  isRunning: boolean
  isPaused: boolean
  speed: number
  timeScale: number
  currentTime: number
  deltaTime: number
  physics: {
    enabled: boolean
    gravity: [number, number, number]
    iterations: number
    broadphase: 'naive' | 'sap'
    allowSleep: boolean
  }
  electrical: {
    frequency: number
    baseVoltage: number
    timeStep: number
    maxIterations: number
    convergence: number
    loadFlow: {
      enabled: boolean
      method: 'newton-raphson' | 'gauss-seidel' | 'fast-decoupled'
      tolerance: number
    }
    faultAnalysis: {
      enabled: boolean
      type: 'short-circuit' | 'ground-fault' | 'open-circuit'
      location?: string
    }
  }
  weather: {
    enabled: boolean
    temperature: number
    humidity: number
    windSpeed: number
    windDirection: number
    precipitation: number
    visibility: number
  }
  scenarios: Array<{
    id: string
    name: string
    description: string
    type: 'normal' | 'peak-load' | 'fault' | 'maintenance' | 'emergency'
    parameters: Record<string, any>
    duration: number
    active: boolean
  }>
  activeScenario: string | null
  results: {
    powerFlow: Record<string, { voltage: number; current: number; power: number }>
    stability: { stable: boolean; margin: number; oscillations: number }
    efficiency: { overall: number; byComponent: Record<string, number> }
    losses: { total: number; transmission: number; distribution: number }
    reliability: { uptime: number; mtbf: number; mttr: number }
  }
}

const initialState: SimulationState = {
  isRunning: false,
  isPaused: false,
  speed: 1.0,
  timeScale: 1.0,
  currentTime: 0,
  deltaTime: 0,
  physics: {
    enabled: true,
    gravity: [0, -9.81, 0],
    iterations: 5,
    broadphase: 'sap',
    allowSleep: true,
  },
  electrical: {
    frequency: 60,
    baseVoltage: 120,
    timeStep: 0.01,
    maxIterations: 100,
    convergence: 1e-6,
    loadFlow: {
      enabled: true,
      method: 'newton-raphson',
      tolerance: 1e-6,
    },
    faultAnalysis: {
      enabled: false,
      type: 'short-circuit',
    },
  },
  weather: {
    enabled: false,
    temperature: 20,
    humidity: 50,
    windSpeed: 5,
    windDirection: 0,
    precipitation: 0,
    visibility: 10,
  },
  scenarios: [],
  activeScenario: null,
  results: {
    powerFlow: {},
    stability: { stable: true, margin: 0, oscillations: 0 },
    efficiency: { overall: 0, byComponent: {} },
    losses: { total: 0, transmission: 0, distribution: 0 },
    reliability: { uptime: 0, mtbf: 0, mttr: 0 },
  },
}

export const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    startSimulation: (state) => {
      state.isRunning = true
      state.isPaused = false
    },
    pauseSimulation: (state) => {
      state.isPaused = true
    },
    stopSimulation: (state) => {
      state.isRunning = false
      state.isPaused = false
      state.currentTime = 0
    },
    resumeSimulation: (state) => {
      state.isPaused = false
    },
    setSpeed: (state, action: PayloadAction<number>) => {
      state.speed = Math.max(0.1, Math.min(10, action.payload))
    },
    setTimeScale: (state, action: PayloadAction<number>) => {
      state.timeScale = Math.max(0.1, Math.min(100, action.payload))
    },
    updateTime: (state, action: PayloadAction<{ currentTime: number; deltaTime: number }>) => {
      state.currentTime = action.payload.currentTime
      state.deltaTime = action.payload.deltaTime
    },
    updatePhysics: (state, action: PayloadAction<Partial<SimulationState['physics']>>) => {
      state.physics = { ...state.physics, ...action.payload }
    },
    updateElectrical: (state, action: PayloadAction<Partial<SimulationState['electrical']>>) => {
      state.electrical = { ...state.electrical, ...action.payload }
    },
    updateWeather: (state, action: PayloadAction<Partial<SimulationState['weather']>>) => {
      state.weather = { ...state.weather, ...action.payload }
    },
    addScenario: (state, action: PayloadAction<SimulationState['scenarios'][0]>) => {
      state.scenarios.push(action.payload)
    },
    updateScenario: (state, action: PayloadAction<{ id: string; updates: Partial<SimulationState['scenarios'][0]> }>) => {
      const scenario = state.scenarios.find(s => s.id === action.payload.id)
      if (scenario) {
        Object.assign(scenario, action.payload.updates)
      }
    },
    removeScenario: (state, action: PayloadAction<string>) => {
      state.scenarios = state.scenarios.filter(s => s.id !== action.payload)
      if (state.activeScenario === action.payload) {
        state.activeScenario = null
      }
    },
    setActiveScenario: (state, action: PayloadAction<string | null>) => {
      // Deactivate all scenarios
      state.scenarios.forEach(s => s.active = false)
      
      if (action.payload) {
        const scenario = state.scenarios.find(s => s.id === action.payload)
        if (scenario) {
          scenario.active = true
          state.activeScenario = action.payload
        }
      } else {
        state.activeScenario = null
      }
    },
    updateResults: (state, action: PayloadAction<Partial<SimulationState['results']>>) => {
      state.results = { ...state.results, ...action.payload }
    },
    resetSimulation: (state) => {
      state.isRunning = false
      state.isPaused = false
      state.currentTime = 0
      state.deltaTime = 0
      state.results = initialState.results
    },
  },
})

export const {
  startSimulation,
  pauseSimulation,
  stopSimulation,
  resumeSimulation,
  setSpeed,
  setTimeScale,
  updateTime,
  updatePhysics,
  updateElectrical,
  updateWeather,
  addScenario,
  updateScenario,
  removeScenario,
  setActiveScenario,
  updateResults,
  resetSimulation,
} = simulationSlice.actions
