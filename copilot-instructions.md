# Copilot Instructions for 3D Electrical Grid Platform

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a cutting-edge 3D electrical grid visualization and simulation platform built with modern web technologies.

## Tech Stack & Architecture
- **Frontend**: React 19 + TypeScript + Vite
- **3D Graphics**: Three.js + React Three Fiber + React Three Drei
- **Physics**: Cannon.js for realistic electrical component behavior
- **AI/ML**: TensorFlow.js for grid optimization and fault prediction
- **State Management**: Redux Toolkit + Zustand for 3D scene state
- **Styling**: Styled Components + Framer Motion for animations
- **Data Visualization**: Recharts for analytics dashboards
- **Real-time**: Socket.io for live grid monitoring

## Key Features to Implement
1. **Real-time 3D Grid Visualization** - High-fidelity 3D models of power infrastructure
2. **Interactive Grid Designer** - Drag-and-drop component library for grid design
3. **Physics-based Simulation** - Accurate electrical behavior modeling
4. **AI-powered Analytics** - Fault detection, load optimization, predictive maintenance
5. **Sandbox Mode** - Overlay custom grids on real-world terrain
6. **Educational Components** - Interactive 3D models of electrical devices
7. **Professional Analytics** - Real-time performance monitoring and diagnostics

## Code Conventions
- Use TypeScript strictly with proper type definitions
- Follow React functional components with hooks
- Implement proper 3D scene optimization (LOD, frustum culling, etc.)
- Use proper physics simulation for electrical components
- Implement efficient real-time data streaming
- Follow responsive design principles for different screen sizes
- Use proper error boundaries and loading states
- Implement proper accessibility for 3D interactions

## 3D Scene Organization
- Organize components by electrical grid hierarchy (generation → transmission → distribution)
- Use proper instancing for repeated components (power lines, poles, etc.)
- Implement efficient material and texture management
- Use proper lighting for realistic electrical environments
- Implement interactive camera controls optimized for grid inspection

## Performance Guidelines
- Optimize 3D models for web rendering (low-poly with high-quality textures)
- Use proper LOD (Level of Detail) for large-scale grids
- Implement efficient physics simulation with selective collision detection
- Use worker threads for heavy computations (AI inference, large data processing)
- Implement proper memory management for large datasets
