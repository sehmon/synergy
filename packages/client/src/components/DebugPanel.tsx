// components/DebugPanel.tsx
import useSocketEvents from '../hooks/useSocketEvents';

export default function DebugPanel() {
  const { sliderValue, isConnected, fooEvents } = useSocketEvents();

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
