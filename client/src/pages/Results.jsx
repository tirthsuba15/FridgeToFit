import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useMealPlanStore from '../stores/mealPlanStore';
import useUserStore from '../stores/userStore';
import useGroceryStore from '../stores/groceryStore';
import { generateMealPlan, generateWorkoutPlan, swapMeal, patchLeftovers, fetchGroceryList, saveIngredientNames, fetchRecipe } from '../api/endpoints';

const SEED_MEAL_PLAN = {
  monday: {
    breakfast: { name: "Greek Yogurt Parfait", cuisine_tag: "🇬🇷", macros: { calories: 320, protein: 18, carbs: 42 }, prep_time_min: 5 },
    lunch:     { name: "Spinach & Feta Wrap", cuisine_tag: "🇬🇷", macros: { calories: 480, protein: 24, carbs: 55 }, prep_time_min: 10 },
    dinner:    { name: "Lemon Herb Chicken", cuisine_tag: "🇬🇷", macros: { calories: 560, protein: 42, carbs: 28 }, prep_time_min: 30 }
  },
  tuesday: {
    breakfast: { name: "Miso Soup & Rice", cuisine_tag: "🇯🇵", macros: { calories: 290, protein: 12, carbs: 48 }, prep_time_min: 10 },
    lunch:     { name: "Teriyaki Salmon Bowl", cuisine_tag: "🇯🇵", macros: { calories: 520, protein: 38, carbs: 52 }, prep_time_min: 20 },
    dinner:    { name: "Edamame Stir Fry", cuisine_tag: "🇯🇵", macros: { calories: 440, protein: 22, carbs: 40 }, prep_time_min: 15 }
  },
  wednesday: {
    breakfast: { name: "Masala Oats", cuisine_tag: "🇮🇳", macros: { calories: 310, protein: 10, carbs: 52 }, prep_time_min: 8 },
    lunch:     { name: "Dal & Brown Rice", cuisine_tag: "🇮🇳", macros: { calories: 490, protein: 20, carbs: 72 }, prep_time_min: 25 },
    dinner:    { name: "Chicken Tikka", cuisine_tag: "🇮🇳", macros: { calories: 540, protein: 44, carbs: 18 }, prep_time_min: 35 }
  },
  thursday: {
    breakfast: { name: "Avocado Toast", cuisine_tag: "🇲🇽", macros: { calories: 380, protein: 14, carbs: 44 }, prep_time_min: 8 },
    lunch:     { name: "Black Bean Tacos", cuisine_tag: "🇲🇽", macros: { calories: 460, protein: 18, carbs: 62 }, prep_time_min: 15 },
    dinner:    { name: "Chicken Enchiladas", cuisine_tag: "🇲🇽", macros: { calories: 580, protein: 38, carbs: 48 }, prep_time_min: 40 }
  },
  friday: {
    breakfast: { name: "Kimchi Fried Rice", cuisine_tag: "🇰🇷", macros: { calories: 420, protein: 16, carbs: 68 }, prep_time_min: 12 },
    lunch:     { name: "Bibimbap Bowl", cuisine_tag: "🇰🇷", macros: { calories: 510, protein: 28, carbs: 58 }, prep_time_min: 20 },
    dinner:    { name: "Korean BBQ Beef", cuisine_tag: "🇰🇷", macros: { calories: 620, protein: 48, carbs: 22 }, prep_time_min: 30 }
  },
  saturday: {
    breakfast: { name: "Croissant & Eggs", cuisine_tag: "🇫🇷", macros: { calories: 440, protein: 20, carbs: 38 }, prep_time_min: 15 },
    lunch:     { name: "Nicoise Salad", cuisine_tag: "🇫🇷", macros: { calories: 390, protein: 30, carbs: 24 }, prep_time_min: 12 },
    dinner:    { name: "Ratatouille", cuisine_tag: "🇫🇷", macros: { calories: 360, protein: 10, carbs: 44 }, prep_time_min: 45 }
  },
  sunday: {
    breakfast: { name: "Pad Thai Omelette", cuisine_tag: "🇹🇭", macros: { calories: 400, protein: 24, carbs: 32 }, prep_time_min: 15 },
    lunch:     { name: "Green Curry Tofu", cuisine_tag: "🇹🇭", macros: { calories: 470, protein: 20, carbs: 50 }, prep_time_min: 25 },
    dinner:    { name: "Mango Sticky Rice", cuisine_tag: "🇹🇭", macros: { calories: 520, protein: 8, carbs: 88 }, prep_time_min: 20 }
  }
};

