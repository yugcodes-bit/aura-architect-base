// src/Scene.jsx

import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import { Model } from './Model';

export function Scene({ models = [], transformMode, selectedObject, setSelectedObject, onTransformEnd }) {
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      
      const callback = () => {
        if (onTransformEnd && controls.object) {
          onTransformEnd(
            controls.object.userData.instanceId,
            [controls.object.position.x, controls.object.position.y, controls.object.position.z],
            [controls.object.rotation.x, controls.object.rotation.y, controls.object.rotation.z],
            controls.object.scale.x
          );
        }
      };
      
      controls.addEventListener('mouseUp', callback);
      return () => controls.removeEventListener('mouseUp', callback);
    }
  });

  return (
    <Canvas 
      shadows 
      camera={{ position: [0, 1.5, 4] }}
      onPointerMissed={() => setSelectedObject(null)}
    >
      <hemisphereLight skyColor={0x78909c} groundColor={0x455a64} intensity={0.8} />
      <directionalLight castShadow position={[0, 3, 2]} intensity={1.5} />
      <OrbitControls makeDefault enabled={!selectedObject} />

      <TransformControls ref={controlsRef} object={selectedObject} mode={transformMode} />

      {models.map((modelData) => (
        <Model
          key={modelData.instanceId}
          modelData={modelData}
          setSelectedObject={setSelectedObject}
        />
      ))}
    </Canvas>
  );
}