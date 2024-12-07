import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PageState {
  currentPage: string;
  lastRefresh: Record<string, number>;
  setCurrentPage: (page: string) => void;
  updateLastRefresh: (page: string) => void;
  shouldRefresh: (page: string) => boolean;
}

export const usePageStore = create<PageState>()(
  persist(
    (set, get) => ({
      currentPage: '',
      lastRefresh: {},
      setCurrentPage: (page) => set({ currentPage: page }),
      updateLastRefresh: (page) => 
        set((state) => ({
          lastRefresh: {
            ...state.lastRefresh,
            [page]: Date.now(),
          },
        })),
      shouldRefresh: (page) => {
        const state = get();
        const lastRefreshTime = state.lastRefresh[page];
        if (!lastRefreshTime) return true;
        
        // Refresh if it's been more than 5 minutes
        return Date.now() - lastRefreshTime > 5 * 60 * 1000;
      },
    }),
    {
      name: 'page-store',
    }
  )
);