const SEED_WORKOUT_PLAN = [
  { day: "Monday",    focus: "Push",     isRest: false, exercises: [{ name: "Push-ups", sets: 4, reps: 12, notes: "Chest to floor" }, { name: "Shoulder Press", sets: 3, reps: 10, notes: "Use dumbbells" }, { name: "Tricep Dips", sets: 3, reps: 12, notes: "" }, { name: "Lateral Raises", sets: 3, reps: 15, notes: "Light weight" }] },
  { day: "Tuesday",   focus: "Pull",     isRest: false, exercises: [{ name: "Pull-ups", sets: 4, reps: 8, notes: "Full ROM" }, { name: "Bent-over Row", sets: 3, reps: 10, notes: "Barbell" }, { name: "Bicep Curls", sets: 3, reps: 12, notes: "" }, { name: "Face Pulls", sets: 3, reps: 15, notes: "Cable or band" }] },
  { day: "Wednesday", focus: "Legs",     isRest: false, exercises: [{ name: "Squats", sets: 4, reps: 10, notes: "Below parallel" }, { name: "Romanian DL", sets: 3, reps: 10, notes: "Barbell" }, { name: "Lunges", sets: 3, reps: 12, notes: "Each leg" }, { name: "Calf Raises", sets: 4, reps: 20, notes: "" }] },
  { day: "Thursday",  focus: "Rest",     isRest: true,  exercises: [] },
  { day: "Friday",    focus: "Push",     isRest: false, exercises: [{ name: "Bench Press", sets: 4, reps: 8, notes: "Barbell" }, { name: "Incline DB Press", sets: 3, reps: 10, notes: "" }, { name: "Cable Fly", sets: 3, reps: 12, notes: "" }, { name: "Overhead Press", sets: 3, reps: 10, notes: "" }] },
  { day: "Saturday",  focus: "Athletic", isRest: false, exercises: [{ name: "Box Jumps", sets: 4, reps: 8, notes: "Land soft" }, { name: "Kettlebell Swings", sets: 3, reps: 15, notes: "" }, { name: "Battle Ropes", sets: 3, reps: 30, notes: "seconds" }, { name: "Burpees", sets: 3, reps: 10, notes: "" }] },
  { day: "Sunday",    focus: "Rest",     isRest: true,  exercises: [] }
];

