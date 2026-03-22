import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartApi } from '@/api'

interface CartItem {
  productId: string
  quantity: number
  product: any
}

interface CartData {
  items: CartItem[]
  totalAmount: number
}

export const useCartStore = defineStore('cart', () => {
  const cartCount = ref(0)
  const cartData = ref<CartData>({ items: [], totalAmount: 0 })
  const refreshToken = ref(0)

  const fetchCart = async () => {
    try {
      const res = await cartApi.getCart()
      const totalQty = res.data.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
      cartCount.value = totalQty
      cartData.value = res.data
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    }
  }

  const setCartCount = (count: number) => {
    cartCount.value = count
  }

  const incrementRefreshToken = () => {
    refreshToken.value++
  }

  return {
    cartCount,
    cartData,
    refreshToken,
    fetchCart,
    setCartCount,
    incrementRefreshToken
  }
})
