import { create } from 'zustand';

const useMealPlanStore = create((set) => ({
  mealPlan: null,
  mealPlanId: null,
  workoutPlan: null,
  leftovers: {},

  setMealPlan: (plan) => set({ mealPlan: plan }),
  setMealPlanId: (id) => set({ mealPlanId: id }),
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
