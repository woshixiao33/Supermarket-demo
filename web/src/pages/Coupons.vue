<template>
  <div class="page">
    <section class="section">
      <div class="flex-center" style="gap: 8px; margin-bottom: 12px">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          :class="['btn btn-sm', activeTab === tab.value ? 'btn-primary' : 'btn-secondary']"
          @click="activeTab = tab.value"
          style="white-space: nowrap"
        >
          {{ tab.label }}
        </div>
      </div>

      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="filteredCoupons.length === 0" class="empty">
        {{ activeTab === 'available' ? '暂无可用优惠券' : activeTab === 'used' ? '暂无已使用优惠券' : '暂无已过期优惠券' }}
      </div>
      <div v-else class="flex-column" style="gap: 12px">
        <div
          v-for="coupon in filteredCoupons"
          :key="coupon.id"
          class="coupon-card"
        >
          <div class="flex-center" style="gap: 8">
            <div class="flex-center coupon-amount">
              <span style="font-size: 24px; font-weight: 700; color: #E74C3C">
                ¥{{ coupon.amount }}
              </span>
            </div>
            <div style="flex: 1">
              <div class="text-sm" style="font-weight: 600; margin-bottom: 4px">
                {{ coupon.title }}
              </div>
              <div class="text-xs text-secondary" style="margin-bottom: 4px">
                满¥{{ coupon.minAmount }}可用 · {{ coupon.category }}
              </div>
              <div class="text-xs text-hint">
                有效期至：{{ formatDate(coupon.validUntil) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { couponApi } from '@/api'
import type { Coupon } from '@/types'

const coupons = ref<Coupon[]>([])
const loading = ref(true)
const activeTab = ref<'available' | 'used' | 'expired'>('available')

const tabs = [
  { label: '可使用', value: 'available' as const },
  { label: '已使用', value: 'used' as const },
  { label: '已过期', value: 'expired' as const }
]

onMounted(() => {
  fetchCoupons()
})

const fetchCoupons = async () => {
  try {
    const res = await couponApi.getCoupons()
    coupons.value = res.data
  } catch (error) {
    console.error('Failed to fetch coupons:', error)
  } finally {
    loading.value = false
  }
}

const filteredCoupons = computed(() => {
  return coupons.value.filter(coupon => coupon.status === activeTab.value)
})

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}
</script>

<style scoped>
.coupon-card {
  background: linear-gradient(135deg, #FFF5F5, #FFF);
  border: 1px solid #FFE4E1;
  border-radius: 12px;
  padding: 16px;
  position: relative;
  overflow: hidden;
}

.coupon-amount {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #FFE5E5, #FFF0F0);
  border-radius: 50%;
  border: 2px dashed #FFD1D1;
}

.coupon-card::after {
  content: '';
  position: absolute;
  bottom: 12px;
  right: 12px;
  font-size: 48px;
  color: rgba(231, 76, 60, 0.1);
  font-weight: 700;
  pointer-events: none;
}
</style>
