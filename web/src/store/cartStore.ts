import { create } from 'zustand';
import { cartApi } from '@/api';

interface CartState {
  cartCount: number;
  refreshToken: number;
  fetchCart: () => Promise<void>;
  setCartCount: (count: number) => void;
  incrementRefreshToken: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartCount: 0,
  refreshToken: 0,
  fetchCart: async () => {
    try {
      const res = await cartApi.getCart();
      const totalQty = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
      set({ cartCount: totalQty });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  },
  setCartCount: (count) => set({ cartCount: count }),
  incrementRefreshToken: () => set((state) => ({ refreshToken: state.refreshToken + 1 })),
}));
