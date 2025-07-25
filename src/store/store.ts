import { configureStore } from '@reduxjs/toolkit'
import { gridSlice } from './slices/gridSlice'
import { uiSlice } from './slices/uiSlice'
import { simulationSlice } from './slices/simulationSlice'
import { analyticsSlice } from './slices/analyticsSlice'

export const store = configureStore({
  reducer: {
    grid: gridSlice.reducer,
    ui: uiSlice.reducer,
    simulation: simulationSlice.reducer,
    analytics: analyticsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['grid/addComponent', 'simulation/updatePhysics'],
        ignoredPaths: ['grid.components', 'simulation.physicsWorld'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
