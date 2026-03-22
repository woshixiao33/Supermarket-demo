<template>
  <div class="page">
    <section class="section">
      <div class="section-header">
        <div class="section-title">消息中心</div>
      </div>

      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="messages.length === 0" class="empty">暂无消息</div>
      <div v-else class="flex-column" style="gap: 12px">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="card"
          style="cursor: pointer"
          :style="{ opacity: msg.isRead ? 0.6 : 1 }"
          @click="markAsRead(msg.id)"
        >
          <div class="flex-between" style="margin-bottom: 8px">
            <div class="text-sm" style="font-weight: 600">
              {{ msg.title }}
            </div>
            <div class="text-xs text-hint">
              {{ formatTime(msg.createdAt) }}
            </div>
          </div>
          <div class="text-sm text-secondary">{{ msg.content }}</div>
          <div class="flex-center" style="gap: 8px; margin-top: 8px">
            <span
              style="font-size: 12px; padding: 2px 8px; border-radius: 4px; background: #f0f0f0"
            >
              {{ msg.type === 'system' ? '系统' : msg.type === 'order' ? '订单' : '活动' }}
            </span>
            <span
              v-if="!msg.isRead"
              style="width: 6px; height: 6px; border-radius: 50%; background: var(--color-danger)"
            ></span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { messageApi } from '@/api'
import type { Message } from '@/types'

const messages = ref<Message[]>([])
const loading = ref(true)

onMounted(() => {
  fetchMessages()
})

const fetchMessages = async () => {
  try {
    const res = await messageApi.getMessages()
    messages.value = res.data
  } catch (error) {
    console.error('Failed to fetch messages:', error)
  } finally {
    loading.value = false
  }
}

const markAsRead = async (id: string) => {
  try {
    await messageApi.markAsRead(id)
    messages.value = messages.value.map((msg: any) =>
      msg.id === id ? { ...msg, isRead: true } : msg
    )
  } catch (error) {
    console.error('Failed to mark as read:', error)
  }
}

const formatTime = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return new Date(timestamp).toLocaleDateString()
}
</script>
