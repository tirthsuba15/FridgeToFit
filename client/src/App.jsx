import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import OnboardingStep1 from './pages/OnboardingStep1';
import OnboardingStep2 from './pages/OnboardingStep2';
import OnboardingStep3 from './pages/OnboardingStep3';
import Results from './pages/Results';
import Grocery from './pages/Grocery';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding/1" element={<OnboardingStep1 />} />
        <Route path="/onboarding/2" element={<OnboardingStep2 />} />
        <Route path="/onboarding/3" element={<OnboardingStep3 />} />
        <Route path="/results" element={<Results />} />
        <Route path="/grocery" element={<Grocery />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
