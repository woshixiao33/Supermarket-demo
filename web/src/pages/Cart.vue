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
      <!-- 优惠券选择 -->
      <div class="flex-between" style="margin-bottom: 12px; cursor: pointer" @click="showCouponSelector = true">
        <div class="flex-center" style="gap: 8px">
          <span class="text-sm">优惠券</span>
          <span v-if="selectedCoupon" class="text-sm" style="color: #ff4d4f; font-weight: 600">
            -¥{{ selectedCoupon.amount }}
          </span>
          <span v-else class="text-sm text-secondary">
            {{ availableCoupons.length > 0 ? `可用${availableCoupons.length}张` : '暂无可用' }}
          </span>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
          <path d="M9 18l6-6-6-6"></path>
        </svg>
      </div>

      <div class="flex-between" style="margin-bottom: 12px">
        <div class="text-sm">
          共 {{ cartData.items.reduce((sum: number, item: any) => sum + item.quantity, 0) }} 件商品
        </div>
        <div class="flex-column" style="align-items: flex-end">
          <div v-if="selectedCoupon" class="text-xs text-secondary" style="text-decoration: line-through">
            ¥{{ finalAmount + selectedCoupon.amount }}
          </div>
          <div class="text-sm" style="font-weight: 600">
            合计：¥{{ finalAmount }}
          </div>
        </div>
      </div>
      <button class="btn btn-primary btn-lg" @click="handleCheckout" :disabled="checkingOut">
        {{ checkingOut ? '结算中...' : '去结算' }}
      </button>
    </div>

    <!-- 优惠券选择弹窗 -->
    <div v-if="showCouponSelector" class="dialog-overlay" @click.self="showCouponSelector = false">
      <div class="dialog dialog-coupon">
        <div class="dialog-header">选择优惠券</div>
        <div class="dialog-body dialog-body-scrollable">
          <div
            v-if="availableCoupons.length === 0"
            class="text-sm text-secondary"
            style="text-align: center; padding: 40px 0"
          >
            暂无可用优惠券
          </div>
          <div v-else>
            <div
              v-for="coupon in availableCoupons"
              :key="coupon.id"
              class="coupon-item"
              :class="{ 'coupon-selected': selectedCoupon?.id === coupon.id }"
              @click="selectCoupon(coupon)"
            >
              <div style="flex: 1">
                <div class="text-sm" style="font-weight: 600; color: #ff4d4f; margin-bottom: 4px">
                  ¥{{ coupon.amount }}
                </div>
                <div class="text-xs text-secondary">
                  {{ coupon.title || coupon.description }}
                </div>
                <div class="text-xs" style="color: #999; margin-top: 4px">
                  满{{ coupon.minAmount }}可用
                </div>
              </div>
              <div class="coupon-checkbox" :style="{ borderColor: selectedCoupon?.id === coupon.id ? '#27AE60' : '#ddd' }">
                <svg v-if="selectedCoupon?.id === coupon.id" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#27AE60" stroke-width="3">
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              </div>
            </div>
          </div>
          <div
            class="coupon-item"
            :class="{ 'coupon-selected': selectedCoupon === null }"
            @click="selectCoupon(null)"
            style="margin-top: 12px; background: #f5f5f5; border: 1px dashed #ddd"
          >
            <div style="flex: 1">
              <div class="text-sm">不使用优惠券</div>
            </div>
            <div class="coupon-checkbox" :style="{ borderColor: selectedCoupon === null ? '#27AE60' : '#ddd' }">
              <svg v-if="selectedCoupon === null" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#27AE60" stroke-width="3">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cartApi, orderApi, couponApi } from '@/api'
import type { CartData, Coupon } from '@/types'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()
const { incrementRefreshToken } = cartStore

const cartData = ref<CartData>({ items: [], totalAmount: 0 })
const checkingOut = ref(false)
const availableCoupons = ref<Coupon[]>([])
const selectedCoupon = ref<Coupon | null>(null)
const showCouponSelector = ref(false)

// 计算最终金额
const finalAmount = computed(() => {
  if (!selectedCoupon.value) {
    return cartData.value.totalAmount
  }
  const discount = selectedCoupon.value.amount || 0
  return Math.max(0, cartData.value.totalAmount - discount)
})

onMounted(() => {
  fetchCart()
  fetchAvailableCoupons()
})

const fetchCart = async () => {
  try {
    const res = await cartApi.getCart()
    cartData.value = res.data
  } catch (error) {
    console.error('Failed to fetch cart:', error)
  }
}

const fetchAvailableCoupons = async () => {
  try {
    const res = await couponApi.getCoupons('available', 'user001')
    availableCoupons.value = res.data.filter((coupon: Coupon) => {
      return coupon.minAmount <= cartData.value.totalAmount
    })
  } catch (error) {
    console.error('Failed to fetch coupons:', error)
  }
}

const updateQuantity = async (productId: string, quantity: number) => {
  try {
    await cartApi.addToCart({ productId, quantity })
    await fetchCart()
    await fetchAvailableCoupons()
    incrementRefreshToken()
  } catch (error) {
    console.error('Failed to update cart:', error)
    alert('更新失败')
  }
}

const selectCoupon = (coupon: Coupon | null) => {
  selectedCoupon.value = coupon
  showCouponSelector.value = false
}

const handleCheckout = async () => {
  if (cartData.value.items.length === 0) {
    alert('购物车为空')
    return
  }

  const confirmText = selectedCoupon.value
    ? `确认结算 ¥${finalAmount.value} 吗？(已使用优惠券减免¥${selectedCoupon.value.amount})`
    : `确认结算 ¥${finalAmount.value} 吗？`

  if (!confirm(confirmText)) {
    return
  }

  checkingOut.value = true
  try {
    const res = await orderApi.checkout({
      couponId: selectedCoupon.value?.id,
      userId: 'user001'
    })
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

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: #fff;
  border-radius: 16px;
  width: 85%;
  max-width: 320px;
  overflow: hidden;
}

.dialog-coupon {
  max-width: 380px;
}

.dialog-header {
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.dialog-body {
  padding: 20px 16px;
}

.dialog-body-scrollable {
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
}

.coupon-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #fff5f5, #fff);
  border: 2px solid #ffccc7;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.coupon-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.coupon-selected {
  border-color: #27AE60 !important;
  background: linear-gradient(135deg, #f0fdf4, #fff);
}

.coupon-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}
</style>
