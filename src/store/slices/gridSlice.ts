import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface GridComponent {
  id: string
  type: 'powerPlant' | 'transformer' | 'substation' | 'transmissionLine' | 'distributionLine' | 'generator' | 'turbine' | 'breaker' | 'switch' | 'meter'
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  properties: {
    voltage?: number
    current?: number
    power?: number
    capacity?: number
    efficiency?: number
    status?: 'online' | 'offline' | 'maintenance' | 'fault'
    temperature?: number
    load?: number
  }
  connections: string[]
  metadata: {
    name: string
    description?: string
    manufacturer?: string
    model?: string
    installDate?: string
    lastMaintenance?: string
  }
}

export interface GridConnection {
  id: string
  from: string
  to: string
  type: 'transmission' | 'distribution' | 'control'
  properties: {
    voltage: number
    current: number
    power: number
    resistance: number
    reactance: number
    capacity: number
    loss: number
  }
  status: 'active' | 'inactive' | 'fault'
}

interface GridState {
  components: Record<string, GridComponent>
  connections: Record<string, GridConnection>
  selectedComponentId: string | null
  highlightedConnections: string[]
  viewMode: 'overview' | 'detailed' | 'schematic'
  simulationRunning: boolean
  realTimeData: boolean
  gridMetrics: {
    totalPower: number
    totalLoad: number
    efficiency: number
    voltage: number
    frequency: number
    powerFactor: number
  }
}

const initialState: GridState = {
  components: {},
  connections: {},
  selectedComponentId: null,
  highlightedConnections: [],
  viewMode: 'overview',
  simulationRunning: false,
  realTimeData: false,
  gridMetrics: {
    totalPower: 0,
    totalLoad: 0,
    efficiency: 0,
    voltage: 0,
    frequency: 60,
    powerFactor: 1,
  },
}

export const gridSlice = createSlice({
  name: 'grid',
  initialState,
  reducers: {
    addComponent: (state, action: PayloadAction<GridComponent>) => {
      state.components[action.payload.id] = action.payload
    },
    updateComponent: (state, action: PayloadAction<{ id: string; updates: Partial<GridComponent> }>) => {
      const { id, updates } = action.payload
      if (state.components[id]) {
        state.components[id] = { ...state.components[id], ...updates }
      }
    },
    removeComponent: (state, action: PayloadAction<string>) => {
      delete state.components[action.payload]
      // Remove associated connections
      Object.keys(state.connections).forEach(connectionId => {
        const connection = state.connections[connectionId]
        if (connection.from === action.payload || connection.to === action.payload) {
          delete state.connections[connectionId]
        }
      })
    },
    addConnection: (state, action: PayloadAction<GridConnection>) => {
      state.connections[action.payload.id] = action.payload
    },
    updateConnection: (state, action: PayloadAction<{ id: string; updates: Partial<GridConnection> }>) => {
      const { id, updates } = action.payload
      if (state.connections[id]) {
        state.connections[id] = { ...state.connections[id], ...updates }
      }
    },
    removeConnection: (state, action: PayloadAction<string>) => {
      delete state.connections[action.payload]
    },
    selectComponent: (state, action: PayloadAction<string | null>) => {
      state.selectedComponentId = action.payload
      if (action.payload) {
        // Highlight connected components
        state.highlightedConnections = Object.values(state.connections)
          .filter(conn => conn.from === action.payload || conn.to === action.payload)
          .map(conn => conn.id)
      } else {
        state.highlightedConnections = []
      }
    },
    setViewMode: (state, action: PayloadAction<GridState['viewMode']>) => {
      state.viewMode = action.payload
    },
    toggleSimulation: (state) => {
      state.simulationRunning = !state.simulationRunning
    },
    toggleRealTimeData: (state) => {
      state.realTimeData = !state.realTimeData
    },
    updateGridMetrics: (state, action: PayloadAction<Partial<GridState['gridMetrics']>>) => {
      state.gridMetrics = { ...state.gridMetrics, ...action.payload }
    },
    loadGridConfiguration: (state, action: PayloadAction<{ components: Record<string, GridComponent>; connections: Record<string, GridConnection> }>) => {
      state.components = action.payload.components
      state.connections = action.payload.connections
    },
  },
})

export const {
  addComponent,
  updateComponent,
  removeComponent,
  addConnection,
  updateConnection,
  removeConnection,
  selectComponent,
  setViewMode,
  toggleSimulation,
  toggleRealTimeData,
  updateGridMetrics,
  loadGridConfiguration,
} = gridSlice.actions
