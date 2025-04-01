import React from 'react';
import { Vector3 } from 'three';
import { Sphere } from '@react-three/drei';

interface Obstacle {
  position: Vector3;
  radius: number;
}

interface CollisionDebuggerProps {
  obstacles: Obstacle[];
}

const CollisionDebugger: React.FC<CollisionDebuggerProps> = ({ obstacles }) => {
  return (
    <>
      {obstacles.map((obstacle, index) => (
        <group key={index}>
          {/* Main collision sphere */}
          <Sphere args={[obstacle.radius, 16, 16]} position={obstacle.position}>
            <meshBasicMaterial color="red" wireframe transparent opacity={0.5} />
          </Sphere>
          
          {/* Small marker at exact center position for debugging */}
          <Sphere args={[0.1, 8, 8]} position={obstacle.position}>
            <meshBasicMaterial color="yellow" />
          </Sphere>
        </group>
      ))}
    </>
  );
};

export default CollisionDebugger;