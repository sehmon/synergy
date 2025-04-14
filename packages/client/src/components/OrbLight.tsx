import { useRef } from 'react';
import { PointLight, Mesh, Group } from 'three';
import { useFrame } from '@react-three/fiber';

interface OrbLightProps {
  position?: [number, number, number];
  color?: string;
  intensity?: number;
  size?: number;
  amplitude?: number;
  speed?: number;
  debug?: boolean;
  phaseOffset?: number;
}

const OrbLight = ({
  position = [0, 2.5, 0],
  color = '#ffffe0',
  intensity = 1.5,
  size = 0.15,
  amplitude = 0.1,
  speed = 1,
  // debug = false,
  phaseOffset = 0,
}: OrbLightProps) => {
  const lightRef = useRef<PointLight>(null);
  const sphereRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  const initialY = position[1];

  // if (debug) {
  //   useHelper(lightRef, PointLightHelper, 0.5);
  // }

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime() * speed;
      const newY = initialY + Math.sin(t + phaseOffset) * amplitude;
      groupRef.current.position.y = newY;
      const newIntensity = Math.abs(Math.sin(t) * intensity); // Clamp to avoid negatives
      if (lightRef.current) {
        lightRef.current.intensity = newIntensity * 10;
      }
    }
  });

  return (
    <group ref={groupRef} position={[position[0], initialY, position[2]]}>
      <pointLight
        ref={lightRef}
        color={color}
        intensity={intensity}
        distance={10}
        decay={2}
        castShadow={true} // Can re-enable later
      />
      <mesh ref={sphereRef} frustumCulled={false}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

export default OrbLight;
