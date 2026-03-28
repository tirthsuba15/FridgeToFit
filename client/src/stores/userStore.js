import { create } from 'zustand';

const useUserStore = create((set) => ({
  // Session
  sessionToken: null,
  userId: null,

  // Ingredients
  ingredients: [],

  // Health Metrics
  height: '',
  weight: '',
  age: '',
  sex: '',
  activityLevel: '',
  goal: '',

  // Preferences
  dietary: [],
  cuisines: [],
  budget: '',
  equipment: [],

  // Setters
  setSessionToken: (token) => set({ sessionToken: token }),
  setUserId: (id) => set({ userId: id }),
  setIngredients: (ingredients) => set({ ingredients }),
  setHeight: (height) => set({ height }),
  setWeight: (weight) => set({ weight }),
  setAge: (age) => set({ age }),
  setSex: (sex) => set({ sex }),
  setActivityLevel: (level) => set({ activityLevel: level }),
  setGoal: (goal) => set({ goal }),
  setDietary: (dietary) => set({ dietary }),
  setCuisines: (cuisines) => set({ cuisines }),
  setBudget: (budget) => set({ budget }),
  setEquipment: (equipment) => set({ equipment }),
}));

export default useUserStore;
