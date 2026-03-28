import { create } from 'zustand';

const useGroceryStore = create((set) => ({
  items: [],
  planId: null,

  setItems: (items) => set({ items }),
  setPlanId: (id) => set({ planId: id }),
}));

export default useGroceryStore;
