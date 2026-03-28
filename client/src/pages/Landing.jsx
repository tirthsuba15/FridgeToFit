import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div className="landing-container">
      {/* Botanical Background */}
      <div className="botanical-background"></div>

      {/* Main Content */}
      <div className={`landing-content ${fadeIn ? 'fade-in' : ''}`}>
        <h1 className="landing-title">What's in your fridge?</h1>
        <p className="landing-subtitle">
          Turn your ingredients into a full week of meals and workouts.
        </p>
        <button 
          className="landing-cta"
          onClick={() => navigate('/onboarding/1')}
        >
          Let's get cooking →
        </button>
      </div>
    </div>
  );
}
