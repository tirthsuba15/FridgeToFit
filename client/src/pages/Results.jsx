import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useMealPlanStore from '../stores/mealPlanStore';
import useUserStore from '../stores/userStore';
import useGroceryStore from '../stores/groceryStore';
import { generateMealPlan, generateWorkoutPlan, swapMeal, patchLeftovers, fetchGroceryList } from '../api/endpoints';
import MealCard from '../components/MealCard';
import WorkoutCard from '../components/WorkoutCard';
import './Results.css';

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

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      setWorkoutError(false);
      setFetchError(false);

      const userId = useUserStore.getState().userId;
      const store = useUserStore.getState();

      const payload = {
        user_id: userId,
        ingredients: store.ingredients,
        cuisines: store.cuisines,
        dietary: store.dietary,
        budget: store.budget,
        equipment: store.equipment,
        goal: store.goal,
        activity_level: store.activityLevel
      };

      try {
        const [mealResult, workoutResult] = await Promise.allSettled([
          generateMealPlan(payload),
          generateWorkoutPlan(payload)
        ]);

        // Meal plan — required
        if (mealResult.status === 'fulfilled') {
          mealPlanStore.setMealPlan(mealResult.value.plan_json);
        } else {
          throw new Error('Meal plan generation failed');
        }

        // Workout plan — optional (graceful degradation)
        if (workoutResult.status === 'fulfilled') {
          mealPlanStore.setWorkoutPlan(workoutResult.value.plan_json);
        } else {
          setWorkoutError(true);
          // Fall back to SEED_WORKOUT_PLAN so right column isn't empty
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
  }, []);

  // Handlers for meal card actions
  const handleSwap = async (day, slot) => {
    const userId = useUserStore.getState().userId;
    const store = useUserStore.getState();

    try {
      const data = await swapMeal({
        plan_id: userId,
        day,
        slot,
        cuisine_preferences: store.cuisines,
        dietary: store.dietary
      });

      // Update meal in store
      const currentPlan = mealPlanStore.mealPlan;
      mealPlanStore.setMealPlan({
        ...currentPlan,
        [day]: {
          ...currentPlan[day],
          [slot]: data.meal
        }
      });
    } catch (err) {
      console.error('Failed to swap meal:', err);
      // Toast error will be handled in MealCard if needed
    }
  };

  const handleToggleLeftover = async (day, slot) => {
    const userId = useUserStore.getState().userId;

    // Optimistically toggle in store first
    mealPlanStore.toggleLeftover(day, slot);

    // Get new is_leftover value
    const newValue = mealPlanStore.leftovers[`${day}_${slot}`] ?? false;

    try {
      await patchLeftovers(userId, { day, slot, is_leftover: newValue });

      // Update grocery list
      const groceryData = await fetchGroceryList(userId);
      useGroceryStore.getState().setItems(groceryData.items || []);
    } catch (err) {
      console.error('Failed to update leftovers:', err);
      // Revert the toggle
      mealPlanStore.toggleLeftover(day, slot);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <svg
            width="60"
            height="60"
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
            className="spinning-leaf"
          >
            <path
              d="M20 5 Q30 15 20 35 Q10 15 20 5Z"
              fill="var(--green-deep)"
            />
          </svg>
        </div>
        <h2 className="loading-title">🌿 Building your personalized plan...</h2>
        <p className="loading-subtext">Crunching your fridge, goals, and preferences...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="loading-container">
        <div className="error-card">
          <h2 className="error-title">🌿 Something went wrong</h2>
          <p className="error-text">We couldn't generate your meal plan. Please go back and try again.</p>
          <button className="error-button" onClick={() => navigate('/onboarding/3')}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const slots = ['breakfast', 'lunch', 'dinner'];
  const slotLabels = ['Breakfast', 'Lunch', 'Dinner'];

  const mealPlan = mealPlanStore.mealPlan || SEED_MEAL_PLAN;
  const workoutPlan = mealPlanStore.workoutPlan || SEED_WORKOUT_PLAN;

  // Calculate average macros
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let mealCount = 0;

  days.forEach(day => {
    slots.forEach(slot => {
      const meal = mealPlan[day]?.[slot];
      if (meal && meal.macros) {
        totalCalories += meal.macros.calories;
        totalProtein += meal.macros.protein;
        totalCarbs += meal.macros.carbs;
        mealCount++;
      }
    });
  });

  const avgCalories = Math.round(totalCalories / 7);
  const avgProtein = Math.round(totalProtein / 7);
  const avgCarbs = Math.round(totalCarbs / 7);

  return (
    <div className="results-container">
      <div className="botanical-background"></div>

      {/* Left Column: Meal Plan */}
      <div className="results-column left-column">
        <h1 className="results-heading">Your 7-Day Meal Plan 🌿</h1>

        {/* Meal Calendar Grid */}
        <div className="meal-calendar">
          {/* Day Headers */}
          <div className="calendar-header">
            <div className="slot-label-header"></div>
            {dayLabels.map((label, index) => (
              <div key={index} className="day-header">{label}</div>
            ))}
          </div>

          {/* Meal Rows */}
          {slots.map((slot, slotIndex) => (
            <div key={slot} className="meal-row">
              <div className="slot-label">{slotLabels[slotIndex]}</div>
              {days.map((day) => {
                const meal = mealPlan[day]?.[slot];
                const isLeftover = mealPlanStore.leftovers[`${day}_${slot}`] ?? false;
                
                if (!meal) return <div key={day} className="meal-cell"></div>;
                
                return (
                  <div key={day} className="meal-cell">
                    <MealCard
                      name={meal.name}
                      cuisine_tag={meal.cuisine_tag}
                      macros={meal.macros}
                      prep_time_min={meal.prep_time_min}
                      is_leftover={isLeftover}
                      onSwap={() => handleSwap(day, slot)}
                      onToggleLeftover={() => handleToggleLeftover(day, slot)}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Macro Overview */}
        <div className="macro-overview">
          <h3 className="macro-heading">Weekly Nutrition Overview</h3>
          
          <div className="macro-bar-container">
            <div className="macro-bar-row">
              <span className="macro-label">Avg Calories</span>
              <span className="macro-value">{avgCalories} kcal/day</span>
            </div>
            <div className="macro-bar">
              <div className="macro-fill" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div className="macro-bar-container">
            <div className="macro-bar-row">
              <span className="macro-label">Avg Protein</span>
              <span className="macro-value">{avgProtein}g/day</span>
            </div>
            <div className="macro-bar">
              <div className="macro-fill" style={{ width: '65%' }}></div>
            </div>
          </div>

          <div className="macro-bar-container">
            <div className="macro-bar-row">
              <span className="macro-label">Avg Carbs</span>
              <span className="macro-value">{avgCarbs}g/day</span>
            </div>
            <div className="macro-bar">
              <div className="macro-fill" style={{ width: '70%' }}></div>
            </div>
          </div>

          <button className="grocery-link" onClick={() => navigate('/grocery')}>
            View Grocery List →
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="column-divider"></div>

      {/* Right Column: Workout Plan */}
      <div className="results-column right-column">
        <h1 className="results-heading">Your 7-Day Workout Split 💪</h1>

        {workoutError ? (
          <div className="workout-error-card">
            <h3 className="workout-error-title">💪 Workout plan unavailable</h3>
            <p className="workout-error-text">We couldn't generate your workout plan right now.</p>
            <button 
              className="workout-retry-button"
              onClick={async () => {
                try {
                  const userId = useUserStore.getState().userId;
                  const store = useUserStore.getState();
                  const payload = {
                    user_id: userId,
                    equipment: store.equipment,
                    goal: store.goal,
                    activity_level: store.activityLevel
                  };
                  const data = await generateWorkoutPlan(payload);
                  mealPlanStore.setWorkoutPlan(data.plan_json);
                  setWorkoutError(false);
                } catch (err) {
                  console.error('Retry failed:', err);
                }
              }}
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="workout-list">
            {workoutPlan.map((workout, index) => (
              <WorkoutCard
                key={index}
                day={workout.day}
                focus={workout.focus}
                exercises={workout.exercises}
                isRest={workout.isRest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
