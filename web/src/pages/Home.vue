<template>
  <div class="page home-page">
    <header class="home-header">
      <div style="display: flex; gap: 12px; align-items: center; height: 32px">
        <div style="display: flex; align-items: center; gap: 4px; cursor: pointer; position: relative; padding-right: 20px; min-width: 0; flex-shrink: 0" @click="$refs.locationSelect?.focus()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27AE60" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span style="font-size: 13px; font-weight: 500; color: #333; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
            {{ selectedLocation.name }}{{ selectedLocation.desc ? ' · ' + selectedLocation.desc : '' }}
          </span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="3" style="position: absolute; right: 0; top: 50%; transform: translateY(-50%)">
            <path d="M6 9l6 6 6-6"></path>
          </svg>
          <select
            ref="locationSelect"
            v-model="currentLocation"
            style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none"
            @change="handleLocationChange"
          >
            <option v-for="loc in LOCATIONS" :key="loc.id" :value="loc.id">
              {{ loc.name }}{{ loc.desc ? ' · ' + loc.desc : '' }}
            </option>
          </select>
        </div>
        <div style="flex: 1; position: relative; min-width: 0">
          <input
            v-model="searchValue"
            type="text"
            placeholder="搜索商品..."
            style="width: 100%; height: 32px; padding: 0 12px 0 34px; border: 1px solid #e8e8e8; border-radius: 16px; font-size: 13px; outline: none; color: #333; background: #f5f5f5"
            @keydown.enter="handleSearch"
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%)">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <div
          style="position: relative; cursor: pointer; padding: 4px; flex-shrink: 0"
          @click="router.push('/messages')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span v-if="unreadCount > 0" style="position: absolute; top: 0; right: 0; min-width: 14px; height: 14px; background: #ff4d4f; border-radius: 7px; font-size: 10px; color: #fff; display: flex; align-items: center; justify-content: center; padding: 0 3px; border: 2px solid #fff">
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        </div>
      </div>
    </header>

    <section style="padding: 12px; background: var(--color-bg)">
      <div style="position: relative; width: 100%; height: 160px; border-radius: 12px; overflow: hidden; margin-bottom: 12px">
        <img
          v-for="(img, index) in BANNER_IMAGES"
          :key="index"
          :src="img"
          :alt="'Banner ' + (index + 1)"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: currentBanner === index ? 1 : 0; transition: opacity 0.5s ease"
        />
        <div style="position: absolute; bottom: 12px; left: 0; right: 0; display: flex; justify-content: center; gap: 6px">
          <div
            v-for="(_, index) in BANNER_IMAGES"
            :key="index"
            :style="{ width: currentBanner === index ? '16px' : '6px', height: '6px', borderRadius: '3px', background: currentBanner === index ? '#27AE60' : 'rgba(255, 255, 255, 0.5)', transition: 'all 0.3s ease' }"
          ></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <div class="section-title">商品分类</div>
      </div>
      <div class="grid-4">
        <div
          v-for="cat in categories.slice(0, 8)"
          :key="cat.id"
          class="flex-column flex-center category-item"
          @click="navigateToCategory(cat.id)"
        >
          <span style="font-size: 12px; text-align: center">{{ cat.name }}</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <div class="section-title">热门商品</div>
      </div>
      <div class="grid-2">
        <div v-for="product in products" :key="product.id" class="card">
          <div class="product-image-container">
            <img
              :src="product.image"
              :alt="product.name"
              @click="navigateToProduct(product.id)"
            />
          </div>
          <div
            class="text-sm"
            style="font-weight: 600; margin-bottom: 4px; cursor: pointer"
            @click="navigateToProduct(product.id)"
          >
            {{ product.name }}
          </div>
          <div class="text-xs text-secondary" style="margin-bottom: 8px">
            {{ product.tags?.join(' · ') }}
          </div>
          <div class="flex-between">
            <div class="text-sm price">¥{{ product.price }}</div>
            <button class="btn btn-sm btn-primary" @click="handleAddToCart(product.id)">
              加入购物车
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { productApi, cartApi } from '@/api'
import type { Product, Category } from '@/types'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()
const { incrementRefreshToken } = cartStore

const LOCATIONS = [
  { id: '1', name: '三里屯SOHO', desc: 'A座' },
  { id: '2', name: '中关村大厦', desc: 'B座' },
  { id: '3', name: '金融街购物中心', desc: 'C座' },
  { id: '4', name: '国贸大厦', desc: '一期' },
  { id: '5', name: '望京SOHO', desc: 'T1' }
]

const BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
  'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80',
  'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=800&q=80',
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80'
]

const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const currentLocation = ref(LOCATIONS[0].id)
const searchValue = ref('')
const currentBanner = ref(0)
const unreadCount = ref(0)

const selectedLocation = computed(() => LOCATIONS.find(l => l.id === currentLocation.value) || LOCATIONS[0])

onMounted(() => {
  fetchData()
  fetchUnreadCount()
  const bannerInterval = setInterval(() => {
    currentBanner.value = (currentBanner.value + 1) % BANNER_IMAGES.length
  }, 3000)
  return () => clearInterval(bannerInterval)
})

const fetchData = async () => {
  try {
    const [catsRes, prodsRes] = await Promise.all([
      productApi.getCategories(),
      productApi.getProducts()
    ])
    categories.value = catsRes.data
    products.value = prodsRes.data
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

const fetchUnreadCount = async () => {
  try {
    const messages = await productApi.getMessages()
    unreadCount.value = messages.data.filter((m: any) => !m.read).length
  } catch (error) {
    console.error('Failed to fetch messages:', error)
  }
}

const handleAddToCart = async (productId: string) => {
  try {
    await cartApi.addToCart({ productId, quantity: 1 })
    incrementRefreshToken()
    alert('已加入购物车')
  } catch (error) {
    console.error('Failed to add to cart:', error)
    alert('添加失败')
  }
}

const handleSearch = () => {
  if (searchValue.value.trim()) {
    router.push(`/category?search=${encodeURIComponent(searchValue.value.trim())}`)
  }
}

const handleLocationChange = () => {
  console.log('Location changed:', selectedLocation.value)
}

const navigateToCategory = (categoryId: string) => {
  router.push(`/category?categoryId=${categoryId}`)
}

const navigateToProduct = (productId: string) => {
  router.push(`/product/${productId}`)
}
</script>

<style scoped>
.home-page {
  padding-bottom: 0;
  padding-top: 56px;
}

.home-header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background: #fff;
  padding: 12px 16px;
  color: #333;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 430px;
}

.category-item {
  padding: 8px 4px;
  cursor: pointer;
  background: #f5f5f5;
  border-radius: 8px;
}

.product-image-container {
  width: 100%;
  padding-top: 100%;
  position: relative;
  margin-bottom: 8px;
  overflow: hidden;
  border-radius: 8px;
}

.product-image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}
</style>
