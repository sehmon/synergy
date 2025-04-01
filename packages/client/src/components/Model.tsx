import { useRef, useEffect, memo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Vector3, Object3D, Mesh } from 'three';

// Define types
interface ModelProps {
  path: string;
  position?: Vector3;
  enableShadows?: boolean;
}

// Model cloning is necessary when reusing the same model in multiple places
// useGLTF caches the original model loading, but we need to clone for multiple instances

function Model({
  path,
  position = new Vector3(0, 0, 0),
  enableShadows = true,
}: ModelProps) {
  // Load the model with caching enabled
  const { scene } = useGLTF(path, true);
  // We need to clone the scene to use it multiple times
  const clonedScene = useRef(scene.clone(true));
  
  useEffect(() => {
    // Configure shadow settings on the cloned scene
    if (clonedScene.current) {
      clonedScene.current.traverse((node) => {
        if ((node as Mesh).isMesh && enableShadows) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
    }
  }, [enableShadows]);

  return (
    <group rotation={[0, Math.PI / 2, 0]} scale={0.2} position={position}>
      <primitive object={clonedScene.current} />
    </group>
  );
}

// Use memo to prevent unnecessary re-renders
export default memo(Model);
