import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import './OnboardingStep1.css';

export default function OnboardingStep1() {
  const navigate = useNavigate();
  const setIngredients = useUserStore((state) => state.setIngredients);

  const [activeTab, setActiveTab] = useState('photo');
  const [typeIngredients, setTypeIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAddIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !typeIngredients.includes(trimmed)) {
      setTypeIngredients([...typeIngredients, trimmed]);
      setInputValue('');
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    setTypeIngredients(typeIngredients.filter((i) => i !== ingredient));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddIngredient();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setAnalyzing(true);

    // Simulate analysis - in Phase 5 this will be real OCR/vision
    setTimeout(() => {
      setTypeIngredients(['eggs', 'milk', 'spinach', 'cheddar cheese', 'tomatoes']);
      setAnalyzing(false);
    }, 2000);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleNext = () => {
    setIngredients(typeIngredients);
    navigate('/onboarding/2');
  };

  const currentIngredients = activeTab === 'photo' ? typeIngredients : typeIngredients;
  const canProceed = currentIngredients.length >= 1;

  return (
    <div className="onboarding-container">
      <div className="botanical-background"></div>

      <div className="onboarding-card">
        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className="progress-text">Step 1 of 3</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '33%' }}></div>
          </div>
        </div>

        {/* Page Title */}
        <h1 className="onboarding-title">What's in your fridge?</h1>

        {/* Tab Switcher */}
        <div className="tab-switcher">
          <button
            className={`tab ${activeTab === 'photo' ? 'active' : ''}`}
            onClick={() => setActiveTab('photo')}
          >
            📷 Photo
          </button>
          <button
            className={`tab ${activeTab === 'type' ? 'active' : ''}`}
            onClick={() => setActiveTab('type')}
          >
            ✏️ Type
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'photo' ? (
            <div className="photo-tab">
              <div
                className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
              >
                {!previewUrl ? (
                  <>
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 5 Q30 15 20 35 Q10 15 20 5Z"
                        fill="var(--green-mid)"
                      />
                    </svg>
                    <p className="drop-text">Drop a fridge photo here</p>
                    <p className="drop-subtext">or click to browse</p>
                  </>
                ) : (
                  <div className="preview-container">
                    <img src={previewUrl} alt="Preview" className="preview-image" />
                    {analyzing && (
                      <div className="analyzing-text">
                        <span className="pulse-dot"></span>
                        Analyzing fridge...
                      </div>
                    )}
                  </div>
                )}
              </div>
              <input
                id="file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="type-tab">
              <div className="input-row">
                <input
                  type="text"
                  className="ingredient-input"
                  placeholder="e.g. eggs, spinach, cheddar"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className="add-button" onClick={handleAddIngredient}>
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Ingredient Chips */}
          {currentIngredients.length > 0 && (
            <div className="ingredient-chips">
              {currentIngredients.map((ingredient) => (
                <div key={ingredient} className="ingredient-chip">
                  {ingredient}
                  <button
                    className="remove-chip"
                    onClick={() => handleRemoveIngredient(ingredient)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <button
          className="next-button"
          onClick={handleNext}
          disabled={!canProceed}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
