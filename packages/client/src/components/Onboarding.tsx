import { useState, useEffect } from 'react';
import onboardingImage1 from '../assets/frame1.png';
import onboardingImage2 from '../assets/frame2.png';

type OnboardingProps = {
  onOnboardingComplete: () => void;
};

type OnboardingImageStepProps = {
  image: string;
  nextStep: number;
  isMobile: boolean;
  onNext: () => void;
};

function OnboardingImageStep({
  image,
  isMobile,
  onNext,
}: OnboardingImageStepProps) {
  return (
    <div
      onClick={onNext}
      onTouchStart={onNext}
      style={{
        cursor: 'pointer',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        width: '100vw',
        height: '100vh',
        position: 'relative',
      }}
    >
      <img
        src={image}
        style={{
          width: '100vw',
          height: '100vh',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        alt="Onboarding step"
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
}

function Onboarding({ onOnboardingComplete }: OnboardingProps) {
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

  const onboardingStep3 = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
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
          <div
            style={{
              color: 'white',
              marginTop: '30px',
              textAlign: 'center',
              padding: '0 20px',
            }}
          >
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>
              MOBILE CONTROLS:
            </p>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>
              • Use LEFT side of screen to MOVE
            </p>
            <p style={{ fontSize: '16px' }}>• Use RIGHT side to LOOK around</p>
          </div>
        )}
      </div>
    );
  };

  const renderOnboardingStep = () => {
    switch (onboardingStep) {
      case 1:
        return (
          <OnboardingImageStep
            image={onboardingImage1}
            nextStep={2}
            isMobile={isMobile}
            onNext={() => handleInteraction(2)}
          />
        );
      case 2:
        return (
          <OnboardingImageStep
            image={onboardingImage2}
            nextStep={3}
            isMobile={isMobile}
            onNext={() => handleInteraction(3)}
          />
        );
      case 3:
        return onboardingStep3();
      default:
        return null;
    }
  };

  return renderOnboardingStep();
}

export default Onboarding;
