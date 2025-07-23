import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  activeTab: string;
  refreshing: boolean;
  realTimeMode: boolean;
  setActiveTab: (tab: string) => void;
  setRefreshing: (refreshing: boolean) => void;
  setRealTimeMode: (enabled: boolean) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      activeTab: 'overview',
      refreshing: false,
      realTimeMode: true,
      setActiveTab: (tab) => set({ activeTab: tab }),
      setRefreshing: (refreshing) => set({ refreshing }),
      setRealTimeMode: (enabled) => set({ realTimeMode: enabled }),
    }),
    {
      name: 'admin-storage',
    }
  )
);