// src/Model.jsx

import { useGLTF } from '@react-three/drei';
import { useMemo, useRef } from 'react';

export function Model({ modelData, setSelectedObject }) {
  const { scene } = useGLTF(modelData.models.file_url);
  const groupRef = useRef();

  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [scene]);

  return (
    <group
      ref={groupRef}
      position={modelData.position}
      rotation={modelData.rotation}
      scale={modelData.scale}
      userData={{
        instanceId: modelData.instanceId,
        category: modelData.models.category,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (modelData.models.category === 'room_base') {
          setSelectedObject(null);
        } else {
          setSelectedObject(groupRef.current);
        }
      }}
    >
      <primitive object={clonedScene} />
      {modelData.models.category === 'lamp' && (
        <pointLight
          color={"#FFDDB3"}
          intensity={10}
          distance={7}
          decay={2}
          castShadow
        />
      )}
    </group>
  );
}