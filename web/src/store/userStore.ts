import { create } from 'zustand';
import { userApi } from '@/api';
import type { User } from '@/types';

interface UserState {
  user: User | null;
  unreadCount: number;
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
  setUnreadCount: (count: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  unreadCount: 0,
  fetchUser: async () => {
    try {
      const res = await userApi.getUserInfo();
      set({ user: res.data });
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  },
  setUser: (user) => set({ user }),
  setUnreadCount: (count) => set({ unreadCount: count }),
}));
