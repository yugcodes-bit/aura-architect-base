import { Canvas } from '@react-three/fiber';

import { OrbitControls, TransformControls } from '@react-three/drei';

import { Model } from './Model';



export function Scene({ models, transformMode, selectedObject, setSelectedObject }) {

return (

 // THE ONLY CHANGE IS ADDING `onPointerMissed` HERE

 <Canvas

 shadows

 camera={{ position: [0, 1.5, 4] }}

 onPointerMissed={() => setSelectedObject(null)}
 >

 <hemisphereLight skyColor={0x78909c} groundColor={0x455a64} intensity={0.8} />

 <directionalLight castShadow position={[0, 3, 2]} intensity={1.5} />
 <OrbitControls makeDefault enabled={!selectedObject} />



 {selectedObject && <TransformControls object={selectedObject} mode={transformMode} />}



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