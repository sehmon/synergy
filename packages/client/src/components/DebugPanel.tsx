// components/DebugPanel.tsx
import { useState } from 'react';
import useSocketEvents from '../hooks/useSocketEvents';

// Get player component
declare global {
  interface Window {
    toggleTrail?: () => void;
  }
}

export default function DebugPanel() {
  const { sliderValue, isConnected, fooEvents } = useSocketEvents();
  const [trailVisible, setTrailVisible] = useState(true);

  // Toggle trail visibility by toggling state in CameraPlayer
  const toggleTrail = () => {
    if (typeof window.toggleTrail === 'function') {
      window.toggleTrail();
      setTrailVisible(prev => !prev);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '10px',
        color: 'white',
        fontSize: '12px',
        maxWidth: '300px',
        zIndex: 1000,
      }}
    >
      <p>Socket Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <p>Slider Value: {sliderValue ?? 'Loading...'}</p>
      <div style={{ marginTop: '8px', marginBottom: '8px' }}>
        <button 
          onClick={toggleTrail}
          style={{
            background: trailVisible ? 'green' : 'red',
            border: 'none',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {trailVisible ? 'Hide Trail' : 'Show Trail'}
        </button>
      </div>
      <p>Events:</p>
      <ul>
        {fooEvents.slice(-5).map((event, idx) => (
          <li key={idx}>{JSON.stringify(event)}</li>
        ))}
      </ul>
    </div>
  );
}
