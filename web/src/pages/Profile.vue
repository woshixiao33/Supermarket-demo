<template>
  <div class="page profile-page">
    <div v-if="loading" class="loading">加载中...</div>

    <section v-else-if="user" class="user-header">
      <div class="flex-between" style="margin-bottom: 16px">
        <div class="flex-center" style="gap: 12px">
          <div style="position: relative" @click="handleClickAvatar">
            <img
              :src="user.avatar"
              alt="头像"
              class="avatar"
            />
            <div class="avatar-overlay">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #fff">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
          </div>
          <div style="color: #fff; flex: 1">
            <div
              class="username-row"
              @click="handleClickUsername"
            >
              <span class="username">{{ user.username }}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            <div style="font-size: 12px; color: rgba(255,255,255,0.8); margin-top: 4px">{{ user.memberLevel }}</div>
          </div>
        </div>
        <div class="flex-center" style="gap: 16px">
          <div @click="router.push('/messages')" style="position: relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #fff">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
          <div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #fff">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div v-if="showEditUsernameDialog" class="dialog-overlay" @click="showEditUsernameDialog = false">
        <div class="dialog" @click.stop>
          <div class="dialog-header">修改用户名</div>
          <div class="dialog-body">
            <input
              v-model="newUsername"
              type="text"
              placeholder="请输入新用户名"
              maxlength="20"
              class="dialog-input"
              @keyup.enter="handleUpdateUsername"
            />
            <div class="dialog-hint">用户名不能超过20个字符</div>
          </div>
          <div class="dialog-footer">
            <button class="dialog-btn dialog-btn-secondary" @click="showEditUsernameDialog = false">
              取消
            </button>
            <button class="dialog-btn dialog-btn-primary" @click="handleUpdateUsername">
              确认
            </button>
          </div>
        </div>
      </div>

      <div v-if="showUploadAvatarDialog" class="dialog-overlay" @click="showUploadAvatarDialog = false">
        <div class="dialog" @click.stop>
          <div class="dialog-header">上传头像</div>
          <div class="dialog-body">
            <div class="avatar-upload-area" @click="fileInput?.click()">
              <img v-if="avatarPreview" :src="avatarPreview" class="avatar-preview" alt="预览" />
              <div v-else class="avatar-placeholder">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#27AE60" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span>点击选择图片</span>
              </div>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleAvatarFileChange"
            />
            <div v-if="!avatarPreview" class="dialog-hint">支持 JPG、PNG 格式，文件大小不超过 2MB</div>
          </div>
          <div class="dialog-footer">
            <button class="dialog-btn dialog-btn-secondary" @click="showUploadAvatarDialog = false">
              取消
            </button>
            <button
              class="dialog-btn dialog-btn-primary"
              :disabled="!avatarPreview || uploading"
              @click="handleUploadAvatar"
            >
              {{ uploading ? '上传中...' : '确认上传' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="showAlert" class="dialog-overlay" @click="showAlert = false">
        <div class="dialog dialog-alert" @click.stop>
          <div class="alert-icon">{{ alertType === 'success' ? '✓' : '!' }}</div>
          <div class="alert-message">{{ alertMessage }}</div>
          <button class="dialog-btn dialog-btn-primary" style="width: 100%" @click="showAlert = false">
            确定
          </button>
        </div>
      </div>

      <div class="grid-3" style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 16px 0">
        <div class="flex-column flex-center" style="cursor: pointer">
          <div style="font-size: 18px; font-weight: 700; color: #fff">{{ user.points }}</div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.8)">积分</div>
        </div>
        <div class="flex-column flex-center" style="cursor: pointer" @click="router.push('/coupons')">
          <div style="font-size: 18px; font-weight: 700; color: #fff">{{ user.coupons }}</div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.8)">优惠券</div>
        </div>
        <div class="flex-column flex-center" style="cursor: pointer">
          <div style="font-size: 18px; font-weight: 700; color: #fff">¥{{ user.balance }}</div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.8)">余额</div>
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
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const loading = ref(true)
const showEditUsernameDialog = ref(false)
const showUploadAvatarDialog = ref(false)
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref<'success' | 'error'>('success')
const newUsername = ref('')
const avatarPreview = ref('')
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
    console.log('开始加载用户数据...')
    await userStore.fetchUser()
    console.log('用户数据加载完成:', userStore.user)
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

