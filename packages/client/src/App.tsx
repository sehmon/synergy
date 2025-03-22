import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';
import Ground from './components/Ground';
import Model from './components/Model';
import CameraControls from './components/CameraControls';
import Onboarding from './components/Onboarding';

useGLTF.preload('/table.glb');
useGLTF.preload('/sculpture.glb');

function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const onOnboardingComplete = () => {
    setOnboardingComplete(true);
  };

  if (!onboardingComplete) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Onboarding onOnboardingComplete={onOnboardingComplete} />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        className="crosshair"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '24px',
          pointerEvents: 'none',
          zIndex: 999,
          userSelect: 'none',
        }}
      >
        <p>+</p>
      </div>
      <Canvas
        style={{
          height: '100vh',
          width: '100vw',
        }}
        shadows
        camera={{ position: [0, 2, 5], fov: 60 }}
      >
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
        <Ground />

        <Suspense
          fallback={
            <mesh>
              <boxGeometry />
              <meshStandardMaterial color="gray" />
            </mesh>
          }
        >
          <Model path="/table.glb" />
          <Model path="/sculpture.glb" position={new THREE.Vector3(0, 0, -7)} />
          <Model
            path="/sculpture.glb"
            position={new THREE.Vector3(0, 0, -12)}
          />
        </Suspense>
        <CameraControls />

        {/* Optional fog for depth */}
        <fog attach="fog" args={['#202030', 10, 50]} />
      </Canvas>
    </div>
  );
}

export default App;
