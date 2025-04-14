import { Physics } from '@react-three/rapier';
import Ground from '../components/Ground';
import { Suspense } from 'react';
import ModelLoader from '../components/ModelLoader';
import OptimizedScene from '../components/OptimizedScene';
import CameraPlayer from '../components/CameraPlayer';
import OrbLight from '../components/OrbLight';

function DebugScene() {
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
            <OrbLight
              position={[0, 2, 0]}
              color="#ffffff"
              intensity={10.0}
              size={0.4}
              amplitude={1}
              speed={0.8}
              phaseOffset={1}
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
