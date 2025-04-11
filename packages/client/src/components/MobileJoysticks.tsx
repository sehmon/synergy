import { useEffect, useState } from 'react';

type JoystickProps = {
  moveJoystick: {
    active: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  };
  lookJoystick: {
    active: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  };
};

export default function MobileJoysticks({ moveJoystick, lookJoystick }: JoystickProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  // Add helper hint indicators for initial touch
  const [leftHintVisible, setLeftHintVisible] = useState(true);
  const [rightHintVisible, setRightHintVisible] = useState(true);
  
  useEffect(() => {
    // Only show joysticks on mobile devices
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    
    // Hide hints after 8 seconds
    const timer = setTimeout(() => {
      setLeftHintVisible(false);
      setRightHintVisible(false);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Hide hints when joystick is activated
  useEffect(() => {
    if (moveJoystick.active) {
      setLeftHintVisible(false);
    }
  }, [moveJoystick.active]);
  
  useEffect(() => {
    if (lookJoystick.active) {
      setRightHintVisible(false);
    }
  }, [lookJoystick.active]);

  if (!isMobile) return null;

  // Constrain the joystick thumb to a maximum distance from center
  const constrainJoystick = (start: {x: number, y: number}, current: {x: number, y: number}, maxDistance: number = 50) => {
    const dx = current.x - start.x;
    const dy = current.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= maxDistance) {
      return {x: current.x, y: current.y};
    }
    
    const ratio = maxDistance / distance;
    return {
      x: start.x + dx * ratio,
      y: start.y + dy * ratio
    };
  };
  
  // Calculate constrained positions
  const moveThumbPos = moveJoystick.active 
    ? constrainJoystick(
        {x: moveJoystick.startX, y: moveJoystick.startY}, 
        {x: moveJoystick.currentX, y: moveJoystick.currentY}
      )
    : {x: 0, y: 0};
    
  const lookThumbPos = lookJoystick.active 
    ? constrainJoystick(
        {x: lookJoystick.startX, y: lookJoystick.startY}, 
        {x: lookJoystick.currentX, y: lookJoystick.currentY}
      )
    : {x: 0, y: 0};

  return (
    <div className="joystick-container">
      {/* Left joystick hint */}
      {leftHintVisible && !moveJoystick.active && (
        <div style={{
          position: 'absolute',
          left: '25%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7,
        }}>
          <div>Move</div>
        </div>
      )}
      
      {/* Right joystick hint */}
      {rightHintVisible && !lookJoystick.active && (
        <div style={{
          position: 'absolute',
          left: '75%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7,
        }}>
          <div>Look</div>
        </div>
      )}
      
      {/* Left joystick (movement) */}
      {moveJoystick.active && (
        <>
          {/* Base circle */}
          <div className="joystick-base" style={{
            left: `${moveJoystick.startX - 35}px`,
            top: `${moveJoystick.startY - 35}px`,
          }} />
          
          {/* Thumb stick */}
          <div className="joystick-thumb" style={{
            left: `${moveThumbPos.x - 15}px`,
            top: `${moveThumbPos.y - 15}px`,
          }} />
        </>
      )}
      
      {/* Right joystick (look) */}
      {lookJoystick.active && (
        <>
          {/* Base circle */}
          <div className="joystick-base" style={{
            left: `${lookJoystick.startX - 35}px`,
            top: `${lookJoystick.startY - 35}px`,
          }} />
          
          {/* Thumb stick */}
          <div className="joystick-thumb" style={{
            left: `${lookThumbPos.x - 15}px`,
            top: `${lookThumbPos.y - 15}px`,
          }} />
        </>
      )}
    </div>
  );
}