export default function Results() {
  const navigate = useNavigate();
  const mealPlanStore = useMealPlanStore();
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [workoutError, setWorkoutError] = useState(false);
  const [ownedIngredients, setOwnedIngredients] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null); // {day, slot, meal}
  const [recipeData, setRecipeData] = useState(null); // {ingredients, steps}
  const [recipeFetching, setRecipeFetching] = useState(false);
  const [activeFilters] = useState(() => {
    const s = useUserStore.getState();
    return { dietary: s.dietary || [], cuisines: s.cuisines || [], goal: s.goal || null };
  });

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      setWorkoutError(false);
      setFetchError(false);

      const userId = useUserStore.getState().userId;
      const store = useUserStore.getState();

      // Separate typed strings vs photo objects (which already have DB IDs)
      const allIngredients = store.ingredients || [];
      const ingredientStrings = allIngredients.filter(i => typeof i === 'string');
      const ingredientIds = allIngredients
        .map(i => (typeof i === 'object' ? i.id : null))
        .filter(Boolean);

      // If user typed ingredients (not from photo), save them to DB so matchRecipes can use them
      if (ingredientStrings.length > 0) {
        try { await saveIngredientNames(ingredientStrings); } catch {}
      }

      try {
        // Meal plan first — workout needs the returned meal_plan_id
        const mealResult = await generateMealPlan({
          user_id: userId,
          ingredient_ids: ingredientIds,
          ingredient_names: ingredientStrings,
          cuisine_prefs: store.cuisines,
          dietary_flags: store.dietary,
        });
        const planId = mealResult.id;
        const rawPlan = mealResult.plan_json || mealResult.plan;

        // Normalize array-style days [{day, meals:[{slot,...}]}] → {monday:{breakfast:{...}}}
        const normalizePlan = (plan) => {
          if (!plan?.days || !Array.isArray(plan.days)) return plan;
          const out = {};
          for (const d of plan.days) {
            const key = d.day?.toLowerCase();
            if (!key) continue;
            out[key] = {};
            for (const m of (d.meals || [])) {
              out[key][m.slot] = m;
            }
          }
          return out;
        };
        mealPlanStore.setMealPlan(normalizePlan(rawPlan) || rawPlan);
        mealPlanStore.setMealPlanId(planId);
        useGroceryStore.getState().setPlanId(planId);

        // Workout — sequential so we have the meal_plan_id
        try {
          const workoutResult = await generateWorkoutPlan({
            user_id: userId,
            meal_plan_id: planId,
            equipment: store.equipment,
          });
          const wp = workoutResult.plan_json || workoutResult.plan || workoutResult;
          mealPlanStore.setWorkoutPlan(Array.isArray(wp) ? wp : (wp?.days || wp?.week || SEED_WORKOUT_PLAN));
        } catch {
          setWorkoutError(true);
          mealPlanStore.setWorkoutPlan(SEED_WORKOUT_PLAN);
        }

      } catch (err) {
        console.error('Failed to generate plans:', err);
        // Meal plan failed — show full-page error
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();

    // Show all ingredients the user entered this session
    const sessionIngredients = (useUserStore.getState().ingredients || [])
      .map(i => typeof i === 'string' ? i : i?.name)
      .filter(Boolean);
    setOwnedIngredients(sessionIngredients);
  }, []);

  // Handlers for meal card actions
  const handleSwap = async (day, slot) => {
    const planId = useMealPlanStore.getState().mealPlanId;
    try {
      const data = await swapMeal({ meal_plan_id: planId, day, slot });
      const currentPlan = mealPlanStore.mealPlan;
      const newMeal = data.updated_slot || data.meal || data.new_recipe;
      mealPlanStore.setMealPlan({
        ...currentPlan,
        [day]: { ...currentPlan[day], [slot]: newMeal }
      });
    } catch (err) {
      console.error('Failed to swap meal:', err);
    }
  };

  const handleToggleLeftover = async (day, slot) => {
    const planId = useMealPlanStore.getState().mealPlanId;
    // Compute newValue BEFORE toggling so the server gets the correct intended value
    const newValue = !(mealPlanStore.leftovers[`${day}_${slot}`] ?? false);
    mealPlanStore.toggleLeftover(day, slot);
    try {
      await patchLeftovers(planId, { day, slot, is_leftover: newValue });
      const groceryData = await fetchGroceryList(planId);
      useGroceryStore.getState().setItems(groceryData.grouped || groceryData.items || []);
    } catch (err) {
      console.error('Failed to update leftovers:', err);
      mealPlanStore.toggleLeftover(day, slot);
    }
  };

  // ── Loading State ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary opacity-60">
            Synthesizing your protocol...
          </p>
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-6 px-8">
        <div className="max-w-sm w-full bg-surface-container-lowest p-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary opacity-60 mb-4">
            System Error // Protocol Failed
          </p>
          <h2 className="text-2xl font-black tracking-tighter text-black mb-3 leading-none">
            Generation Failed.
          </h2>
          <p className="text-sm text-on-surface-variant font-light mb-6">
            We could not generate your plan. Please go back and try again.
          </p>
          <button
            className="bg-primary text-on-primary-container px-5 py-2 text-xs font-bold uppercase tracking-widest w-full"
            onClick={() => navigate('/onboarding/3')}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Data Setup ─────────────────────────────────────────────────────────────
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const slots = ['breakfast', 'lunch', 'dinner'];
  const slotTimes = { breakfast: '07:00 Breakfast', lunch: '13:00 Lunch', dinner: '19:00 Dinner' };

  const mealPlan = mealPlanStore.mealPlan || SEED_MEAL_PLAN;
  const rawWorkout = mealPlanStore.workoutPlan || SEED_WORKOUT_PLAN;
  const workoutPlan = Array.isArray(rawWorkout)
    ? rawWorkout
    : Array.isArray(rawWorkout?.days) && rawWorkout.days.length > 0
      ? rawWorkout.days
      : Array.isArray(rawWorkout?.week) && rawWorkout.week.length > 0
        ? rawWorkout.week
        : SEED_WORKOUT_PLAN;

  // Calculate aggregate macros
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;

  days.forEach(day => {
    slots.forEach(slot => {
      const meal = mealPlan[day]?.[slot];
      if (meal && meal.macros) {
        totalCalories += meal.macros.calories || 0;
        totalProtein  += meal.macros.protein  || 0;
        totalCarbs    += meal.macros.carbs    || 0;
        totalFats     += meal.macros.fat || meal.macros.fats || 0;
      }
    });
  });

  const avgCalories = Math.round(totalCalories / 7);
  const avgProtein  = Math.round(totalProtein  / 7);
  const avgCarbs    = Math.round(totalCarbs    / 7);
  const avgFats     = Math.round(totalFats     / 7);

  // Macro bar proportions
  const macroTotal = avgProtein + avgCarbs + avgFats || 1;
  const proteinPct = Math.round((avgProtein / macroTotal) * 100);
  const carbsPct   = Math.round((avgCarbs   / macroTotal) * 100);
  const fatsPct    = 100 - proteinPct - carbsPct;

  // Kcal estimate for a workout based on focus
  const kcalEstimate = (workout) => {
    if (workout.isRest ?? workout.rest) return 90;
    const focusMap = {
      push: 510, pull: 480, legs: 580, athletic: 720,
      cardio: 640, rest: 90, core: 350, hypertrophy: 420
    };
    return focusMap[(workout.focus || '').toLowerCase()] ?? 450;
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-surface min-h-screen font-body text-on-surface antialiased">

      {/* Fixed glassmorphism nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex justify-between items-center px-8 py-6">
        <div className="text-2xl font-black tracking-tighter uppercase text-black cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/')}>FridgeToFit</div>
        <div className="hidden md:flex gap-8 items-center">
          <a className="text-black border-b-2 border-black pb-1 font-bold cursor-default">Plan</a>
          <a
            className="text-zinc-400 hover:text-black transition-colors cursor-pointer"
            onClick={() => navigate('/grocery')}
          >
            Groceries
          </a>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-28 pb-12 px-8 max-w-[1600px] mx-auto min-h-screen">

        {/* Clinical Summary Header */}
        <header className="mb-12 max-w-3xl">
          <div className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-4 opacity-60">
            System Assessment // Protocol 042
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black mb-6 leading-none">
            Your Clinical Optimization Path.
          </h1>
          <p className="text-lg text-on-surface-variant font-light leading-relaxed border-l-2 border-primary pl-6 py-1">
            Based on your current metabolic profile and inventory, we have synthesized a 7-day high-precision
            physiological load. Nutrient density is prioritized to sustain a caloric deficit while maximizing
            muscular recovery through targeted hypertrophy prompts. Adherence to this specific sequence ensures
            optimal hormonal balance and cognitive clarity.
          </p>
        </header>

        {/* Main Dashboard Grid */}
        <div className="flex flex-col lg:flex-row gap-12">

          {/* LEFT: 7-Day Nutritional Grid */}
          <section className="lg:w-3/5">

            {/* Section header */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest">7-Day Nutritional Grid</h2>
                <div className="h-1 w-12 bg-primary mt-2" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-tighter text-zinc-400">
                Inventory Sync: 98.4%
              </div>
            </div>

            {/* 7-column grid */}
            <div className="grid grid-cols-7 gap-px bg-zinc-200 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.04)]">

              {/* Day labels row */}
              {dayLabels.map((label) => (
                <div
                  key={label}
                  className="bg-surface-container-low py-4 text-center border-b border-zinc-200"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                </div>
              ))}

              {/* Meal slot rows */}
              {slots.map((slot) => (
                <React.Fragment key={slot}>
                  {/* Row label spanning all 7 columns */}
                  <div className="col-span-7 bg-zinc-100 px-4 py-2 flex items-center justify-between border-t border-zinc-200">
                    <span className="text-[9px] font-bold tracking-widest uppercase opacity-40">
                      {slotTimes[slot]}
                    </span>
                  </div>

                  {/* 7 meal cells */}
                  {days.map((day) => {
                    const meal = mealPlan[day]?.[slot];
                    const isLeftover = mealPlanStore.leftovers?.[`${day}_${slot}`] ?? false;
                    const mealName = meal
                      ? (meal.name || meal.recipe_name || '—').toUpperCase()
                      : '—';
                    const macros = meal?.macros || {};

                    if (isLeftover) {
                      return (
                        <div
                          key={`${day}-${slot}`}
                          className="bg-surface-container-low p-3 aspect-[4/5] flex flex-col justify-between cursor-pointer"
                          onClick={() => handleToggleLeftover(day, slot)}
                        >
                          <div className="text-[9px] font-black">LEFTOVERS</div>
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: '14px', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
                          >
                            cached
                          </span>
                        </div>
                      );
                    }

                    const isSelected = selectedMeal?.day === day && selectedMeal?.slot === slot;
                    return (
                      <div
                        key={`${day}-${slot}`}
                        className={`p-3 aspect-[4/5] flex flex-col justify-between group cursor-pointer transition-colors ${isSelected ? 'bg-black text-white' : 'bg-white hover:bg-zinc-50'}`}
                        onClick={async () => {
                          if (isSelected) { setSelectedMeal(null); setRecipeData(null); return; }
                          setSelectedMeal({ day, slot, meal });
                          setRecipeData(null);
                          const name = meal?.recipe_name || meal?.name;
                          if (name) {
                            setRecipeFetching(true);
                            try {
                              const r = await fetchRecipe(name);
                              setRecipeData(r);
                            } catch {}
                            setRecipeFetching(false);
                          }
                        }}
                      >
                        <div>
                          <div className={`text-[9px] font-black mb-1 leading-tight ${isSelected ? 'text-white' : ''}`}>{mealName}</div>
                          {meal?.prep_time_min != null && (
                            <div className={`text-[8px] ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>{meal.prep_time_min} MIN PREP</div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {macros.protein != null && (
                            <span className={`px-1.5 py-0.5 text-[7px] font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-zinc-100'}`}>
                              P: {macros.protein}G
                            </span>
                          )}
                          {macros.carbs != null && (
                            <span className={`px-1.5 py-0.5 text-[7px] font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-zinc-100'}`}>
                              C: {macros.carbs}G
                            </span>
                          )}
                          {(macros.fat != null || macros.fats != null) && (
                            <span className={`px-1.5 py-0.5 text-[7px] font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-zinc-100'}`}>
                              F: {macros.fat ?? macros.fats}G
                            </span>
                          )}
                        </div>

                        {/* Hover controls */}
                        <div className="flex justify-between items-center pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span
                            className="material-symbols-outlined cursor-pointer"
                            style={{ fontSize: '14px', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
                            onClick={(e) => { e.stopPropagation(); handleSwap(day, slot); }}
                            title="Swap meal"
                          >
                            swap_horiz
                          </span>
                          <div
                            className="w-2 h-2 rounded-full border border-black cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); handleToggleLeftover(day, slot); }}
                            title="Mark as leftover"
                          />
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* Macro Summary Bar */}
            <div className="mt-8 bg-surface-container-lowest p-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
              <div className="flex justify-between items-baseline mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.1em]">
                  Weekly Aggregate Macros
                </span>
                <span className="text-xl font-black tracking-tight">
                  {avgCalories.toLocaleString()}{' '}
                  <span className="text-[10px] font-normal uppercase">AVG Kcal/Day</span>
                </span>
              </div>

              {/* Segmented bar */}
              <div className="flex h-3 w-full bg-zinc-100 overflow-hidden">
                <div className="h-full" style={{ width: `${proteinPct}%`, background: '#3b82f6' }} />
                <div className="h-full" style={{ width: `${carbsPct}%`,   background: '#f59e0b' }} />
                <div className="h-full" style={{ width: `${fatsPct}%`,    background: '#ef4444' }} />
              </div>

              {/* Legend */}
              <div className="flex gap-8 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2" style={{ background: '#3b82f6' }} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">
                    Protein {avgProtein}g
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2" style={{ background: '#f59e0b' }} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">
                    Carbs {avgCarbs}g
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2" style={{ background: '#ef4444' }} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">
                    Fats {avgFats}g
                  </span>
                </div>
              </div>

              {/* Grocery CTA */}
              <button
                className="mt-6 bg-primary text-on-primary-container px-5 py-2 text-xs font-bold uppercase tracking-widest active:scale-[0.98] duration-200"
                onClick={() => navigate('/grocery')}
              >
                View Grocery List
              </button>
            </div>

            {/* Ingredients Already On Hand — Used / Not Used */}
            {ownedIngredients.length > 0 && (() => {
              const allMealNames = days.flatMap(d =>
                slots.map(s => (mealPlan[d]?.[s]?.recipe_name || mealPlan[d]?.[s]?.name || '').toLowerCase())
              ).join(' ');
              const used = ownedIngredients.filter(n => allMealNames.includes(n.toLowerCase()));
              const unused = ownedIngredients.filter(n => !allMealNames.includes(n.toLowerCase()));
              return (
                <div className="mt-6 bg-surface-container-lowest p-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)] space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] block">
                    Your Kitchen Inventory
                  </span>
                  {used.length > 0 && (
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                        Used This Week ({used.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {used.map((name, i) => (
                          <span key={i} className="bg-black text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {unused.length > 0 && (
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                        Not Used ({unused.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {unused.map((name, i) => (
                          <span key={i} className="bg-zinc-100 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </section>

          {/* RIGHT: Recipe Detail or Workout */}
          <section className="lg:w-2/5">

            {selectedMeal ? (
              /* ── Recipe Detail Panel ── */
              <div>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest">Recipe Detail</h2>
                    <div className="h-1 w-12 bg-primary mt-2" />
                  </div>
                  <button
                    onClick={() => { setSelectedMeal(null); setRecipeData(null); }}
                    className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined" style={{fontSize:'14px'}}>close</span>
                    Close
                  </button>
                </div>
                <div className="bg-surface-container-lowest p-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)] max-h-[70vh] overflow-y-auto">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                    {selectedMeal.day.charAt(0).toUpperCase() + selectedMeal.day.slice(1)} // {selectedMeal.slot.charAt(0).toUpperCase() + selectedMeal.slot.slice(1)}
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter uppercase leading-tight mb-2">
                    {(selectedMeal.meal?.recipe_name || selectedMeal.meal?.name || '—')}
                  </h3>
                  {selectedMeal.meal?.prep_time_min != null && (
                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-5">
                      {selectedMeal.meal.prep_time_min} min prep
                    </div>
                  )}

                  {/* Recipe content */}
                  {recipeFetching ? (
                    <div className="flex items-center gap-2 py-8 justify-center">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Loading recipe...</span>
                    </div>
                  ) : recipeData ? (
                    <div className="space-y-5 mb-6">
                      {/* Ingredients */}
                      {recipeData.ingredients?.length > 0 && (
                        <div>
                          <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Ingredients</div>
                          <ul className="space-y-1.5">
                            {recipeData.ingredients.map((ing, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-primary mt-1.5 flex-shrink-0 inline-block" />
                                <span className="text-xs text-on-surface leading-snug">{ing}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* Steps */}
                      {recipeData.steps?.length > 0 && (
                        <div>
                          <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Instructions</div>
                          <ol className="space-y-2">
                            {recipeData.steps.map((step, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span className="text-[9px] font-black text-primary mt-0.5 flex-shrink-0 w-4">{i + 1}.</span>
                                <span className="text-xs text-on-surface leading-snug">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Macros at the bottom */}
                  {selectedMeal.meal?.macros && (
                    <div className="space-y-2 mb-5 pt-4 border-t border-zinc-100">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Nutritional Profile</div>
                      {[
                        { label: 'Calories', value: selectedMeal.meal.macros.calories, unit: 'kcal', color: '#000' },
                        { label: 'Protein',  value: selectedMeal.meal.macros.protein,  unit: 'g', color: '#3b82f6' },
                        { label: 'Carbs',    value: selectedMeal.meal.macros.carbs,    unit: 'g', color: '#f59e0b' },
                        { label: 'Fat',      value: selectedMeal.meal.macros.fat ?? selectedMeal.meal.macros.fats, unit: 'g', color: '#ef4444' },
                      ].map(({ label, value, unit, color }) => value != null && (
                        <div key={label} className="flex justify-between items-center py-1.5 border-b border-zinc-100">
                          <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 inline-block" style={{ background: color }} />
                            {label}
                          </span>
                          <span className="text-sm font-black tracking-tight">{value}<span className="text-[10px] font-normal ml-0.5">{unit}</span></span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className="w-full mt-2 bg-zinc-100 hover:bg-zinc-200 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    onClick={(e) => { e.stopPropagation(); handleSwap(selectedMeal.day, selectedMeal.slot); setSelectedMeal(null); setRecipeData(null); }}
                  >
                    <span className="material-symbols-outlined" style={{fontSize:'14px'}}>swap_horiz</span>
                    Swap This Meal
                  </button>
                </div>
              </div>
            ) : (
              /* ── Physiological Load (Workout) ── */
              <div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest">Physiological Load</h2>
                <div className="h-1 w-12 bg-primary mt-2" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-tighter text-zinc-400">
                Week 01 // Cycle A
              </div>
            </div>

            {workoutError ? (
              <div className="bg-surface-container-lowest p-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary opacity-60 mb-3">
                  Load Error // Workout Unavailable
                </p>
                <p className="text-sm text-on-surface-variant font-light mb-4">
                  We could not generate your workout plan right now.
                </p>
                <button
                  className="bg-primary text-on-primary-container px-5 py-2 text-xs font-bold uppercase tracking-widest active:scale-[0.98] duration-200"
                  onClick={async () => {
                    try {
                      const userId = useUserStore.getState().userId;
                      const planId = useMealPlanStore.getState().mealPlanId;
                      const store = useUserStore.getState();
                      const data = await generateWorkoutPlan({
                        user_id: userId,
                        meal_plan_id: planId,
                        equipment: store.equipment,
                      });
                      mealPlanStore.setWorkoutPlan(data.plan_json || data.plan);
                      setWorkoutError(false);
                    } catch (err) {
                      console.error('Retry failed:', err);
                    }
                  }}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {workoutPlan.map((workout, index) => {
                  const isRest = workout.isRest ?? workout.rest ?? false;
                  const exerciseNames = (workout.exercises || [])
                    .slice(0, 3)
                    .map(e => e.name)
                    .join(', ');
                  const sessionLabel = isRest
                    ? `${workout.day} // Full Rest`
                    : `${workout.day} // Session ${String(index + 1).padStart(2, '0')}`;
                  const focusLabel = isRest ? 'Rest & Recovery' : (workout.focus && workout.focus.toUpperCase() !== 'UNKNOWN' ? workout.focus : 'Training');
                  const kcal = kcalEstimate(workout);

                  return (
                    <div
                      key={index}
                      className={[
                        'p-6 flex justify-between items-center group transition-transform',
                        isRest
                          ? 'bg-surface-container-low opacity-60'
                          : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:translate-x-1 border-l-4 border-transparent hover:border-black'
                      ].join(' ')}
                    >
                      <div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                          {sessionLabel}
                        </div>
                        <h3 className="text-xl font-black tracking-tighter uppercase mb-2">
                          {focusLabel}
                        </h3>
                        {exerciseNames && (
                          <p className="text-[11px] text-zinc-500 uppercase leading-none">
                            {exerciseNames}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="text-2xl font-black tabular-nums tracking-tighter">{kcal}</div>
                        <div className="text-[9px] font-bold uppercase text-zinc-400">Kcal Est.</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Active Protocol / Filters */}
            {(activeFilters.dietary.length > 0 || activeFilters.cuisines.length > 0 || activeFilters.goal) && (
              <div className="mt-6 bg-surface-container-lowest p-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
                <div className="text-[10px] font-black uppercase tracking-[0.1em] mb-5">Active Protocol</div>
                {activeFilters.goal && (
                  <div className="mb-4">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Goal</div>
                    <span className="bg-black text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider">
                      {activeFilters.goal.replace(/_/g, ' ')}
                    </span>
                  </div>
                )}
                {activeFilters.dietary.length > 0 && (
                  <div className="mb-4">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Dietary</div>
                    <div className="flex flex-wrap gap-2">
                      {activeFilters.dietary.map((d, i) => (
                        <span key={i} className="bg-black text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider">
                          {d.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {activeFilters.cuisines.length > 0 && (
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Cuisines</div>
                    <div className="flex flex-wrap gap-2">
                      {activeFilters.cuisines.map((c, i) => (
                        <span key={i} className="bg-zinc-100 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-700">
                          {c.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-zinc-50 border-t border-zinc-200/20">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 w-full max-w-screen-2xl mx-auto">
          <div>
            <div className="font-black text-black mb-2 uppercase tracking-tighter">FRIDGETOFIT.</div>
            <div className="text-[10px] uppercase tracking-[0.05em] text-zinc-500">
              2026 FRIDGETOFIT. CLINICAL PRECISION.
            </div>
          </div>
          <div className="flex flex-wrap gap-8">
            <span className="text-[10px] uppercase tracking-[0.05em] text-zinc-500 hover:text-black underline transition-all cursor-pointer">Privacy</span>
            <span className="text-[10px] uppercase tracking-[0.05em] text-zinc-500 hover:text-black underline transition-all cursor-pointer">Terms</span>
            <span className="text-[10px] uppercase tracking-[0.05em] text-zinc-500 hover:text-black underline transition-all cursor-pointer">Clinical Standards</span>
            <span className="text-[10px] uppercase tracking-[0.05em] text-zinc-500 hover:text-black underline transition-all cursor-pointer">Support</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
