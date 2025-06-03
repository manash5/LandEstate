import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const ModernHouse = ({ position, rotation, scale }) => {
  const houseRef = useRef();
  
  useFrame((state) => {
    if (houseRef.current) {
      // houseRef.current.rotation.y += 0.001;
    }
  });
  
  return (
    <group ref={houseRef} position={position} rotation={rotation} scale={scale}>
      {/* Foundation */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[6, 0.2, 6]} />
        <meshPhysicalMaterial 
          color="#E5F2FF"
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      
      {/* Main Structure */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[5, 4, 5]} />
        <meshPhysicalMaterial 
          color="#FFFFFF"
          roughness={0.1}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Glass Walls */}
      <mesh position={[0, 2, 2.51]} castShadow>
        <planeGeometry args={[4, 3]} />
        <meshPhysicalMaterial 
          color="#90E0EF"
          roughness={0}
          metalness={0.2}
          transmission={0.9}
          thickness={0.5}
          opacity={0.8}
          transparent
        />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 4.1, 0]} castShadow>
        <boxGeometry args={[5.2, 0.2, 5.2]} />
        <meshPhysicalMaterial 
          color="#00B4D8"
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      
      {/* Accent Details */}
      <mesh position={[-2.5, 1.5, 0]} castShadow>
        <boxGeometry args={[0.1, 3, 2]} />
        <meshPhysicalMaterial 
          color="#138BBC"
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
};

const Scene = ({ interactive = true }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [3, 6, 15], fov: 45 }}
        className="bg-gray-100"
      >
        <color attach="background" args={['#111523']} />
        <fog attach="fog" args={['#111523', 15, 25]} />
        
        <ModernHouse 
          position={[0, 0, 0]} 
          rotation={[0, Math.PI /2, 0]} 
          scale={1} 
        />
        <ModernHouse 
          position={[-6, 0, -4]} 
          scale={0.8} 
        />
        <ModernHouse 
          position={[6, 0, -3]} 
          rotation={[0, Math.PI / 2, 0]} 
          scale={0.9} 
        />
        
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -0.1, 0]} 
          receiveShadow
        >
          {/* <planeGeometry args={[100, 100]} />
          <meshPhysicalMaterial 
            color="#111523"
            roughness={0.4}
            metalness={0.1}
          /> */}
        </mesh>
        
        <Environment preset="sunset" />
        {interactive && (
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            minPolarAngle={Math.PI / 3} 
            maxPolarAngle={Math.PI / 2.2}
            rotateSpeed={0.5}
          />
        )}
      </Canvas>
    </div>
  );
};

export default Scene;