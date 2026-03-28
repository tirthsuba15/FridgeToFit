import { create } from 'zustand';

const useMealPlanStore = create((set) => ({
  mealPlan: null,
  workoutPlan: null,
  leftovers: {},

  setMealPlan: (plan) => set({ mealPlan: plan }),
  
  setWorkoutPlan: (plan) => set({ workoutPlan: plan }),
  
  toggleLeftover: (day, slot) => set((state) => {
    const key = `${day}_${slot}`;
    return {
      leftovers: {
        ...state.leftovers,
        [key]: !state.leftovers[key],
      },
    };
  }),
}));

export default useMealPlanStore;