const handleClickAvatar = () => {
  showUploadAvatarDialog.value = true
  avatarPreview.value = ''
}

const handleClickUsername = () => {
  showEditUsernameDialog.value = true
  newUsername.value = user.value?.username || ''
}

const handleAvatarFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showAlert.value = true
    alertMessage.value = '请选择图片文件'
    alertType.value = 'error'
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    showAlert.value = true
    alertMessage.value = '图片大小不能超过2MB'
    alertType.value = 'error'
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleUploadAvatar = async () => {
  if (!fileInput.value?.files?.[0]) return

  const formData = new FormData()
  formData.append('avatar', fileInput.value.files[0])

  uploading.value = true
  try {
    await userApi.uploadAvatar(formData)
    await userStore.fetchUser()
    showUploadAvatarDialog.value = false
    avatarPreview.value = ''
    showAlert.value = true
    alertMessage.value = '头像上传成功'
    alertType.value = 'success'
  } catch (error) {
    console.error('Upload failed:', error)
    showAlert.value = true
    alertMessage.value = '头像上传失败，请重试'
    alertType.value = 'error'
  } finally {
    uploading.value = false
  }
}

const handleUpdateUsername = async () => {
  const trimmedUsername = newUsername.value.trim()

  if (!trimmedUsername) {
    showAlert.value = true
    alertMessage.value = '用户名不能为空'
    alertType.value = 'error'
    return
  }

  if (trimmedUsername.length > 20) {
    showAlert.value = true
    alertMessage.value = '用户名不能超过20个字符'
    alertType.value = 'error'
    return
  }

  try {
    await userApi.updateUsername(trimmedUsername)
    await userStore.fetchUser()
    showEditUsernameDialog.value = false
    newUsername.value = ''
    showAlert.value = true
    alertMessage.value = '用户名修改成功'
    alertType.value = 'success'
  } catch (error) {
    console.error('Update username failed:', error)
    showAlert.value = true
    alertMessage.value = '用户名修改失败，请重试'
    alertType.value = 'error'
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

<style scoped>
.profile-page {
  padding-top: 0;
}

.user-header {
  background: linear-gradient(135deg, #27AE60, #2ECC71);
  padding: 24px 16px;
  color: #fff;
  border-radius: 0 0 24px 24px;
  margin: -12px -12px 12px -12px;
}

.user-header .avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid rgba(255,255,255,0.5);
  transition: transform 0.2s ease;
}

.user-header .avatar:hover {
  transform: scale(1.05);
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0 0 28px 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.user-header > div > div:hover .avatar-overlay {
  opacity: 1;
}

.username-row {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.username {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

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
  animation: fadeIn 0.2s ease;
}

.dialog {
  background: #fff;
  border-radius: 16px;
  width: 85%;
  max-width: 320px;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.dialog-alert {
  text-align: center;
  padding: 24px 20px;
}

.dialog-alert .dialog-btn {
  display: block;
  margin: 0 auto;
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

.dialog-footer {
  display: flex;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
}

.dialog-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.dialog-input:focus {
  border-color: var(--color-primary);
}

.dialog-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.dialog-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.dialog-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dialog-btn:active {
  opacity: 0.8;
}

.dialog-btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.dialog-btn-primary {
  background: var(--color-primary);
  color: #fff;
  margin-left: 12px;
}

.dialog-btn-primary:not(:disabled):hover {
  opacity: 0.9;
}

.avatar-upload-area {
  width: 100%;
  height: 160px;
  border: 2px dashed #e8e8e8;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.avatar-upload-area:hover {
  border-color: var(--color-primary);
  background: rgba(39, 174, 96, 0.02);
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #999;
  font-size: 13px;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.alert-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  margin: 0 auto 16px;
  background: var(--color-primary);
  color: #fff;
}

.alert-message {
  font-size: 15px;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
