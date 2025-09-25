// src/Scene.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import { Model } from './Model';

export function Scene({ models = [], transformMode, selectedObject, setSelectedObject, onTransformEnd, lightIntensity }) {
  const handleMouseUp = () => {
    if (selectedObject && onTransformEnd) {
      onTransformEnd(
        selectedObject.userData.instanceId,
        [selectedObject.position.x, selectedObject.position.y, selectedObject.position.z],
        [selectedObject.rotation.x, selectedObject.rotation.y, selectedObject.rotation.z],
        selectedObject.scale.x
      );
    }
  };

  return (
    <Canvas 
      shadows 
      camera={{ position: [0, 1.5, 4] }}
      onPointerMissed={() => setSelectedObject(null)}
    >
      <hemisphereLight skyColor={0x78909c} groundColor={0x455a64} intensity={0.8} />
      <directionalLight castShadow position={[0, 3, 2]} intensity={1.5} />
      <OrbitControls makeDefault enabled={!selectedObject} />

      {selectedObject && 
        <TransformControls 
          object={selectedObject} 
          mode={transformMode} 
          onMouseUp={handleMouseUp} 
        />
      }

      {models.map((modelData) => (
        <Model
          key={modelData.instanceId}
          modelData={modelData}
          setSelectedObject={setSelectedObject}
          lightIntensity={lightIntensity} // Pass the intensity down
        />
      ))}
    </Canvas>
  );
}