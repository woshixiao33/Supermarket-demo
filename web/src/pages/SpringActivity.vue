<template>
  <div class="page activity-page" style="background: #f5f5f5">
    <!-- 顶部导航栏 -->
    <header class="activity-header">
      <button class="nav-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div class="header-title">春节囤货大赏</div>
      <button class="nav-btn" @click="handleShare">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>
    </header>

    <!-- 活动头部横幅 -->
    <section class="activity-banner">
      <div class="banner-content">
        <div class="main-title">寅旧卯新 春归鲜到</div>
        <div class="sub-title">满 199 减 50 领券再降</div>
      </div>

      <!-- 优惠券卡片 -->
      <div class="coupons-container">
        <!-- 50元优惠券 -->
        <div class="coupon-card coupon-red">
          <div class="coupon-content">
            <div class="coupon-amount">¥50</div>
            <div class="coupon-threshold">满 299 可用</div>
          </div>
          <button
            v-if="!couponStatus.coupon50Received"
            class="coupon-btn coupon-btn-red"
            @click="receiveCoupon(50)"
          >
            立即领取
          </button>
          <button v-else class="coupon-btn coupon-btn-disabled">
            已领取
          </button>
        </div>

        <!-- 20元优惠券 -->
        <div class="coupon-card coupon-orange">
          <div class="coupon-content">
            <div class="coupon-amount">¥20</div>
            <div class="coupon-threshold">满 129 可用</div>
          </div>
          <button
            v-if="!couponStatus.coupon20Received"
            class="coupon-btn coupon-btn-orange"
            @click="receiveCoupon(20)"
          >
            立即领取
          </button>
          <button v-else class="coupon-btn coupon-btn-disabled">
            已领取
          </button>
        </div>
      </div>
    </section>

    <!-- 商品列表 -->
    <section class="goods-section">
      <div class="goods-grid">
        <div
          v-for="product in goodsList"
          :key="product.id"
          class="goods-card"
          @click="navigateToProduct(product.id)"
        >
          <div class="goods-image-wrapper">
            <img :src="product.image" :alt="product.name" class="goods-image" />
          </div>
          <div class="goods-name">{{ product.name }}</div>
          <div class="goods-price-row">
            <div class="goods-price">¥{{ product.price.toFixed(1) }}</div>
            <div class="goods-tag">年货价</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 分享弹窗 -->
    <div v-if="showSharePanel" class="overlay" @click="showSharePanel = false">
      <div class="share-panel" @click.stop>
        <div class="share-title">分享到</div>
        <div class="share-options">
          <div class="share-option">
            <div class="share-icon" style="background: #07c160">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M8.5,13.5A1.5,1.5 0 1,1 10,15A1.5,1.5 0 0,1 8.5,13.5M12,2A1.5,1.5 0 1,1 10.5,3.5A1.5,1.5 0 0,1 12,2M15.5,13.5A1.5,1.5 0 1,1 14,15A1.5,1.5 0 0,1 15.5,13.5M12,2V7.5"/>
              </svg>
            </div>
            <div class="share-label">微信好友</div>
          </div>
          <div class="share-option">
            <div class="share-icon" style="background: #07c160">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12,2C10.89,2 10,2.89 10,4V8H14V4C14,2.89 13.11,2 12,2M4,6C2.89,6 2,6.89 2,8V12H6V8C6,6.89 5.11,6 4,6M20,6C18.89,6 18,6.89 18,8V12H22V8C22,6.89 21.11,6 20,6M2,14V18C2,19.11 2.89,20 4,20H6V14H2M14,20V16H10V20H14M18,20C19.11,20 20,19.11 20,18V14H16V20H18Z"/>
              </svg>
            </div>
            <div class="share-label">朋友圈</div>
          </div>
          <div class="share-option">
            <div class="share-icon" style="background: #3b82f6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.13C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.35 15.06,5.69 15.17,6L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18A3,3 0 0,0 15,21A3,3 0 0,0 18,24A3,3 0 0,0 21,21A3,3 0 0,0 18,18Z"/>
              </svg>
            </div>
            <div class="share-label">复制链接</div>
          </div>
        </div>
        <button class="share-cancel" @click="showSharePanel = false">取消</button>
      </div>
    </div>

    <!-- 提示弹窗 -->
    <div v-if="showToast" class="toast" :class="{ 'toast-success': toastType === 'success', 'toast-error': toastType === 'error' }">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

const router = useRouter()
const goodsList = ref<any[]>([])
const couponStatus = ref({ coupon50Received: false, coupon20Received: false })
const showSharePanel = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const userId = ref('user001')

onMounted(() => {
  fetchGoodsList()
  fetchCouponStatus()
})

