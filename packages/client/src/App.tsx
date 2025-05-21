import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import './App.css';
import './mobileControls.css';
import Onboarding from './components/Onboarding';
import useJoystickControls from './hooks/useJoystickControls';
import MobileJoysticks from './components/MobileJoysticks';
import DebugPanel from './components/DebugPanel';
import { SCENE_KEY, sceneMap } from './config/sceneConfig';
import { useSetAtom } from 'jotai';
import { initialPositionAtom, initialCameraAngleAtom } from './state/position';

const currentSceneKey: SCENE_KEY = 'SYNERGY';
const SceneComponent = sceneMap[currentSceneKey].component;
const initialPosition = sceneMap[currentSceneKey].initialPosition;
const initialCameraAngle = sceneMap[currentSceneKey].initialCameraAngle;

function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const { moveJoystick, lookJoystick } = useJoystickControls();

  const setInitialPosition = useSetAtom(initialPositionAtom);
  const setInitialCameraAngle = useSetAtom(initialCameraAngleAtom);

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

  useEffect(() => {
    setInitialPosition(initialPosition);
    if (initialCameraAngle) setInitialCameraAngle(initialCameraAngle);
  }, [setInitialPosition, setInitialCameraAngle]);

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
        camera={{ position: initialPosition, fov: 60 }}
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
        <SceneComponent />
      </Canvas>
      <DebugPanel />
    </div>
  );
}

export default App;
