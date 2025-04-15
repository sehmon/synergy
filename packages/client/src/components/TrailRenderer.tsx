import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface TrailRendererProps {
  positionHistory: THREE.Vector3[];
  color?: string;
  lineWidth?: number;
  maxLength?: number;
}

export default function TrailRenderer({
  positionHistory,
  color = '#ff0000',
  lineWidth = 1,
  maxLength = 100,
}: TrailRendererProps) {
  const lineRef = useRef<THREE.Line>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  
  // Create and update the line geometry
  useEffect(() => {
    if (!geometryRef.current) {
      geometryRef.current = new THREE.BufferGeometry();
    }
  }, []);

  // Update line on each frame with the latest position data
  useFrame(() => {
    if (!geometryRef.current || !lineRef.current) return;

    // Only process if we have at least 2 points
    if (positionHistory.length >= 2) {
      // Limit the trail length if needed
      const limitedHistory = positionHistory.slice(-maxLength);
      
      // Create positions array for the line
      const positions = new Float32Array(limitedHistory.length * 3);
      
      // Fill the positions array with Vector3 values
      limitedHistory.forEach((point, i) => {
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
      });
      
      // Update the line geometry
      geometryRef.current.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );
      
      // Ensure the geometry is updated
      geometryRef.current.computeBoundingSphere();
      
      // Update the line object
      lineRef.current.geometry = geometryRef.current;
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry ref={geometryRef} />
      <lineBasicMaterial color={color} linewidth={lineWidth} />
    </line>
  );
}