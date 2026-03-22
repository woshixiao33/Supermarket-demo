<template>
  <div class="page">
    <div class="flex-center" style="gap: 8px; margin-bottom: 12px; overflow-x: auto; padding: 0 4px">
      <div
        v-for="tab in tabs"
        :key="tab.value"
        :class="['btn btn-sm', selectedStatus === tab.value ? 'btn-primary' : 'btn-secondary']"
        @click="selectedStatus = tab.value"
        style="white-space: nowrap; background: selectedStatus === tab.value ? 'var(--color-primary)' : #f5f5f5; color: selectedStatus === tab.value ? #fff : #666; border: none"
      >
        {{ tab.label }}
      </div>
    </div>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="orders.length === 0" class="empty">暂无订单</div>
    <div v-else>
      <div v-for="order in orders" :key="order.orderId" class="card mb-8">
        <div class="flex-between" style="margin-bottom: 8px">
          <div class="text-sm" style="font-weight: 600">
            订单号：{{ order.orderId }}
          </div>
          <div
            class="text-sm"
            :style="{ color: order.status === '待付款' ? 'var(--color-danger)' : 'var(--color-primary)' }"
          >
            {{ order.status }}
          </div>
        </div>

        <div class="flex-between" style="margin-bottom: 8px">
          <div class="flex-center" style="gap: 8px">
            <img
              :src="order.previewImage"
              alt=""
              style="width: 60px; height: 60px; border-radius: 6px; object-fit: cover"
            />
            <div>
              <div class="text-sm" style="font-weight: 600; margin-bottom: 4px">
                {{ order.previewName }}
              </div>
              <div class="text-xs text-secondary">
                共 {{ order.itemCount || 0 }} 件商品
              </div>
            </div>
          </div>
          <div class="text-sm" style="font-weight: 600">
            ¥{{ order.totalAmount }}
          </div>
        </div>

        <div class="flex-between" style="padding-top: 12px; border-top: 1px solid #f0f0f0">
          <div class="text-xs text-hint">
            {{ new Date(order.createdAt).toLocaleString() }}
          </div>
          <div class="flex-center" style="gap: 8px">
            <button v-if="order.status === '待付款'" class="btn btn-sm btn-secondary">取消订单</button>
            <button v-if="order.status === '待付款'" class="btn btn-sm btn-primary">去付款</button>
            <button v-if="order.status === '待收货'" class="btn btn-sm btn-primary">确认收货</button>
            <button v-if="order.status === '待评价'" class="btn btn-sm btn-primary">去评价</button>
            <button v-if="order.status === '退换/售后'" class="btn btn-sm btn-secondary">查看进度</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { orderApi } from '@/api'
import type { Order } from '@/types'

const orders = ref<Order[]>([])
const loading = ref(true)
const selectedStatus = ref<string>('')

const tabs = [
  { label: '全部', value: '' },
  { label: '待付款', value: 'pending' },
  { label: '待收货', value: 'shipped' },
  { label: '待评价', value: 'received' },
  { label: '售后', value: 'refund' }
]

onMounted(() => {
  fetchOrders()
})

watch(selectedStatus, () => {
  fetchOrders()
})

const fetchOrders = async () => {
  loading.value = true
  try {
    const params = selectedStatus.value ? { status: selectedStatus.value } : undefined
    const res = await orderApi.getOrders(params)
    orders.value = res.data
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  } finally {
    loading.value = false
  }
}
</script>
