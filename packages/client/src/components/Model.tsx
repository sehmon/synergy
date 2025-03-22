//@ts-nocheck
import { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { Vector3 } from 'three';

function Model({ path, position = new Vector3(0, 0, 0) }) {
  const { scene } = useGLTF(path);

  const sceneClone = useRef(scene.clone(true));

  useEffect(() => {
    sceneClone.current.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }, []);

  return (
    <group rotation={[0, Math.PI / 2, 0]} scale={0.2} position={position}>
      <primitive object={sceneClone.current} />
    </group>
  );
}

export default Model;
