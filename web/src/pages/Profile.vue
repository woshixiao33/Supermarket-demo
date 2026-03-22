<template>
  <div class="page">
    <div v-if="loading" class="loading">加载中...</div>

    <section v-else-if="user" class="section">
      <div class="flex-between" style="margin-bottom: 16px">
        <div class="flex-center" style="gap: 12px">
          <div style="position: relative">
            <img
              :src="user.avatar"
              alt="头像"
              class="avatar"
              @click="fileInput?.click()"
              :style="{ opacity: uploading ? 0.5 : 1 }"
            />
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleFileChange"
            />
            <div v-if="uploading" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #fff; background: rgba(0,0,0,0.5); border-radius: 50%">
              上传中
            </div>
          </div>
          <div>
            <div style="font-size: 18px; font-weight: 600">{{ user.username }}</div>
            <div style="font-size: 12px; color: #999; margin-top: 4px">{{ user.memberLevel }}</div>
          </div>
        </div>
        <div class="flex-center" style="gap: 16px">
          <div @click="router.push('/messages')">
            <span style="font-size: 20px">💬</span>
          </div>
          <div>
            <span style="font-size: 20px">⚙️</span>
          </div>
        </div>
      </div>

      <div class="grid-3">
        <div class="flex-column flex-center" style="padding: 12px 0; cursor: pointer">
          <div style="font-size: 20px; font-weight: 700">{{ user.points }}</div>
          <div style="font-size: 12px; color: #999">积分</div>
        </div>
        <div class="flex-column flex-center" style="padding: 12px 0; cursor: pointer" @click="router.push('/coupons')">
          <div style="font-size: 20px; font-weight: 700">{{ user.coupons }}</div>
          <div style="font-size: 12px; color: #999">优惠券</div>
        </div>
        <div class="flex-column flex-center" style="padding: 12px 0; cursor: pointer">
          <div style="font-size: 20px; font-weight: 700">¥{{ user.balance }}</div>
          <div style="font-size: 12px; color: #999">余额</div>
        </div>
      </div>
    </section>

    <div v-else class="empty">暂无用户信息</div>

    <section class="section">
      <div class="section-header">
        <div class="section-title">我的订单</div>
        <div class="section-more" @click="router.push('/orders')">
          查看全部
        </div>
      </div>
      <div class="grid-4">
        <div
          v-for="action in orderActions"
          :key="action.label"
          class="flex-column flex-center"
          style="padding: 12px 0; cursor: pointer; position: relative"
          @click="router.push(action.path)"
        >
          <span style="font-size: 24px">{{ action.icon }}</span>
          <span style="font-size: 12px; color: #666; margin-top: 4px">{{ action.label }}</span>
          <span
            v-if="action.count > 0"
            style="position: absolute; top: 8px; right: 8px; background: var(--color-danger); color: #fff; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; display: flex; align-items: center; justify-content: center"
          >
            {{ action.count }}
          </span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <div class="section-title">快捷功能</div>
      </div>
      <div class="grid-2">
        <div
          v-for="action in quickActions"
          :key="action.label"
          class="flex-center card"
          style="padding: 16px 12px; cursor: pointer; gap: 8px"
          @click="action.path !== '#' && router.push(action.path)"
        >
          <span style="font-size: 24px">{{ action.icon }}</span>
          <span style="font-size: 14px; color: #666">{{ action.label }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { orderApi, userApi } from '@/api'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { user } = userStore

const router = useRouter()
const userStore = useUserStore()
const { user } = userStore

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const loading = ref(true)
const orderCounts = ref({
  pending: 0,
  paid: 0,
  shipped: 0,
  received: 0,
  refund: 0
})

onMounted(() => {
  loadUserData()
  fetchOrderCounts()
})

watch(() => route.path, (newPath) => {
  if (newPath === '/profile') {
    loadUserData()
    fetchOrderCounts()
  }
})

const loadUserData = async () => {
  loading.value = true
  try {
    await userStore.fetchUser()
  } catch (error) {
    console.error('Failed to load user data:', error)
  } finally {
    loading.value = false
  }
}

const fetchOrderCounts = async () => {
  try {
    const orders = (await orderApi.getOrders()).data
    const counts = {
      pending: 0,
      paid: 0,
      shipped: 0,
      received: 0,
      refund: 0
    }
    orders.forEach((order: any) => {
      if (order.status === '待付款') counts.pending++
      else if (order.status === '已支付') counts.paid++
      else if (order.status === '待收货') counts.shipped++
      else if (order.status === '待评价') counts.received++
      else if (order.status === '退换/售后') counts.refund++
    })
    orderCounts.value = counts
  } catch (error) {
    console.error('Failed to fetch order counts:', error)
  }
}

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  const formData = new FormData()
  formData.append('avatar', file)

  uploading.value = true
  try {
    await userApi.uploadAvatar(formData)
    await userStore.fetchUser()
    alert('头像修改成功')
  } catch (error) {
    console.error('Upload failed:', error)
    alert('头像上传失败，请重试')
  } finally {
    uploading.value = false
  }
}

const quickActions = [
  { icon: '📍', label: '收货地址', path: '/address' },
  { icon: '❤️', label: '我的收藏', path: '/favorites' },
  { icon: '🎁', label: '邀请有礼', path: '#' },
  { icon: '💬', label: '客服中心', path: '/customer-service' }
]

const orderActions = computed(() => [
  { icon: '💳', label: '待付款', count: orderCounts.value.pending, path: '/orders?status=pending' },
  { icon: '📦', label: '待收货', count: orderCounts.value.shipped, path: '/orders?status=shipped' },
  { icon: '⭐', label: '待评价', count: orderCounts.value.received, path: '/orders?status=received' },
  { icon: '🔄', label: '退换/售后', count: orderCounts.value.refund, path: '/orders?status=refund' }
])
</script>