const fetchGoodsList = async () => {
  try {
    const res = await api.get<any[]>('/goods/list?activityId=CNY2026')
    console.log('Goods list response:', res)

    // res.data 可能直接是数组，也可能是 { code: 0, data: [...] } 格式
    let goodsData = res.data
    if (goodsData && typeof goodsData === 'object' && 'code' in goodsData) {
      goodsData = goodsData.data || []
    }

    goodsList.value = Array.isArray(goodsData) ? goodsData : []
  } catch (error) {
    console.error('Failed to fetch goods list:', error)
    showToastMsg('商品加载失败，请重试', 'error')
  }
}

const fetchCouponStatus = async () => {
  try {
    const res = await api.get<any>(`/coupon/status?userId=${userId.value}`)
    console.log('Coupon status response:', res)

    // res.data 可能是直接的 status 对象，也可能是嵌套在 data 字段中
    let statusData = res.data
    // 如果 res.data 有 code 字段，说明还没提取 data，需要从 data 中获取
    if (statusData && typeof statusData === 'object' && 'code' in statusData) {
      statusData = statusData.data || {}
    }

    couponStatus.value = {
      coupon50Received: !!statusData?.coupon50Received,
      coupon20Received: !!statusData?.coupon20Received
    }
  } catch (error) {
    console.error('Failed to fetch coupon status:', error)
  }
}

const receiveCoupon = async (couponType: number) => {
  try {
    const res = await api.post<any>('/coupon/receive', {
      couponType,
      userId: userId.value
    })

    console.log('Receive coupon response:', res)

    // api 模块会自动提取 data 字段，所以 res.data 可能是 { received: true }
    // 或者是完整的响应对象 { code: 0, msg: 'success', data: { received: true } }
    const data = res.data || {}
    const isReceived = data.received === true

    if (isReceived) {
      // 领取成功
      if (couponType === 50) {
        couponStatus.value.coupon50Received = true
      } else {
        couponStatus.value.coupon20Received = true
      }
      showToastMsg('领取成功', 'success')
    } else if (data.code === 1001) {
      showToastMsg('您已领取过该优惠券', 'error')
    } else {
      showToastMsg(data.msg || '领取失败', 'error')
    }
  } catch (error) {
    console.error('Failed to receive coupon:', error)
    showToastMsg('网络错误，请重试', 'error')
  }
}

const showToastMsg = (msg: string, type: 'success' | 'error') => {
  toastMessage.value = msg
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

const goBack = () => {
  router.back()
}

const handleShare = () => {
  showSharePanel.value = true
}

const navigateToProduct = (id: string) => {
  router.push(`/product/${id}`)
}
</script>

<style scoped>
.activity-page {
  min-height: 100vh;
}

/* 顶部导航栏 */
.activity-header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 430px;
  width: 100%;
  height: 44px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 100;
  border-bottom: 1px solid #f0f0f0;
}

.nav-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #333;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 活动头部横幅 */
.activity-banner {
  background: #E63946;
  padding: 20px 16px;
  padding-top: 64px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.banner-content {
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
}

.main-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.sub-title {
  font-size: 16px;
  font-weight: 400;
}

/* 优惠券卡片 */
.coupons-container {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 350px;
}

.coupon-card {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  border: 2px solid;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.coupon-red {
  border-color: #E63946;
}

.coupon-orange {
  border-color: #FF7A00;
}

.coupon-content {
  text-align: center;
  margin-bottom: 12px;
}

.coupon-amount {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.coupon-red .coupon-amount {
  color: #E63946;
}

.coupon-orange .coupon-amount {
  color: #FF7A00;
}

.coupon-threshold {
  font-size: 14px;
  font-weight: 400;
}

.coupon-red .coupon-threshold {
  color: #E63946;
}

.coupon-orange .coupon-threshold {
  color: #FF7A00;
}

.coupon-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  width: 100%;
}

.coupon-btn-red {
  background: #E63946;
}

.coupon-btn-orange {
  background: #FF7A00;
}

.coupon-btn-disabled {
  background: #999;
  cursor: not-allowed;
}

/* 商品列表 */
.goods-section {
  padding: 20px 16px;
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.goods-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.goods-card:active {
  transform: scale(0.98);
}

.goods-image-wrapper {
  width: 100%;
  aspect-ratio: 1;
  background: #f5f5f5;
}

.goods-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-name {
  padding: 12px 12px 4px;
  font-size: 16px;
  font-weight: 400;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.goods-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 12px;
}

.goods-price {
  font-size: 20px;
  font-weight: 600;
  color: #E63946;
}

.goods-tag {
  background: #FDE2E2;
  color: #E63946;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 400;
}

/* 分享面板 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.share-panel {
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding: 20px 16px;
}

.share-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.share-options {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-bottom: 20px;
}

.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.share-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-label {
  font-size: 12px;
  color: #666;
}

.share-cancel {
  width: 100%;
  padding: 12px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

/* 提示弹窗 */
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px 24px;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.toast-success {
  background: rgba(39, 174, 96, 0.9);
}

.toast-error {
  background: rgba(230, 57, 70, 0.9);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
