// hooks/useSocketEvents.ts
import { useEffect, useState } from 'react';
import { socket } from '../socket';

export default function useSocketEvents() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<any[]>([]);
  const [sliderValue, setSliderValue] = useState<number | null>(null);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleFoo = (value: any) =>
      setFooEvents((prev) => [...prev, value]);
    const handleSliderUpdate = (value: number) => setSliderValue(value);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('foo', handleFoo);
    socket.on('slider-update', handleSliderUpdate);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('foo', handleFoo);
      socket.off('slider-update', handleSliderUpdate);
    };
  }, []);

  return { isConnected, fooEvents, sliderValue };
}
