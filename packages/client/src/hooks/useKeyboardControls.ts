import { useEffect, useState } from 'react';

type Controls = {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
};

export default function useKeyboardControls() {
  const [keys, setKeys] = useState<Controls>({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}
