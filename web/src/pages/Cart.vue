<template>
  <div class="page" style="display: flex; flex-direction: column; height: 100%">
    <div style="flex: 1; overflow-y: auto">
      <div v-if="cartData.items.length === 0" class="empty">
        <div>购物车还是空的~</div>
        <button class="btn btn-primary mt-12" @click="router.push('/home')">
          去逛逛
        </button>
      </div>
      <div v-else>
        <div v-for="item in cartData.items" :key="item.productId" class="card mb-8">
          <div class="flex-between" style="gap: 12px">
            <img
              :src="item.product.image"
              :alt="item.product.name"
              style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; cursor: pointer"
              @click="router.push(`/product/${item.productId}`)"
            />
            <div style="flex: 1">
              <div
                class="text-sm"
                style="font-weight: 600; margin-bottom: 4px; cursor: pointer"
                @click="router.push(`/product/${item.productId}`)"
              >
                {{ item.product.name }}
              </div>
              <div class="text-xs text-secondary" style="margin-bottom: 8px">
                {{ item.product.tags?.join(' · ') }}
              </div>
              <div class="flex-between">
                <div class="text-sm price">¥{{ item.product.price }}</div>
                <div class="flex-center" style="gap: 8px">
                  <button class="btn btn-sm btn-secondary" @click="updateQuantity(item.productId, item.quantity - 1)">
                    -
                  </button>
                  <span class="text-sm" style="min-width: 24px; text-align: center">
                    {{ item.quantity }}
                  </span>
                  <button class="btn btn-sm btn-secondary" @click="updateQuantity(item.productId, item.quantity + 1)">
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="cartData.items.length > 0" class="card" style="padding: 12px 16px">
      <div class="flex-between" style="margin-bottom: 12px">
        <div class="text-sm">
          共 {{ cartData.items.reduce((sum: number, item: any) => sum + item.quantity, 0) }} 件商品
        </div>
        <div class="text-sm" style="font-weight: 600">
          合计：¥{{ cartData.totalAmount }}
        </div>
      </div>
      <button class="btn btn-primary btn-lg" @click="handleCheckout" :disabled="checkingOut">
        {{ checkingOut ? '结算中...' : '去结算' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { cartApi, orderApi } from '@/api'
import type { CartData } from '@/types'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()
const { incrementRefreshToken } = cartStore

const cartData = ref<CartData>({ items: [], totalAmount: 0 })
const checkingOut = ref(false)

onMounted(() => {
  fetchCart()
})

const fetchCart = async () => {
  try {
    const res = await cartApi.getCart()
    cartData.value = res.data
  } catch (error) {
    console.error('Failed to fetch cart:', error)
  }
}

const updateQuantity = async (productId: string, quantity: number) => {
  try {
    await cartApi.addToCart({ productId, quantity })
    await fetchCart()
    incrementRefreshToken()
  } catch (error) {
    console.error('Failed to update cart:', error)
    alert('更新失败')
  }
}

const handleCheckout = async () => {
  if (cartData.value.items.length === 0) {
    alert('购物车为空')
    return
  }

  if (!confirm(`确认结算 ¥${cartData.value.totalAmount} 吗？`)) {
    return
  }

  checkingOut.value = true
  try {
    const res = await orderApi.checkout()
    if (res.data.success) {
      incrementRefreshToken()
      router.push(`/payment-result/${res.data.orderId}`)
    }
  } catch (error) {
    console.error('Failed to checkout:', error)
    alert('结算失败')
  } finally {
    checkingOut.value = false
  }
}
</script>
