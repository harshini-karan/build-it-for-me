import { create } from 'zustand';

interface BlogStore {
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useBlogStore = create<BlogStore>((set) => ({
  selectedCategoryId: null,
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
