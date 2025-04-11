import { useEffect, useState, useCallback } from 'react';

type JoystickState = {
  forward: number; // -1 to 1 (backward to forward)
  right: number;   // -1 to 1 (left to right)
};

type TouchJoystick = {
  active: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
};

export default function useJoystickControls() {
  // Initialize with no movement
  const [moveJoystick, setMoveJoystick] = useState<TouchJoystick>({
    active: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  const [lookJoystick, setLookJoystick] = useState<TouchJoystick>({
    active: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  const [joystickState, setJoystickState] = useState<JoystickState>({
    forward: 0,
    right: 0,
  });
  
  // Add rotation state to track camera rotation
  const [rotationState, setRotationState] = useState({
    rotateX: 0,
    rotateY: 0,
  });

  // Determine if a touch is on the left or right half of the screen
  const isLeftSide = useCallback((x: number) => {
    return x < window.innerWidth / 2;
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Prevent default behavior to avoid scrolling
    e.preventDefault();
    
    Array.from(e.touches).forEach(touch => {
      const x = touch.clientX;
      const y = touch.clientY;
      
      if (isLeftSide(x)) {
        // Movement joystick (left side)
        setMoveJoystick({
          active: true,
          startX: x,
          startY: y,
          currentX: x,
          currentY: y,
        });
      } else {
        // Look joystick (right side)
        setLookJoystick({
          active: true,
          startX: x,
          startY: y,
          currentX: x,
          currentY: y,
        });
      }
    });
  }, [isLeftSide]);

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    Array.from(e.touches).forEach(touch => {
      const x = touch.clientX;
      const y = touch.clientY;
      
      // Find if this touch is updating the left or right joystick
      if (isLeftSide(touch.clientX)) {
        if (moveJoystick.active) {
          setMoveJoystick(prev => ({
            ...prev,
            currentX: x,
            currentY: y,
          }));
        }
      } else {
        if (lookJoystick.active) {
          setLookJoystick(prev => ({
            ...prev,
            currentX: x,
            currentY: y,
          }));
        }
      }
    });
  }, [isLeftSide, moveJoystick.active, lookJoystick.active]);

  // Handle touch end
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    // Check which sides of the screen still have active touches
    const leftSideActive = Array.from(e.touches).some(touch => isLeftSide(touch.clientX));
    const rightSideActive = Array.from(e.touches).some(touch => !isLeftSide(touch.clientX));
    
    // If no touches on left side, reset move joystick
    if (!leftSideActive) {
      setMoveJoystick(prev => ({
        ...prev,
        active: false,
        currentX: prev.startX,
        currentY: prev.startY,
      }));
    }
    
    // If no touches on right side, reset look joystick
    if (!rightSideActive) {
      setLookJoystick(prev => ({
        ...prev,
        active: false,
        currentX: prev.startX,
        currentY: prev.startY,
      }));
    }
  }, [isLeftSide]);

  // Update joystick values
  useEffect(() => {
    if (moveJoystick.active) {
      // Calculate movement values (normalized -1 to 1)
      const maxDistance = 50; // Max distance in pixels
      const dx = moveJoystick.currentX - moveJoystick.startX;
      const dy = moveJoystick.currentY - moveJoystick.startY;
      
      // Calculate movement direction and intensity
      // Note: y is inverted (negative y is forward)
      const forward = Math.max(-1, Math.min(1, -dy / maxDistance));
      // Fix: Invert the right direction to match the expected behavior in CameraPlayer
      const right = Math.max(-1, Math.min(1, -dx / maxDistance));
      
      setJoystickState({ forward, right });
    } else {
      // Reset to no movement when joystick is inactive
      setJoystickState({ forward: 0, right: 0 });
    }
  }, [moveJoystick]);

  // Set up touch event listeners
  useEffect(() => {
    // Only activate touch controls on mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.addEventListener('touchstart', handleTouchStart, { passive: false });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('touchcancel', handleTouchEnd);
      
      return () => {
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('touchcancel', handleTouchEnd);
      };
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Update camera rotation values based on the look joystick
  useEffect(() => {
    if (lookJoystick.active) {
      // Calculate how far the look joystick has moved from the center
      const maxDistance = 50;  // Max distance in pixels
      const dx = lookJoystick.currentX - lookJoystick.startX;
      
      // Convert to rotation speed (-1 to 1)
      const rotateY = Math.max(-1, Math.min(1, -dx / maxDistance));
      
      setRotationState({
        rotateX: 0, // Keep camera level (no vertical rotation)
        rotateY: rotateY,
      });
    } else {
      // Reset rotation when joystick released
      setRotationState({
        rotateX: 0,
        rotateY: 0,
      });
    }
  }, [lookJoystick]);

  return {
    joystickState,
    rotationState,
    moveJoystick,
    lookJoystick
  };
}