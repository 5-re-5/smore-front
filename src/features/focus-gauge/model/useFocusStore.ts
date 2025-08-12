import { create } from 'zustand';

interface FocusRecord {
  recordId: number;
  status: number;
  timestamp: string;
  userId: number;
}

interface FocusStore {
  currentFocus: FocusRecord | null;
  setCurrentFocus: (focus: FocusRecord) => void;
  clearFocus: () => void;
}

export const useFocusStore = create<FocusStore>((set) => ({
  currentFocus: null,
  setCurrentFocus: (focus) => set({ currentFocus: focus }),
  clearFocus: () => set({ currentFocus: null }),
}));
