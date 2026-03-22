<template>
  <div class="page" style="padding-bottom: 0">
    <header style="background: linear-gradient(135deg, #27AE60, #2ECC71); padding: 16px; color: #fff">
      <div style="display: flex; gap: 8px; align-items: center">
        <select
          v-model="currentLocation"
          style="flex: 1; background: rgba(255, 255, 255, 0.2); border: none; border-radius: 8px; padding: 12px 12px 12px 16px; color: #fff; font-size: 14px; font-weight: 600; outline: none; cursor: pointer"
          @change="handleLocationChange"
        >
          <option v-for="loc in LOCATIONS" :key="loc.id" :value="loc.id">
            {{ loc.name }}
          </option>
        </select>
        <div style="flex: 2; position: relative">
          <input
            v-model="searchValue"
            type="text"
            placeholder="搜索商品分类..."
            style="width: 100%; padding: 12px 40px 12px 16px; border: none; border-radius: 8px; font-size: 14px; outline: none; color: #333"
            @keydown.enter="handleSearch"
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #27AE60; cursor: pointer"
            @click="handleSearch"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
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
  { id: '1', name: '北京市朝阳区', desc: '三里屯店' },
  { id: '2', name: '北京市海淀区', desc: '中关村店' },
  { id: '3', name: '北京市西城区', desc: '金融街店' }
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

const selectedLocation = computed(() => LOCATIONS.find(l => l.id === currentLocation.value) || LOCATIONS[0])

onMounted(() => {
  fetchData()
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
