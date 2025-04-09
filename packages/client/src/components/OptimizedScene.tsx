import { useMemo, useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OptimizedSceneProps {
  children: React.ReactNode;
  frustumCulling?: boolean;
  occlusionCulling?: boolean;
}

function OptimizedScene({
  children,
  frustumCulling = true,
  occlusionCulling = false,
}: OptimizedSceneProps) {
  const { camera, scene } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Frustum for culling calculations
  const frustum = useMemo(() => new THREE.Frustum(), []);
  const projScreenMatrix = useMemo(() => new THREE.Matrix4(), []);

  // Configure scene for better performance
  useEffect(() => {
    // Apply performance optimizations
    scene.matrixAutoUpdate = false; // We'll update matrices manually

    if (occlusionCulling) {
      console.warn(
        'Occlusion culling is enabled but requires additional setup'
      );
      // Would need to implement an occlusion culling system here
    }

    return () => {
      // Cleanup
      scene.matrixAutoUpdate = true;
    };
  }, [scene, occlusionCulling]);

  // Run optimizations on each frame
  useFrame(() => {
    if (!groupRef.current) return;

    if (frustumCulling) {
      // Update the frustum
      projScreenMatrix.multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      );
      frustum.setFromProjectionMatrix(projScreenMatrix);

      // Apply frustum culling to all objects
      groupRef.current.traverse((object: any) => {
        if (object.type === 'Mesh') {
          // Skip already invisible objects
          if (!object.visible) return;

          // Only compute for objects that haven't already been processed
          if (object.userData.frustumCulled === undefined) {
            // Create a bounding sphere if it doesn't exist
            if (!object.geometry.boundingSphere) {
              object.geometry.computeBoundingSphere();
            }

            // Get world position
            const worldPos = new THREE.Vector3();
            object.getWorldPosition(worldPos);

            // Create a world space bounding sphere
            const worldBoundingSphere = object.geometry.boundingSphere!.clone();
            worldBoundingSphere.center.copy(worldPos);

            // Test against frustum
            const isVisible = frustum.intersectsSphere(worldBoundingSphere);
            object.visible = isVisible;
            object.userData.frustumCulled = true;
          }
        }
      });
    }

    // Update all matrices
    groupRef.current.updateMatrixWorld(true);
  });

  return <group ref={groupRef}>{children}</group>;
}

export default OptimizedScene;
