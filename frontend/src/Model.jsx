// src/Model.jsx

import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';

export function Model({ modelData, setSelectedObject }) {
  const { scene } = useGLTF(modelData.models.file_url);

  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    cloned.position.set(modelData.position[0], modelData.position[1], modelData.position[2]);
    cloned.rotation.set(modelData.rotation[0], modelData.rotation[1], modelData.rotation[2]);
    cloned.scale.set(modelData.scale, modelData.scale, modelData.scale);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    cloned.userData.instanceId = modelData.instanceId;
    return cloned;
  }, [scene, modelData]);

  return (
    <primitive
      object={clonedScene}
      onClick={(e) => {
        e.stopPropagation();
        // --- THIS IS THE NEW LOGIC ---
        // If the model's category is 'room_base', deselect everything.
        // Otherwise, select the object that was clicked.
        if (modelData.models.category === 'room_base') {
          setSelectedObject(null);
        } else {
          setSelectedObject(clonedScene);
        }
      }}
    />
  );
}