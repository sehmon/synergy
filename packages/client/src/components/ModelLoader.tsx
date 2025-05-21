import { useProgress, Html } from '@react-three/drei';
import { useEffect } from 'react';
import { DRACOLoader } from 'three/examples/jsm/Addons.js';

interface ModelLoaderProps {
  children: React.ReactNode;
}

function ModelLoader({ children }: ModelLoaderProps) {
  const { active, progress, errors, item } = useProgress();

  useEffect(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
    );
    dracoLoader.preload();
    return () => {
      dracoLoader.dispose();
    };
  }, []);

  useEffect(() => {
    if (errors.length > 0) {
      console.error('Error loading assets:', errors);
    }
  }, [errors]);

  if (active) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" wireframe />
        <Html
          position={[0, 1.5, 0]}
          center
          style={{ color: 'white', width: '100px', textAlign: 'center' }}
        >
          <div
            style={{
              background: 'rgba(0,0,0,0.7)',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '5px',
                background: 'white',
                marginBottom: '5px',
              }}
            />
            <div>{Math.round(progress)}%</div>
            <div style={{ fontSize: '10px' }}>{item}</div>
          </div>
        </Html>
      </mesh>
    );
  }

  return <>{children}</>;
}

export default ModelLoader;
