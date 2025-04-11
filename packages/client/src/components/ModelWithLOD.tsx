import { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Vector3, Group, LOD, Mesh, MeshBasicMaterial, Object3D } from 'three';

interface ModelWithLODProps {
  path: string;
  position?: Vector3;
  scale?: number;
  hiDetailDistance?: number;
  medDetailDistance?: number;
  lowDetailDistance?: number;
}

function ModelWithLOD({
  path,
  position = new Vector3(0, 0, 0),
  scale = 0.2,
  hiDetailDistance = 5,
  medDetailDistance = 15,
  lowDetailDistance = 30,
}: ModelWithLODProps) {
  const { camera } = useThree();
  const groupRef = useRef<Group>(null);
  // Create the LOD object on first render
  const lodRef = useRef(new LOD());
  const { scene } = useGLTF(path);

  // Create different LOD levels
  const levels = useMemo(() => {
    console.log('Creating LOD levels for', path);

    // High detail - original model with full shadows
    const highDetail = scene.clone();
    highDetail.traverse((node) => {
      if ((node as Mesh).isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    // Medium detail - simplified version with less shadows
    const mediumDetail = scene.clone();
    mediumDetail.traverse((node) => {
      if ((node as Mesh).isMesh) {
        node.castShadow = false;
        node.receiveShadow = true;
        // Would simplify geometry here in a real implementation
      }
    });

    // Low detail - visible but simplified representation
    // Instead of wireframe sphere, use a simplified version of the model
    const lowDetail = scene.clone();
    lowDetail.traverse((node: Object3D) => {
      if ((node as Mesh).isMesh) {
        node.castShadow = false;
        node.receiveShadow = false;
        // Replace materials with simplified versions
        if (node.material) {
          node.material = new MeshBasicMaterial({
            color: 'lightgray',
            wireframe: false,
          });
        }
      }
    });

    return [highDetail, mediumDetail, lowDetail];
  }, [scene, path]);

  // Set up LOD on mount
  useEffect(() => {
    const lod = lodRef.current;

    // Clear any existing levels
    while (lod.children.length > 0) {
      lod.remove(lod.children[0]);
    }

    console.log('Adding LOD levels to', path);

    // LOD levels - the numbers are distance thresholds
    // Three.js LOD shows the object at index N when the distance is < distN and >= distN+1
    lod.addLevel(levels[0], 0); // Show highest detail when distance < medDetailDistance
    lod.addLevel(levels[1], medDetailDistance); // Show medium detail when medDetailDistance <= dist < lowDetailDistance
    lod.addLevel(levels[2], lowDetailDistance); // Show lowest detail when distance >= lowDetailDistance

    // Add the LOD to the group if not already added
    if (groupRef.current && !groupRef.current.children.includes(lod)) {
      groupRef.current.add(lod);
    }

    // Make sure LOD is updated
    lod.update(camera);

    // Debug logging to check distances and active LOD level
    console.log(
      `LOD setup complete with distances: 0, ${medDetailDistance}, ${lowDetailDistance}`
    );

    // Verify which LOD level is active on initial setup
    const cameraPosition = camera.position;
    const modelPosition = position;
    const distance = cameraPosition.distanceTo(modelPosition);
    console.log(
      `Initial distance to camera: ${distance}, Active LOD level: ${lod.getCurrentLevel()}`
    );

    // Force highest detail for debugging if needed
    // lod.forcedLevel = 0; // Uncomment to force highest detail always

    // Store a reference to the current group to avoid the React hooks warning
    const currentGroup = groupRef.current;
    
    return () => {
      // Cleanup specific to this component
      if (currentGroup && currentGroup.children.includes(lod)) {
        currentGroup.remove(lod);
      }
    };
  }, [
    levels,
    camera,
    hiDetailDistance,
    medDetailDistance,
    lowDetailDistance,
    path,
    position, // Add position to dependency array as it's used in the effect
  ]);

  // Update LOD on each frame and log for debugging
  useFrame(() => {
    const lod = lodRef.current;
    const previousLevel = lod.getCurrentLevel();

    // Update LOD
    lod.update(camera);

    // Only log when level changes to avoid console spam
    const newLevel = lod.getCurrentLevel();
    if (previousLevel !== newLevel) {
      const distance = camera.position.distanceTo(position);
      console.log(
        `LOD level changed: ${previousLevel} -> ${newLevel} at distance ${distance.toFixed(
          2
        )}`
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, Math.PI / 2, 0]}
      scale={scale}
    />
  );
}

export default ModelWithLOD;
