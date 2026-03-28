import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import './OnboardingStep2.css';

export default function OnboardingStep2() {
  const navigate = useNavigate();
  const userStore = useUserStore();

  const [height, setHeight] = useState(userStore.height || '');
  const [weight, setWeight] = useState(userStore.weight || '');
  const [age, setAge] = useState(userStore.age || '');
  const [sex, setSex] = useState(userStore.sex || 'male');
  const [activityLevel, setActivityLevel] = useState(3);
  const [selectedGoal, setSelectedGoal] = useState(userStore.goal || '');
  const [selectedEquipment, setSelectedEquipment] = useState(userStore.equipment || []);
  const [tdee, setTdee] = useState(null);

  const activityLabels = ['Sedentary', 'Lightly Active', 'Moderate', 'Active', 'Very Active'];
  const activityMultipliers = [1.2, 1.375, 1.55, 1.725, 1.9];

  const goals = [
    { id: 'bulk', emoji: '🔥', label: 'Bulk' },
    { id: 'cut', emoji: '✂️', label: 'Cut' },
    { id: 'maintain', emoji: '⚖️', label: 'Maintain' },
    { id: 'athletic', emoji: '🏃', label: 'Athletic' },
  ];

  const equipment = [
    { id: 'dumbbells', emoji: '🏋️', label: 'Dumbbells' },
    { id: 'barbell', emoji: '🏗️', label: 'Barbell' },
    { id: 'resistance_bands', emoji: '🔗', label: 'Resistance Bands' },
    { id: 'full_gym', emoji: '🏢', label: 'Full Gym' },
    { id: 'bodyweight_only', emoji: '🤸', label: 'Bodyweight Only' },
  ];

  // Calculate TDEE
  useEffect(() => {
    if (height && weight && age && sex) {
      const h = parseFloat(height);
      const w = parseFloat(weight);
      const a = parseFloat(age);

      let bmr;
      if (sex === 'male') {
        bmr = 10 * w + 6.25 * h - 5 * a + 5;
      } else if (sex === 'female') {
        bmr = 10 * w + 6.25 * h - 5 * a - 161;
      } else {
        const maleBmr = 10 * w + 6.25 * h - 5 * a + 5;
        const femaleBmr = 10 * w + 6.25 * h - 5 * a - 161;
        bmr = (maleBmr + femaleBmr) / 2;
      }

      const multiplier = activityMultipliers[activityLevel - 1];
      const calculatedTdee = Math.round(bmr * multiplier);
      setTdee(calculatedTdee);
    } else {
      setTdee(null);
    }
  }, [height, weight, age, sex, activityLevel]);

  // Sync to store
  useEffect(() => {
    if (height) userStore.setHeight(height);
  }, [height]);

  useEffect(() => {
    if (weight) userStore.setWeight(weight);
  }, [weight]);

  useEffect(() => {
    if (age) userStore.setAge(age);
  }, [age]);

  useEffect(() => {
    userStore.setSex(sex);
  }, [sex]);

  useEffect(() => {
    const levels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
    userStore.setActivityLevel(levels[activityLevel - 1]);
  }, [activityLevel]);

  useEffect(() => {
    if (selectedGoal) userStore.setGoal(selectedGoal);
  }, [selectedGoal]);

  useEffect(() => {
    userStore.setEquipment(selectedEquipment);
  }, [selectedEquipment]);

  const handleGoalSelect = (goalId) => {
    setSelectedGoal(goalId);
  };

  const handleEquipmentToggle = (equipmentId) => {
    if (equipmentId === 'bodyweight_only') {
      // If bodyweight only is selected, deselect all others
      setSelectedEquipment(['bodyweight_only']);
    } else {
      // If any other is selected, remove bodyweight_only if present
      let newEquipment = selectedEquipment.filter((e) => e !== 'bodyweight_only');
      
      if (newEquipment.includes(equipmentId)) {
        // Remove if already selected
        newEquipment = newEquipment.filter((e) => e !== equipmentId);
      } else {
        // Add if not selected
        newEquipment = [...newEquipment, equipmentId];
      }
      
      setSelectedEquipment(newEquipment);
    }
  };

  const handleNext = () => {
    navigate('/onboarding/3');
  };

  return (
    <div className="onboarding-container">
      <div className="botanical-background"></div>

      <div className="onboarding-card onboarding-card-wide">
        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className="progress-text">Step 2 of 3</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '66%' }}></div>
          </div>
        </div>

        {/* Page Title */}
        <h1 className="onboarding-title">Tell us about yourself</h1>

        {/* Section 1: Body Stats */}
        <div className="section">
          <div className="stats-grid">
            <div className="input-group">
              <label>Height (cm)</label>
              <input
                type="number"
                className="stat-input"
                min="100"
                max="250"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="170"
              />
            </div>
            <div className="input-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                className="stat-input"
                min="30"
                max="300"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
              />
            </div>
            <div className="input-group">
              <label>Age</label>
              <input
                type="number"
                className="stat-input"
                min="10"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
              />
            </div>
            <div className="input-group">
              <label>Sex</label>
              <select
                className="stat-input"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Activity Level */}
        <div className="section">
          <label className="section-label">Activity Level</label>
          <input
            type="range"
            className="activity-slider"
            min="1"
            max="5"
            step="1"
            value={activityLevel}
            onChange={(e) => setActivityLevel(parseInt(e.target.value))}
          />
          <div className="activity-labels">
            {activityLabels.map((label, index) => (
              <span
                key={index}
                className={`activity-label ${activityLevel === index + 1 ? 'active' : ''}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Section 3: Goal */}
        <div className="section">
          <label className="section-label">Goal</label>
          <div className="goal-grid">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={`goal-card ${selectedGoal === goal.id ? 'selected' : ''}`}
                onClick={() => handleGoalSelect(goal.id)}
              >
                <div className="goal-emoji">{goal.emoji}</div>
                <div className="goal-label">{goal.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Equipment */}
        <div className="section">
          <label className="section-label">Available Equipment</label>
          <p className="section-subtext">Select all that apply</p>
          <div className="equipment-grid">
            {equipment.map((item) => (
              <div
                key={item.id}
                className={`equipment-tile ${selectedEquipment.includes(item.id) ? 'selected' : ''}`}
                onClick={() => handleEquipmentToggle(item.id)}
              >
                <div className="equipment-emoji">{item.emoji}</div>
                <div className="equipment-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: TDEE Estimate */}
        <div className="section tdee-section">
          <label className="section-label">Estimated Daily Calories</label>
          <div className="tdee-value">
            {tdee !== null ? `${tdee.toLocaleString()} kcal` : '— kcal'}
          </div>
          <p className="tdee-subtext">This estimate helps us size your meal plan.</p>
        </div>

        {/* Bottom Bar */}
        <button className="next-button" onClick={handleNext}>
          Next →
        </button>
      </div>
    </div>
  );
}
