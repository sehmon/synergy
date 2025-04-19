import { Physics } from '@react-three/rapier';
import Ground from '../components/Ground';
import { Suspense, useCallback } from 'react';
import ModelLoader from '../components/ModelLoader';
import OptimizedScene from '../components/OptimizedScene';
import CameraPlayer from '../components/CameraPlayer';
import OrbLight from '../components/OrbLight';
import useSocketEvents from '../hooks/useSocketEvents';
import ApiTriggerZone from '../components/ApiTriggerZone';
import { Box } from '@react-three/drei';
import { useAtom } from 'jotai';
import { positionAtom } from '../state/position';

function DebugScene() {
  const { isConnected, sliderValue, positions } = useSocketEvents();

  const [positionHistory] = useAtom(positionAtom);

  const handleEnterAPIZone = useCallback(() => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userInfo: { name: 'Sehmon Burnam' },
        positionHistory: positionHistory,
      }),
    };
    fetch('http://localhost:4000/player-trail', requestOptions).then(
      (response) => response.json()
    );
  }, [positionHistory]);

  return (
    <Physics gravity={[0, 0, 0]}>
      {/* Ambient light - reduced intensity for better contrast */}
      <ambientLight intensity={0.5} />

      {/* Key light - main illumination */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill light - softer light from opposite side */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={0.8}
        color="#c0e0ff"
      />

      {/* Rim light - highlights edges */}
      <spotLight
        position={[0, 5, -10]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        color="#ffffff"
        decay={2}
        distance={20}
        castShadow
      />

      {/* Ground fill light */}
      <pointLight
        position={[0, -3, 0]}
        intensity={0.5}
        color="#ffffe0"
        decay={2}
        distance={10}
      />

      {/* Add the ground */}
      <Ground grid />

      <Suspense fallback={null}>
        <ModelLoader>
          <OptimizedScene frustumCulling={true}>
            {/* {positions.length > 0 &&
              positions.map(([x, z], idx) => (
                <OrbLight
                  key={idx.toString()}
                  position={[x, 2, z]}
                  color="#ffffff"
                  intensity={sliderValue ?? 1}
                  size={0.4}
                  amplitude={1}
                  speed={0.8}
                  phaseOffset={1}
                />
              ))} */}
            <ApiTriggerZone
              position={[3, 0, 0]}
              size={[2, 2, 2]} // Width, Height, Depth
              onEnterZone={handleEnterAPIZone}
            />
          </OptimizedScene>
        </ModelLoader>
      </Suspense>
      <CameraPlayer />

      {/* Optional fog for depth */}
      <fog attach="fog" args={['#000', 10, 20]} />
    </Physics>
  );
}

export default DebugScene;
