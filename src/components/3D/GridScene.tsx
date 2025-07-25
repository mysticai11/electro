import React from 'react'
import { PowerPlant } from './Components/PowerPlant'
import { Transformer } from './Components/Transformer'
import { TransmissionLine } from './Components/TransmissionLine'
import { WindTurbine } from './Components/WindTurbine'
import { SolarPanel } from './Components/SolarPanel'
import { Substation } from './Components/Substation'

export const GridScene: React.FC = () => {
  return (
    <group>
      {/* Sample Power Plant */}
      <PowerPlant 
        position={[-30, 0, -30]} 
        status="online"
        capacity={1000}
      />
      
      {/* Sample Transformers */}
      <Transformer 
        position={[-15, 0, -20]} 
        voltage={230}
        status="online"
      />
      <Transformer 
        position={[15, 0, -20]} 
        voltage={230}
        status="online"
      />
      
      {/* Sample Wind Farm */}
      <WindTurbine position={[-40, 0, 10]} rotation={[0, 0.5, 0]} />
      <WindTurbine position={[-35, 0, 15]} rotation={[0, 0.8, 0]} />
      <WindTurbine position={[-30, 0, 20]} rotation={[0, 1.2, 0]} />
      <WindTurbine position={[-25, 0, 12]} rotation={[0, 0.3, 0]} />
      
      {/* Sample Solar Farm */}
      <SolarPanel position={[25, 0, 25]} />
      <SolarPanel position={[30, 0, 25]} />
      <SolarPanel position={[35, 0, 25]} />
      <SolarPanel position={[25, 0, 30]} />
      <SolarPanel position={[30, 0, 30]} />
      <SolarPanel position={[35, 0, 30]} />
      
      {/* Sample Substations */}
      <Substation 
        position={[0, 0, 0]} 
        voltage={230000}
        load={75}
      />
      <Substation 
        position={[20, 0, -10]} 
        voltage={115000}
        load={60}
      />
      <Substation 
        position={[-20, 0, 10]} 
        voltage={69000}
        load={45}
      />
      
      {/* Sample Transmission Lines with Enhanced Features */}
      <TransmissionLine 
        start={[-30, 8, -30]} 
        end={[-15, 8, -20]} 
        voltage={500}
        current={1200}
        powerFlow={850}
        loadCapacity={85}
        isActive={true}
      />
      <TransmissionLine 
        start={[-15, 8, -20]} 
        end={[0, 8, 0]} 
        voltage={230}
        current={800}
        powerFlow={650}
        loadCapacity={72}
        isActive={true}
      />
      <TransmissionLine 
        start={[0, 8, 0]} 
        end={[15, 8, -20]} 
        voltage={230}
        current={600}
        powerFlow={480}
        loadCapacity={68}
        isActive={true}
      />
      <TransmissionLine 
        start={[0, 8, 0]} 
        end={[20, 8, -10]} 
        voltage={115}
        current={400}
        powerFlow={320}
        loadCapacity={55}
        isActive={true}
      />
      <TransmissionLine 
        start={[-20, 8, 10]} 
        end={[0, 8, 0]} 
        voltage={115}
        current={300}
        powerFlow={250}
        loadCapacity={45}
        isActive={true}
        hasFault={true}
      />
      
      {/* Renewable connections */}
      <TransmissionLine 
        start={[-35, 15, 15]} 
        end={[-20, 8, 10]} 
        voltage={69}
        current={200}
        powerFlow={180}
        loadCapacity={35}
        isActive={true}
      />
      <TransmissionLine 
        start={[30, 5, 27]} 
        end={[20, 8, -10]} 
        voltage={69}
        current={150}
        powerFlow={120}
        loadCapacity={28}
        isActive={true}
      />
    </group>
  )
}
