import { create } from 'zustand';

type SearchKeywordStore = {
  keyword: string;
  set: (v: string) => void;
  clear: () => void;
};

export const useSearchKeyword = create<SearchKeywordStore>((set) => ({
  keyword: '',
  set: (v) => set({ keyword: v }),
  clear: () => set({ keyword: '' }),
}));
