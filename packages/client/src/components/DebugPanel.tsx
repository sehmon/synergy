// components/DebugPanel.tsx
import { useEffect, useState } from 'react';

interface DebugPanelProps {
  isConnected: boolean;
  fooEvents: any[];
}

export default function DebugPanel({
  isConnected,
  fooEvents,
}: DebugPanelProps) {
  const [sliderValue, setSliderValue] = useState<number | null>(null);

  useEffect(() => {
    const fetchSliderValue = async () => {
      try {
        const res = await fetch('http://localhost:4000/slider');
        const data = await res.json();
        setSliderValue(data.value);
      } catch (err) {
        console.error('Error fetching slider:', err);
      }
    };

    fetchSliderValue();
    const interval = setInterval(fetchSliderValue, 2000); // Poll every 2s

    return () => clearInterval(interval);
  }, []);

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
      <p>Events:</p>
      <ul>
        {fooEvents.slice(-5).map((event, idx) => (
          <li key={idx}>{JSON.stringify(event)}</li>
        ))}
      </ul>
    </div>
  );
}
