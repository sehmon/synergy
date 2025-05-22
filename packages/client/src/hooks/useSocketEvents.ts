import { useEffect, useState } from 'react';
import { socket } from '../socket';

export default function useSocketEvents() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<any[]>([]);
  const MAX_FOO_EVENTS = 100;
  const [sliderValue, setSliderValue] = useState<number | null>(null);
  const [positions, setPositions] = useState<[number, number][]>([]);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      socket.emit('request-grid'); // Ask for grid when connected
    };

    const handleDisconnect = () => setIsConnected(false);
    const handleFoo = (value: any) =>
      setFooEvents(prev => [...prev, value].slice(-MAX_FOO_EVENTS));
    const handleSliderUpdate = (value: number) => setSliderValue(value);
    const handleGridUpdate = (data: [number, number][]) => setPositions(data);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('foo', handleFoo);
    socket.on('slider-update', handleSliderUpdate);
    socket.on('grid-update', handleGridUpdate); // Listen for grid

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('foo', handleFoo);
      socket.off('slider-update', handleSliderUpdate);
      socket.off('grid-update', handleGridUpdate);
    };
  }, []);

  return { isConnected, fooEvents, sliderValue, positions };
}
