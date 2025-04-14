import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';
import './mobileControls.css';
import Ground from './components/Ground';
import Model from './components/Model';
import OptimizedScene from './components/OptimizedScene';
import ModelLoader from './components/ModelLoader';
// CameraControls is not used in current implementation
// import CameraControls from './components/CameraControls';
import Onboarding from './components/Onboarding';
import VideoTexture from './components/VideoTexture';
import OrbLight from './components/OrbLight';
import { Physics, RigidBody } from '@react-three/rapier';
import CameraPlayer from './components/CameraPlayer';
import useJoystickControls from './hooks/useJoystickControls';
import MobileJoysticks from './components/MobileJoysticks';

useGLTF.preload('/table.glb');
useGLTF.preload('/sculpture.glb');

function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const { moveJoystick, lookJoystick } = useJoystickControls();

  // Detect mobile and fix vh for iOS Safari
  useEffect(() => {
    // Check if on mobile
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobile);

    // Fix for iOS Safari 100vh issue
    const setVhProperty = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVhProperty();
    window.addEventListener('resize', setVhProperty);

    // Hide instructions after 5 seconds
    if (mobile) {
      const timer = setTimeout(() => setShowInstructions(false), 5000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', setVhProperty);
      };
    }

    return () => window.removeEventListener('resize', setVhProperty);
  }, []);

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
    <div
      style={{ position: 'relative', width: '100%', height: '100%' }}
      className="full-height"
    >
      {/* Mobile instructions */}
      {isMobile && (
        <div
          className={`mobile-instructions ${!showInstructions ? 'hidden' : ''}`}
        >
          <p>Use left side of screen to move</p>
          <p>Use right side of screen to look around</p>
        </div>
      )}

      {/* Show joystick UI (outside of Canvas) */}
      {isMobile && (
        <MobileJoysticks
          moveJoystick={moveJoystick}
          lookJoystick={lookJoystick}
        />
      )}

      {/* Only show crosshair on desktop */}
      {!isMobile && (
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
      )}

      <Canvas
        style={{
          height: '100vh',
          width: '100vw',
          touchAction: 'none', // Prevent scroll/zoom on mobile
        }}
        shadows
        camera={{ position: [0, 1, 5], fov: 60 }}
        // Add mobile-friendly options
        onCreated={({ gl }) => {
          if (isMobile) {
            // Disable context menu on right-click/long-press
            gl.domElement.addEventListener('contextmenu', (e) =>
              e.preventDefault()
            );
          }
        }}
      >
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
          <Ground />

          <Suspense fallback={null}>
            <ModelLoader>
              <OptimizedScene frustumCulling={true}>
                {/* Close objects with full detail and shadows */}
                <Model path="/table.glb" enableShadows={true} />

                {/* Orb light hovering above the table */}
                <OrbLight
                  position={[0, 2.5, -10]}
                  color="#ffffff"
                  intensity={10.0}
                  size={0.4}
                  amplitude={1}
                  speed={0.8}
                  phaseOffset={1}
                />
                <OrbLight
                  position={[0, 2.5, -8]}
                  color="#ffffff"
                  intensity={10.0}
                  size={0.4}
                  amplitude={1}
                  speed={0.8}
                  phaseOffset={2}
                />
                <OrbLight
                  position={[0, 2.5, -6]}
                  color="#ffffff"
                  intensity={10.0}
                  size={0.4}
                  amplitude={1}
                  speed={0.8}
                  phaseOffset={3}
                />
                <OrbLight
                  position={[0, 2.5, -4]}
                  color="#ffffff"
                  intensity={10.0}
                  size={0.4}
                  amplitude={1}
                  speed={0.8}
                  phaseOffset={4}
                />
                <OrbLight
                  position={[0, 2.5, -2]}
                  color="#ffffff"
                  intensity={10.0}
                  size={0.4}
                  amplitude={1}
                  speed={0.8}
                  phaseOffset={5}
                />

                <Model
                  path="/sculpture.glb"
                  position={new THREE.Vector3(-5, 0, -7)}
                  scale={0.3}
                  enableShadows={true}
                />

                <Model
                  path="/sculpture.glb"
                  position={new THREE.Vector3(5, 0, -7)}
                  scale={0.3}
                  enableShadows={true}
                />

                <Model
                  path="/sculpture.glb"
                  position={new THREE.Vector3(0, 0, -12)}
                  scale={0.4}
                  enableShadows={true}
                />

                <Model
                  path="/sculpture.glb"
                  position={new THREE.Vector3(-7, 0, -15)}
                  scale={0.25}
                  enableShadows={false}
                />

                <Model
                  path="/sculpture.glb"
                  position={new THREE.Vector3(7, 0, -15)}
                  scale={0.25}
                  enableShadows={false}
                />

                {/* <RigidBody type="fixed" colliders="trimesh">
                  <Model
                    path="/maze.glb"
                    position={new THREE.Vector3(15, 0, -10)}
                    scale={1}
                    enableShadows={false}
                  />
                </RigidBody> */}

                <Model
                  path="/object-e.glb"
                  position={new THREE.Vector3(25, 3, 10)}
                  scale={1}
                  enableShadows={false}
                />

                <Model
                  path="/object-n.glb"
                  position={new THREE.Vector3(7, 0, -15)}
                  scale={0.25}
                  enableShadows={false}
                />

                <VideoTexture
                  url="/flower_video.mov"
                  position={[5, 4, -10]}
                  rotation={[0, -Math.PI / 4, 0]}
                  scale={[0.5, 0.5, 0.5]}
                />

                {/* Safari will automatically try to use .mp4 version */}
                <VideoTexture
                  url="/fire.mov"
                  position={[0, 2, -12]}
                  rotation={[0, 0, Math.PI / 2]}
                  scale={[0.2, 0.2, 0.25]}
                />
              </OptimizedScene>
            </ModelLoader>
          </Suspense>
          <CameraPlayer />

          {/* Optional fog for depth */}
          <fog attach="fog" args={['#000', 10, 20]} />
        </Physics>
      </Canvas>
    </div>
  );
}

export default App;
