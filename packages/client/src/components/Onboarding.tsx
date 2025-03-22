import { useState } from 'react';
import onboardingImage1 from '../assets/frame1.png';
import onboardingImage2 from '../assets/frame2.png';

function Onboarding({
  onOnboardingComplete,
}: {
  onOnboardingComplete: () => void;
}) {
  const [onboardingStep, setOnboardingStep] = useState(1);

  const onboardingStep1 = () => {
    return (
      <a onClick={() => setOnboardingStep(2)}>
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
          }}
        />
      </a>
    );
  };

  const onboardingStep2 = () => {
    return (
      <a onClick={() => setOnboardingStep(3)}>
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
          }}
        />
      </a>
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
        }}
      >
        <h1 style={{ color: 'white', textAlign: 'center' }}>s-y-n-e-r-g-y</h1>
        <a
          style={{
            fontSize: '24px',
            textAlign: 'center',
            color: '#eee',
            cursor: 'pointer',
          }}
          onClick={() => onOnboardingComplete()}
        >
          Click to Begin
        </a>
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
