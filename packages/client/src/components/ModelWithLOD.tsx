import { useRef, useState, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Vector3, Group, LOD, Object3D, Mesh, SphereGeometry, MeshBasicMaterial } from 'three';

interface ModelWithLODProps {
  path: string;
  position?: Vector3;
  hiDetailDistance?: number;
  medDetailDistance?: number;
  lowDetailDistance?: number;
}

function ModelWithLOD({
  path,
  position = new Vector3(0, 0, 0),
  hiDetailDistance = 5,
  medDetailDistance = 15,
  lowDetailDistance = 30
}: ModelWithLODProps) {
  const { camera } = useThree();
  const lodRef = useRef<LOD>(null);
  const { scene } = useGLTF(path);
  
  // Create different LOD levels
  const levels = useMemo(() => {
    // High detail - original model
    const highDetail = scene.clone();
    
    // Medium detail - simplified version
    const mediumDetail = scene.clone();
    mediumDetail.traverse((node) => {
      if ((node as Mesh).isMesh) {
        node.castShadow = false;
        node.receiveShadow = false;
        // Would simplify geometry here in a real implementation
      }
    });
    
    // Low detail - very simplified or bounding box
    const lowDetail = new Group();
    // Create a simple placeholder - in a real implementation, 
    // you might generate this based on the model's dimensions
    const boundingMesh = new Mesh(
      new SphereGeometry(1, 8, 8),
      new MeshBasicMaterial({ color: 'gray', wireframe: true })
    );
    lowDetail.add(boundingMesh);
    
    return [highDetail, mediumDetail, lowDetail];
  }, [scene]);
  
  // Set up LOD on mount
  useEffect(() => {
    if (!lodRef.current) return;
    
    // Add LOD levels
    lodRef.current.addLevel(levels[0], hiDetailDistance);
    lodRef.current.addLevel(levels[1], medDetailDistance);
    lodRef.current.addLevel(levels[2], lowDetailDistance);
    
    // Make sure LOD is updated
    lodRef.current.update(camera);
    
    return () => {
      // Cleanup
      levels.forEach(level => level.dispose && level.dispose());
    };
  }, [levels, camera, hiDetailDistance, medDetailDistance, lowDetailDistance]);
  
  // Update LOD on each frame
  useFrame(() => {
    if (lodRef.current) {
      lodRef.current.update(camera);
    }
  });
  
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]} scale={0.2}>
      <primitive object={lodRef.current || new LOD()} />
    </group>
  );
}

export default ModelWithLOD;