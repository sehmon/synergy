import { useRef } from 'react';
import { PointLight, Group } from 'three';
import { useFrame } from '@react-three/fiber';
// import { useHelper } from '@react-three/drei';

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
  intensity = 1,
  // size = 0.15,
  amplitude = 0.1,
  speed = 1,
  // debug = false,
  phaseOffset = 0,
}: OrbLightProps) => {
  const lightRef = useRef<PointLight>(null);
  // const sphereRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  const initialY = position[1];
  const intensityScale = 15; // Increased light intensity

  // Simplified animation frame
  useFrame(({ clock }) => {
    if (groupRef.current) {
      try {
        const t = clock.getElapsedTime() * speed;
        const newY = initialY + Math.sin(t + phaseOffset) * amplitude;
        groupRef.current.position.y = newY;
      } catch (e) {
        // Silently catch any animation errors
        console.log(e);
      }
    }
  });

  // Scale down the polygon count for better performance
  // const sphereDetail = 16; // Lower polygon count (was 32)

  return (
    <group ref={groupRef} position={[position[0], initialY, position[2]]}>
      <pointLight
        ref={lightRef}
        color={color}
        intensity={intensity * intensityScale}
        distance={10}
        decay={2}
        castShadow={false} // Disable shadows for performance
      />
      {/* Using multiple meshes for better visibility */}
      {/* Core sphere - highly emissive */}

      {/* <mesh ref={sphereRef} frustumCulled={true}>
        <sphereGeometry args={[size * 0.7, sphereDetail, sphereDetail]} />
        <meshBasicMaterial color={color} transparent={false} />
      </mesh> */}

      {/* Outer glow */}
      {/* <mesh frustumCulled={true}>
        <sphereGeometry args={[size, sphereDetail, sphereDetail]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent={true}
          opacity={0.2}
        />
      </mesh> */}
    </group>
  );
};

export default OrbLight;
