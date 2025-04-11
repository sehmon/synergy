import { useState, useEffect } from 'react';
import onboardingImage1 from '../assets/frame1.png';
import onboardingImage2 from '../assets/frame2.png';

function Onboarding({
  onOnboardingComplete,
}: {
  onOnboardingComplete: () => void;
}) {
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Detect if user is on mobile
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);
  
  // Handle all touch/click events in one function
  const handleInteraction = (nextStep: number) => {
    if (nextStep === 4) {
      // Complete onboarding
      onOnboardingComplete();
    } else {
      // Go to next step
      setOnboardingStep(nextStep);
    }
  };

  const onboardingStep1 = () => {
    return (
      <div 
        onClick={() => handleInteraction(2)}
        onTouchStart={() => handleInteraction(2)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <img
          src={onboardingImage1}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          alt="Onboarding step 1"
          draggable="false"
        />
        
        {/* Overlay button to ensure touchability */}
        <div 
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '15px 30px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: 10,
          }}
        >
          {isMobile ? 'TAP TO CONTINUE' : 'CLICK TO CONTINUE'}
        </div>
      </div>
    );
  };

  const onboardingStep2 = () => {
    return (
      <div
        onClick={() => handleInteraction(3)}
        onTouchStart={() => handleInteraction(3)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <img
          src={onboardingImage2}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          alt="Onboarding step 2"
          draggable="false"
        />
        
        {/* Overlay button to ensure touchability */}
        <div 
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '15px 30px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: 10,
          }}
        >
          {isMobile ? 'TAP TO CONTINUE' : 'CLICK TO CONTINUE'}
        </div>
      </div>
    );
  };

  const onboardingStep3 = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100%',
          background: 'black',
          touchAction: 'manipulation',
        }}
      >
        <h1 style={{ color: 'white', textAlign: 'center' }}>s-y-n-e-r-g-y</h1>
        <div
          style={{
            fontSize: '24px',
            textAlign: 'center',
            color: '#eee',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            padding: '20px 40px',
            marginTop: '20px',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          onClick={() => handleInteraction(4)}
          onTouchStart={() => handleInteraction(4)}
        >
          {isMobile ? 'TAP TO BEGIN' : 'CLICK TO BEGIN'}
        </div>
        
        {isMobile && (
          <div style={{ 
            color: 'white', 
            marginTop: '30px', 
            textAlign: 'center',
            padding: '0 20px',
          }}>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>MOBILE CONTROLS:</p>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>• Use LEFT side of screen to MOVE</p>
            <p style={{ fontSize: '16px' }}>• Use RIGHT side to LOOK around</p>
          </div>
        )}
      </div>
    );
  };

  const onboardingSection = () => {
    switch (onboardingStep) {
      case 1:
        return onboardingStep1();
      case 2:
        return onboardingStep2();
      case 3:
        return onboardingStep3();
      default:
        return;
    }
  };

  return onboardingSection();
}

export default Onboarding;
