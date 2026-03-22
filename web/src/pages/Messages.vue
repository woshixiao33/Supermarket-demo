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
          class="message-card"
          :class="{ read: msg.isRead }"
          @click="markAsRead(msg.id)"
        >
          <div class="message-header">
            <div class="message-title">{{ msg.title }}</div>
            <div class="message-time">{{ formatTime(msg.createdAt) }}</div>
          </div>
          <div class="message-content">{{ msg.content }}</div>
          <div class="message-footer">
            <span class="message-tag">
              {{ msg.type === 'system' ? '系统' : msg.type === 'order' ? '订单' : '活动' }}
            </span>
            <span v-if="!msg.isRead" class="message-dot"></span>
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

<style scoped>
.message-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid transparent;
}

.message-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary);
}

.message-card.read {
  opacity: 0.6;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.message-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-content {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
}

.message-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-tag {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 4px;
  background: #f0f0f0;
  color: #666;
}

.message-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-danger);
  margin-left: auto;
}
</style>
