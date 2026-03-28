import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import { createUser } from '../api/endpoints';
import './OnboardingStep3.css';

export default function OnboardingStep3() {
  const navigate = useNavigate();
  const userStore = useUserStore();

  const [selectedCuisines, setSelectedCuisines] = useState(userStore.cuisines || []);
  const [selectedDietary, setSelectedDietary] = useState(userStore.dietary || []);
  const [budgetPreset, setBudgetPreset] = useState(null);
  const [budgetCustom, setBudgetCustom] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const cuisines = [
    { id: 'mexican', emoji: '🇲🇽', label: 'Mexican' },
    { id: 'korean', emoji: '🇰🇷', label: 'Korean' },
    { id: 'italian', emoji: '🇮🇹', label: 'Italian' },
    { id: 'indian', emoji: '🇮🇳', label: 'Indian' },
    { id: 'west_african', emoji: '🌍', label: 'West African' },
    { id: 'japanese', emoji: '🇯🇵', label: 'Japanese' },
    { id: 'french', emoji: '🇫🇷', label: 'French' },
    { id: 'greek', emoji: '🇬🇷', label: 'Greek' },
    { id: 'thai', emoji: '🇹🇭', label: 'Thai' },
  ];

  const dietary = [
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten_free', label: 'Gluten-Free' },
    { id: 'halal', label: 'Halal' },
    { id: 'kosher', label: 'Kosher' },
    { id: 'dairy_free', label: 'Dairy-Free' },
  ];

  const budgetPresets = [
    { id: 'low', label: '💰 Low (<$50)' },
    { id: 'medium', label: '💰💰 Medium ($50–$100)' },
    { id: 'high', label: '💰💰💰 High ($100+)' },
  ];

  // Sync to store
  useEffect(() => {
    userStore.setCuisines(selectedCuisines);
  }, [selectedCuisines]);

  useEffect(() => {
    userStore.setDietary(selectedDietary);
  }, [selectedDietary]);

  useEffect(() => {
    if (budgetPreset) {
      userStore.setBudget(budgetPreset);
    } else if (budgetCustom) {
      userStore.setBudget(`$${budgetCustom}`);
    }
  }, [budgetPreset, budgetCustom]);

  const handleCuisineToggle = (cuisineId) => {
    if (selectedCuisines.includes(cuisineId)) {
      setSelectedCuisines(selectedCuisines.filter((c) => c !== cuisineId));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisineId]);
    }
  };

  const handleDietaryToggle = (dietaryId) => {
    if (selectedDietary.includes(dietaryId)) {
      setSelectedDietary(selectedDietary.filter((d) => d !== dietaryId));
    } else {
      setSelectedDietary([...selectedDietary, dietaryId]);
    }
  };

  const handleBudgetPresetClick = (presetId) => {
    setBudgetPreset(presetId);
    setBudgetCustom('');
  };

  const handleCustomBudgetChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setBudgetCustom(value);
    if (value) {
      setBudgetPreset(null);
    }
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setError(null);

    // Save remaining store values
    userStore.setCuisines(selectedCuisines);
    userStore.setDietary(selectedDietary);
    if (budgetPreset) {
      userStore.setBudget(budgetPreset);
    } else if (budgetCustom) {
      userStore.setBudget(`${budgetCustom}`);
    }

    // Build profile object
    const profile = {
      ingredients: userStore.ingredients,
      height: Number(userStore.height),
      weight: Number(userStore.weight),
      age: Number(userStore.age),
      sex: userStore.sex,
      activity_level: userStore.activityLevel,
      goal: userStore.goal,
      dietary: selectedDietary,
      cuisines: selectedCuisines,
      budget: budgetPreset || (budgetCustom ? `${budgetCustom}` : ''),
      equipment: userStore.equipment
    };

    try {
      const data = await createUser(profile);
      userStore.setSessionToken(data.session_token);
      userStore.setUserId(data.user_id);
      navigate('/results');
    } catch (err) {
      console.error('Failed to create user profile:', err);
      setError("Couldn't create your profile. Check your connection and try again.");
      setIsLoading(false);
    }
  };

  const canProceed = selectedCuisines.length > 0;

  return (
    <div className="onboarding-container">
      <div className="botanical-background"></div>

      <div className="onboarding-card onboarding-card-step3">
        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className="progress-text">Step 3 of 3</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Page Title */}
        <h1 className="onboarding-title">Almost there — your preferences</h1>

        {/* Section 1: Cuisine Preferences */}
        <div className="section">
          <label className="section-label">Cuisine Preferences</label>
          <div className="cuisine-grid">
            {cuisines.map((cuisine) => (
              <div
                key={cuisine.id}
                className={`cuisine-tile ${selectedCuisines.includes(cuisine.id) ? 'selected' : ''}`}
                onClick={() => handleCuisineToggle(cuisine.id)}
              >
                <div className="cuisine-emoji">{cuisine.emoji}</div>
                <div className="cuisine-label">{cuisine.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Dietary Restrictions */}
        <div className="section">
          <label className="section-label">Dietary Restrictions</label>
          <div className="dietary-pills">
            {dietary.map((item) => (
              <div
                key={item.id}
                className={`dietary-pill ${selectedDietary.includes(item.id) ? 'selected' : ''}`}
                onClick={() => handleDietaryToggle(item.id)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Budget */}
        <div className="section">
          <label className="section-label">Weekly Grocery Budget</label>
          <div className="budget-row">
            {budgetPresets.map((preset) => (
              <div
                key={preset.id}
                className={`budget-pill ${budgetPreset === preset.id ? 'selected' : ''}`}
                onClick={() => handleBudgetPresetClick(preset.id)}
              >
                {preset.label}
              </div>
            ))}
            <input
              type="text"
              className="budget-custom-input"
              placeholder="$"
              value={budgetCustom}
              onChange={handleCustomBudgetChange}
            />
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {/* Bottom Bar */}
        <button
          className="next-button"
          onClick={handleGeneratePlan}
          disabled={!canProceed || isLoading}
        >
          {isLoading ? (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
                className="button-spinner"
                style={{ display: 'inline-block', marginRight: '8px' }}
              >
                <path
                  d="M20 5 Q30 15 20 35 Q10 15 20 5Z"
                  fill="var(--cream)"
                />
              </svg>
              Creating your plan...
            </>
          ) : (
            'Generate My Plan →'
          )}
        </button>
      </div>
    </div>
  );
}
