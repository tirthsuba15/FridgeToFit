import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

const goalMeta = [
  {
    id: 'bulk',
    label: 'Bulk',
    code: 'OBJECTIVE_01',
    num: '01',
    description: 'Hypertrophy focused protocol. Caloric surplus with optimized protein synthesis signaling.',
  },
  {
    id: 'cut',
    label: 'Cut',
    code: 'OBJECTIVE_02',
    num: '02',
    description: 'Adipose tissue reduction while maintaining lean mass through cyclical deficit strategies.',
  },
  {
    id: 'maintain',
    label: 'Maintain',
    code: 'OBJECTIVE_03',
    num: '03',
    description: 'Homeostasis preservation. Matching energy expenditure with precision intake.',
  },
  {
    id: 'athletic',
    label: 'Athletic',
    code: 'OBJECTIVE_04',
    num: '04',
    description: 'Performance-first fueling. Nutrient timing designed for explosive output and recovery.',
  },
];

const equipmentOptions = [
  { id: 'dumbbells', label: 'Dumbbells' },
  { id: 'barbell', label: 'Barbell' },
  { id: 'resistance_bands', label: 'Resistance Bands' },
  { id: 'full_gym', label: 'Full Gym' },
  { id: 'bodyweight_only', label: 'Bodyweight Only' },
];

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
      setSelectedEquipment(['bodyweight_only']);
    } else {
      let newEquipment = selectedEquipment.filter((e) => e !== 'bodyweight_only');
      if (newEquipment.includes(equipmentId)) {
        newEquipment = newEquipment.filter((e) => e !== equipmentId);
      } else {
        newEquipment = [...newEquipment, equipmentId];
      }
      setSelectedEquipment(newEquipment);
    }
  };

  const handleNext = () => {
    navigate('/onboarding/3');
  };

  const inputClass =
    'w-full bg-surface-container-lowest border-0 border-b border-outline-variant/40 py-4 px-0 text-3xl font-light tracking-tight focus:ring-0 focus:border-primary transition-all placeholder:text-surface-container-highest outline-none';

  const labelClass = 'block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2';

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen">

      {/* Glassmorphism Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex justify-between items-center px-8 py-6">
        <div className="text-2xl font-black tracking-tighter uppercase text-black">FridgeToFit</div>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Step 01 / 03</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-32 px-8 max-w-screen-xl mx-auto">

        {/* Editorial Hero */}
        <section className="mb-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-secondary mb-4">
              Clinical Data Collection
            </p>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-primary uppercase">
              Body<br />Composition
            </h1>
          </div>
          <div className="md:col-span-4 pb-2">
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs">
              Precise biometric markers allow our algorithm to calculate metabolic baseline with 98.4% variance accuracy.
            </p>
          </div>
        </section>

        {/* Two-Column Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-5 space-y-12">

            {/* 01. Biometrics */}
            <div className="space-y-8">
              <h2 className="text-[10px] uppercase tracking-[0.1em] font-bold border-b border-outline-variant/20 pb-2">
                01. Biometrics
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-10">

                {/* Height */}
                <div className="group">
                  <label className={labelClass}>Height (cm)</label>
                  <input
                    type="number"
                    className={inputClass}
                    min="100"
                    max="250"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="180"
                  />
                </div>

                {/* Weight */}
                <div className="group">
                  <label className={labelClass}>Weight (kg)</label>
                  <input
                    type="number"
                    className={inputClass}
                    min="30"
                    max="300"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="75.0"
                  />
                </div>

                {/* Age */}
                <div className="group">
                  <label className={labelClass}>Biological Age</label>
                  <input
                    type="number"
                    className={inputClass}
                    min="10"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="28"
                  />
                </div>

                {/* Sex */}
                <div className="group">
                  <label className={labelClass}>Biological Sex</label>
                  <select
                    className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/40 py-4 px-0 text-xl font-medium tracking-tight focus:ring-0 focus:border-primary transition-all appearance-none outline-none"
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

            {/* 02. Metabolic Demand */}
            <div className="space-y-8 pt-8">
              <div className="flex justify-between items-end border-b border-outline-variant/20 pb-2">
                <h2 className="text-[10px] uppercase tracking-[0.1em] font-bold">02. Metabolic Demand</h2>
                <span className="text-[10px] font-mono text-secondary">
                  LVL. {String(activityLevel).padStart(2, '0')}
                </span>
              </div>
              <div className="px-2">
                <style>{`
                  input[type="range"].activity-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background: #000000;
                    cursor: pointer;
                    border-radius: 0;
                  }
                  input[type="range"].activity-slider::-moz-range-thumb {
                    width: 12px;
                    height: 12px;
                    background: #000000;
                    cursor: pointer;
                    border-radius: 0;
                  }
                `}</style>
                <input
                  type="range"
                  className="activity-slider w-full h-px bg-outline-variant/40 appearance-none cursor-pointer accent-primary"
                  min="1"
                  max="5"
                  step="1"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(parseInt(e.target.value))}
                />
                <div className="flex justify-between mt-4">
                  <span className="text-[9px] uppercase tracking-tighter text-on-surface-variant">Sedentary</span>
                  <span className="text-[9px] uppercase tracking-tighter text-on-surface-variant">Active</span>
                  <span className="text-[9px] uppercase tracking-tighter text-on-surface-variant">Extreme</span>
                </div>
                <p className="mt-3 text-[10px] font-mono text-secondary uppercase tracking-widest">
                  {activityLabels[activityLevel - 1]}
                  {tdee !== null && (
                    <span className="ml-4 text-outline">— {tdee.toLocaleString()} kcal / day</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-7 space-y-8">

            {/* 03. Objective */}
            <h2 className="text-[10px] uppercase tracking-[0.1em] font-bold border-b border-outline-variant/20 pb-2">
              03. Objective
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalMeta.map((goal) => {
                const isSelected = selectedGoal === goal.id;
                return (
                  <div
                    key={goal.id}
                    onClick={() => handleGoalSelect(goal.id)}
                    className={[
                      'group cursor-pointer p-8 border transition-all relative overflow-hidden h-64 flex flex-col justify-between',
                      isSelected
                        ? 'bg-primary border-transparent'
                        : 'bg-surface-container-lowest border-transparent hover:border-primary',
                    ].join(' ')}
                  >
                    <div className="z-10">
                      <p
                        className={[
                          'text-[10px] font-bold tracking-widest transition-colors',
                          isSelected
                            ? 'text-on-primary/60'
                            : 'text-secondary group-hover:text-primary',
                        ].join(' ')}
                      >
                        {goal.code}
                      </p>
                      <h3
                        className={[
                          'text-4xl font-black uppercase tracking-tighter mt-1',
                          isSelected ? 'text-on-primary' : '',
                        ].join(' ')}
                      >
                        {goal.label}
                      </h3>
                    </div>
                    <p
                      className={[
                        'text-xs leading-relaxed z-10 transition-opacity',
                        isSelected
                          ? 'text-on-primary/80 opacity-100'
                          : 'text-on-surface-variant opacity-0 group-hover:opacity-100',
                      ].join(' ')}
                    >
                      {goal.description}
                    </p>
                    {isSelected && (
                      <div className="absolute top-4 right-4 text-[10px] bg-white text-black px-2 py-1 font-bold">
                        SELECTED
                      </div>
                    )}
                    <div
                      className={[
                        'absolute -right-4 -bottom-4 text-8xl font-black opacity-20 pointer-events-none transition-colors',
                        isSelected
                          ? 'text-on-primary'
                          : 'text-surface-container group-hover:text-primary-container',
                      ].join(' ')}
                    >
                      {goal.num}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 04. Equipment */}
            <div className="space-y-6 pt-4">
              <h2 className="text-[10px] uppercase tracking-[0.1em] font-bold border-b border-outline-variant/20 pb-2">
                04. Equipment
              </h2>
              <div className="flex flex-wrap gap-3">
                {equipmentOptions.map((item) => {
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
                          : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest',
                      ].join(' ')}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Background Element */}
      <div className="fixed top-1/2 -right-64 -translate-y-1/2 opacity-5 pointer-events-none select-none">
        <h2 className="text-[25rem] font-black uppercase tracking-tighter leading-none">LAB</h2>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest py-6 px-8 border-t border-outline-variant/10 flex justify-between items-center z-40">
        <span className="text-[10px] font-mono text-outline uppercase tracking-widest hidden md:block">
          Awaiting calibration...
        </span>
        <button
          onClick={handleNext}
          className="bg-primary text-on-primary px-12 py-4 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-primary-fixed transition-all active:scale-[0.98]"
        >
          Proceed <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
