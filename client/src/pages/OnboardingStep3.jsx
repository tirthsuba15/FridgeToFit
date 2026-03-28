import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import { createUser } from '../api/endpoints';

const EQUIPMENT_OPTIONS = [
  { id: 'dumbbells', label: 'Dumbbells' },
  { id: 'barbell', label: 'Barbell' },
  { id: 'resistance_bands', label: 'Resistance Bands' },
  { id: 'full_gym', label: 'Full Gym' },
  { id: 'bodyweight', label: 'Bodyweight Only' },
];

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
    { id: 'mexican', label: 'Mexican' },
    { id: 'korean', label: 'Korean' },
    { id: 'italian', label: 'Italian' },
    { id: 'indian', label: 'Indian' },
    { id: 'west_african', label: 'West African' },
    { id: 'japanese', label: 'Japanese' },
    { id: 'french', label: 'French' },
    { id: 'greek', label: 'Greek' },
    { id: 'thai', label: 'Thai' },
  ];

  const dietary = [
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten_free', label: 'Gluten-Free' },
    { id: 'halal', label: 'Halal' },
    { id: 'kosher', label: 'Kosher' },
    { id: 'dairy_free', label: 'Dairy-Free' },
  ];

  const budgetPresets = [
    { id: 'low', symbol: '$', sublabel: 'Minimal' },
    { id: 'medium', symbol: '$$', sublabel: 'Balanced' },
    { id: 'high', symbol: '$$$', sublabel: 'Premium' },
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

  const handleEquipmentToggle = (equipmentId) => {
    const current = userStore.equipment || [];
    if (current.includes(equipmentId)) {
      userStore.setEquipment(current.filter((e) => e !== equipmentId));
    } else {
      userStore.setEquipment([...current, equipmentId]);
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

    // Build profile object with backend-expected field names
    const session_token = crypto.randomUUID();
    const budgetNum =
      budgetPreset === 'low'
        ? 40
        : budgetPreset === 'medium'
        ? 75
        : budgetPreset === 'high'
        ? 120
        : Number(budgetCustom) || 75;
    const profile = {
      session_token,
      age: Number(userStore.age),
      sex: userStore.sex,
      weight_kg: Number(userStore.weight),
      height_cm: Number(userStore.height),
      goal: userStore.goal,
      activity_level: userStore.activityLevel,
      dietary_flags: JSON.stringify(selectedDietary),
      cuisine_prefs: JSON.stringify(selectedCuisines),
      weekly_budget_usd: budgetNum,
      equipment: JSON.stringify(userStore.equipment),
    };

    try {
      const data = await createUser(profile);
      userStore.setSessionToken(data.session_token || session_token);
      userStore.setUserId(data.id || data.user_id);
      navigate('/results');
    } catch (err) {
      console.error('Failed to create user profile:', err);
      setError("Couldn't create your profile. Check your connection and try again.");
      setIsLoading(false);
    }
  };

  const canProceed = selectedCuisines.length > 0;
  const selectedEquipment = userStore.equipment || [];

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col">
      <main className="flex-1 pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">

        {/* Onboarding Header */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-on-primary px-3 py-1">
              Step 02
            </span>
            <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-outline">
              Configuration
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-4 leading-none">
            Preferences.
          </h1>
          <p className="text-on-surface-variant max-w-xl text-lg font-light leading-relaxed">
            Defining your clinical profile. We calibrate your FridgeToFit experience based on
            regional tastes, biological constraints, and logistical capacity.
          </p>
        </header>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* LEFT: Cuisine Grid + Equipment */}
          <section className="lg:col-span-7 space-y-12">

            {/* 01. Global Palette */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-xs font-black uppercase tracking-[0.1em]">01. Global Palette</h2>
                <span className="text-[10px] font-mono text-outline italic">Select all that apply</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cuisines.map((cuisine) => {
                  const isSelected = selectedCuisines.includes(cuisine.id);
                  return (
                    <div
                      key={cuisine.id}
                      onClick={() => handleCuisineToggle(cuisine.id)}
                      className={[
                        'relative aspect-square overflow-hidden cursor-pointer transition-all duration-300',
                        isSelected
                          ? 'bg-surface-container-highest border-2 border-primary'
                          : 'bg-surface-container-low hover:bg-surface-container-highest',
                      ].join(' ')}
                    >
                      <div className="absolute inset-0 p-4 flex flex-col justify-between">
                        <span
                          className="material-symbols-outlined text-primary self-end"
                          style={
                            isSelected
                              ? { fontVariationSettings: "'FILL' 1" }
                              : { opacity: 0 }
                          }
                        >
                          check_circle
                        </span>
                        <span className="text-xs font-black uppercase tracking-widest">
                          {cuisine.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 02. Logistical Readiness */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.1em] mb-6">
                02. Logistical Readiness
              </h2>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT_OPTIONS.map((item) => {
                  const isSelected = selectedEquipment.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleEquipmentToggle(item.id)}
                      className={[
                        'px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all',
                        isSelected
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest',
                      ].join(' ')}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* RIGHT: Dietary + Budget + CTA */}
          <aside className="lg:col-span-5 space-y-16 lg:pl-12 lg:border-l border-outline-variant/10">

            {/* 03. Biological Filters */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.1em] mb-6">
                03. Biological Filters
              </h2>
              <div className="space-y-3">
                {dietary.map((item) => {
                  const isSelected = selectedDietary.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleDietaryToggle(item.id)}
                      className="flex items-center justify-between p-4 bg-surface-container-lowest border-b border-outline-variant/10 group cursor-pointer"
                    >
                      <span className="text-sm font-medium tracking-tight">{item.label}</span>
                      {isSelected ? (
                        <span
                          className="material-symbols-outlined text-primary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_box
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-outline group-hover:text-primary">
                          check_box_outline_blank
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 04. Resource Allocation */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.1em] mb-6">
                04. Resource Allocation
              </h2>
              <div className="grid grid-cols-3 gap-1 mb-6">
                {budgetPresets.map((preset) => {
                  const isSelected = budgetPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleBudgetPresetClick(preset.id)}
                      className={[
                        'flex flex-col items-center justify-center p-6 transition-all',
                        isSelected
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-lowest border border-outline-variant/20 hover:border-primary',
                      ].join(' ')}
                    >
                      <span className="text-lg font-black tracking-tighter mb-1">
                        {preset.symbol}
                      </span>
                      <span
                        className={[
                          'text-[8px] font-black uppercase tracking-widest',
                          isSelected ? 'opacity-60' : 'text-outline',
                        ].join(' ')}
                      >
                        {preset.sublabel}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom budget input */}
              <div className="relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline-variant absolute -top-2 left-4 bg-surface px-2 z-10">
                  Custom Weekly Cap
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 p-6 pt-8 text-xl font-black tracking-tighter focus:outline-none focus:ring-0 focus:border-primary uppercase placeholder:text-outline-variant"
                  placeholder="ENTER AMOUNT"
                  value={budgetCustom}
                  onChange={handleCustomBudgetChange}
                />
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-error-container text-on-error-container text-xs font-medium px-4 py-3 border border-error/20">
                {error}
              </div>
            )}

            {/* CTA */}
            <div className="pt-8">
              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={!canProceed || isLoading}
                className={[
                  'w-full group relative overflow-hidden bg-primary py-8 transition-all active:scale-[0.98]',
                  (!canProceed || isLoading) ? 'opacity-50 cursor-not-allowed' : '',
                ].join(' ')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10 text-on-primary font-black uppercase tracking-[0.4em] text-xs">
                  {isLoading ? 'Generating...' : 'Synchronize Profile'}
                </span>
              </button>
              <p className="text-center mt-6 text-[10px] font-medium text-outline uppercase tracking-widest">
                Verification required for clinical accuracy.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-50 border-t border-zinc-200/20 w-full py-12 px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 w-full max-w-screen-2xl mx-auto">
          <div className="space-y-4">
            <span className="font-black text-black text-sm tracking-tighter uppercase">
              FRIDGETOFIT
            </span>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.05em]">
              © 2024 FRIDGETOFIT. CLINICAL PRECISION.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <a className="text-zinc-500 text-[10px] uppercase tracking-[0.05em] hover:text-black underline transition-all cursor-pointer">
              Privacy
            </a>
            <a className="text-zinc-500 text-[10px] uppercase tracking-[0.05em] hover:text-black underline transition-all cursor-pointer">
              Terms
            </a>
            <a className="text-zinc-500 text-[10px] uppercase tracking-[0.05em] hover:text-black underline transition-all cursor-pointer">
              Clinical Standards
            </a>
            <a className="text-zinc-500 text-[10px] uppercase tracking-[0.05em] hover:text-black underline transition-all cursor-pointer">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
