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
          :class="{ 'coupon-used': coupon.status === 'used', 'coupon-expired': coupon.status === 'expired' }"
        >
          <div class="coupon-amount">
            <span>¥{{ coupon.amount }}</span>
          </div>
          <div class="coupon-info">
            <div class="coupon-title">{{ coupon.title }}</div>
            <div class="coupon-desc">满¥{{ coupon.minAmount }}可用 · {{ coupon.category }}</div>
            <div class="coupon-date">有效期至：{{ formatDate(coupon.validUntil) }}</div>
          </div>
          <div v-if="coupon.status === 'used'" class="coupon-status used">已使用</div>
          <div v-if="coupon.status === 'expired'" class="coupon-status expired">已过期</div>
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
  return coupons.value.filter((coupon: any) => coupon.status === activeTab.value)
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
  display: flex;
  align-items: center;
  gap: 16px;
}

.coupon-card.coupon-used,
.coupon-card.coupon-expired {
  background: linear-gradient(135deg, #F5F5F5, #FFF);
  border-color: #E8E8E8;
}

.coupon-card.coupon-used .coupon-amount,
.coupon-card.coupon-expired .coupon-amount {
  background: linear-gradient(135deg, #E8E8E8, #F0F0F0);
  border-color: #D0D0D0;
}

.coupon-card.coupon-used .coupon-amount span,
.coupon-card.coupon-expired .coupon-amount span {
  color: #999;
}

.coupon-card.coupon-used .coupon-title,
.coupon-card.coupon-expired .coupon-title {
  color: #999;
}

.coupon-card.coupon-used .coupon-desc,
.coupon-card.coupon-expired .coupon-desc {
  color: #CCC;
}

.coupon-card.coupon-used .coupon-date,
.coupon-card.coupon-expired .coupon-date {
  color: #BBB;
}

.coupon-card.coupon-used::after,
.coupon-card.coupon-expired::after {
  color: rgba(0, 0, 0, 0.05);
}

.coupon-amount {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #FFE5E5, #FFF0F0);
  border-radius: 50%;
  border: 2px dashed #FFD1D1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coupon-amount span {
  color: #E74C3C;
  font-weight: 700;
  font-size: 24px;
}

.coupon-info {
  flex: 1;
  min-width: 0;
}

.coupon-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.coupon-desc {
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
}

.coupon-date {
  font-size: 11px;
  color: #999;
}

.coupon-status {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 4px;
}

.coupon-status.used {
  background: #F0F0F0;
  color: #999;
  border: 1px solid #D0D0D0;
}

.coupon-status.expired {
  background: #FFF0F0;
  color: #999;
  border: 1px solid #FFD1D1;
}

.coupon-card::after {
  content: '券';
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 48px;
  color: rgba(231, 76, 60, 0.1);
  font-weight: 700;
  pointer-events: none;
  line-height: 1;
}
</style>
