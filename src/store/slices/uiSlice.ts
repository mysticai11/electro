import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sidebarOpen: boolean
  sidebarWidth: number
  activePanel: 'components' | 'properties' | 'analytics' | 'settings'
  selectedTool: 'select' | 'move' | 'rotate' | 'scale' | 'connect' | 'measure'
  cameraMode: 'orbit' | 'fly' | 'walk' | 'inspect'
  showGrid: boolean
  showLabels: boolean
  showConnections: boolean
  showMetrics: boolean
  theme: 'dark' | 'light'
  snapToGrid: boolean
  gridSize: number
  performance: {
    quality: 'low' | 'medium' | 'high' | 'ultra'
    shadows: boolean
    postProcessing: boolean
    antiAliasing: boolean
    physicsEnabled: boolean
  }
  notifications: Array<{
    id: string
    type: 'info' | 'warning' | 'error' | 'success'
    title: string
    message: string
    timestamp: number
    read: boolean
  }>
  modal: {
    open: boolean
    type: 'component-properties' | 'settings' | 'export' | 'import' | 'help' | null
    data?: any
  }
}

const initialState: UIState = {
  sidebarOpen: true,
  sidebarWidth: 300,
  activePanel: 'components',
  selectedTool: 'select',
  cameraMode: 'orbit',
  showGrid: true,
  showLabels: true,
  showConnections: true,
  showMetrics: true,
  theme: 'dark',
  snapToGrid: false,
  gridSize: 1,
  performance: {
    quality: 'high',
    shadows: true,
    postProcessing: true,
    antiAliasing: true,
    physicsEnabled: true,
  },
  notifications: [],
  modal: {
    open: false,
    type: null,
  },
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = Math.max(200, Math.min(500, action.payload))
    },
    setActivePanel: (state, action: PayloadAction<UIState['activePanel']>) => {
      state.activePanel = action.payload
    },
    setSelectedTool: (state, action: PayloadAction<UIState['selectedTool']>) => {
      state.selectedTool = action.payload
    },
    setCameraMode: (state, action: PayloadAction<UIState['cameraMode']>) => {
      state.cameraMode = action.payload
    },
    toggleGrid: (state) => {
      state.showGrid = !state.showGrid
    },
    toggleLabels: (state) => {
      state.showLabels = !state.showLabels
    },
    toggleConnections: (state) => {
      state.showConnections = !state.showConnections
    },
    toggleMetrics: (state) => {
      state.showMetrics = !state.showMetrics
    },
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload
    },
    toggleSnapToGrid: (state) => {
      state.snapToGrid = !state.snapToGrid
    },
    setGridSize: (state, action: PayloadAction<number>) => {
      state.gridSize = Math.max(0.1, Math.min(10, action.payload))
    },
    updatePerformance: (state, action: PayloadAction<Partial<UIState['performance']>>) => {
      state.performance = { ...state.performance, ...action.payload }
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp' | 'read'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
        read: false,
      }
      state.notifications.unshift(notification)
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    openModal: (state, action: PayloadAction<{ type: UIState['modal']['type']; data?: any }>) => {
      state.modal = {
        open: true,
        type: action.payload.type,
        data: action.payload.data,
      }
    },
    closeModal: (state) => {
      state.modal = {
        open: false,
        type: null,
        data: undefined,
      }
    },
  },
})

export const {
  toggleSidebar,
  setSidebarWidth,
  setActivePanel,
  setSelectedTool,
  setCameraMode,
  toggleGrid,
  toggleLabels,
  toggleConnections,
  toggleMetrics,
  setTheme,
  toggleSnapToGrid,
  setGridSize,
  updatePerformance,
  addNotification,
  markNotificationRead,
  clearNotifications,
  openModal,
  closeModal,
} = uiSlice.actions
