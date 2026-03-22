<template>
  <div v-if="showChat" class="page" style="display: flex; flex-direction: column; height: 100%">
    <div class="flex-center mb-12" style="justify-content: flex-start; gap: 8px">
      <button class="btn btn-sm btn-secondary" @click="showChat = false" style="padding: 8px 16px">
        ← 返回
      </button>
      <span class="text-sm">在线客服</span>
    </div>

    <div
      style="flex: 1; overflow-y: auto; background: #f5f5f5; border-radius: 12px; padding: 12px; margin-bottom: 12px"
    >
      <div v-if="chatHistory.length === 0" class="empty" style="padding: 20px">暂无聊天记录</div>
      <div
        v-for="msg in chatHistory"
        :key="msg.id"
        :class="['flex-center mb-8', msg.role === 'user' ? 'flex-end' : 'flex-start']"
      >
        <div
          class="text-sm"
          :style="{
            maxWidth: '80%',
            padding: '10px 12px',
            borderRadius: '12px',
            background: msg.role === 'user' ? 'var(--color-primary)' : '#fff',
            color: msg.role === 'user' ? '#fff' : '#333',
            wordBreak: 'break-word'
          }"
        >
          {{ msg.content }}
        </div>
      </div>
    </div>

    <div class="flex-center" style="gap: 8px">
      <input
        v-model="message"
        type="text"
        placeholder="输入消息..."
        @keydown.enter="!sending && handleSendMessage()"
      />
      <button
        class="btn btn-primary"
        @click="handleSendMessage"
        :disabled="sending || !message.trim()"
      >
        发送
      </button>
    </div>
  </div>

  <div v-else class="page">
    <button class="btn btn-primary btn-lg mb-12" @click="showChat = true">
      💬 联系在线客服
    </button>

    <div class="section">
      <div class="section-header">
        <div class="section-title">常见问题</div>
      </div>

      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="faqList.length === 0" class="empty">暂无常见问题</div>
      <div v-else class="flex-column">
        <div
          v-for="faq in faqList"
          :key="faq.id"
          class="card mb-8"
          style="cursor: pointer"
          @click="expandedFaq = expandedFaq === faq.id ? null : faq.id"
        >
          <div class="flex-between">
            <div class="text-sm" style="font-weight: 600">
              {{ faq.question }}
            </div>
            <span style="font-size: 12px">{{ expandedFaq === faq.id ? '▲' : '▼' }}</span>
          </div>
          <div v-if="expandedFaq === faq.id" class="text-sm text-secondary mt-8">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { customerServiceApi } from '@/api'
import type { FAQ, ChatMessage } from '@/types'

const faqList = ref<FAQ[]>([])
const chatHistory = ref<ChatMessage[]>([])
const message = ref('')
const loading = ref(true)
const sending = ref(false)
const showChat = ref(false)
const expandedFaq = ref<string | null>(null)

onMounted(() => {
  fetchFAQ()
  fetchChatHistory()
})

const fetchFAQ = async () => {
  loading.value = true
  try {
    const res = await customerServiceApi.getFAQ()
    faqList.value = res.data
  } catch (error) {
    console.error('Failed to fetch FAQ:', error)
  } finally {
    loading.value = false
  }
}

const fetchChatHistory = async () => {
  try {
    const res = await customerServiceApi.getChatHistory()
    chatHistory.value = res.data
  } catch (error) {
    console.error('Failed to fetch chat history:', error)
  }
}

const handleSendMessage = async () => {
  if (!message.value.trim()) return

  const userMsg: ChatMessage = {
    id: Date.now(),
    role: 'user',
    content: message.value,
    time: Date.now()
  }

  chatHistory.value.push(userMsg)
  const currentMessage = message.value
  message.value = ''
  sending.value = true

  try {
    await customerServiceApi.sendMessage(currentMessage)
    setTimeout(() => {
      fetchChatHistory()
    }, 1200)
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    sending.value = false
  }
}
</script>
