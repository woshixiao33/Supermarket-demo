<template>
  <div class="page category-page" style="background: #f5f5f5">
    <!-- 顶部导航栏 -->
    <header class="category-header">
      <button class="nav-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div class="header-title">{{ pageTitle }}</div>
      <button class="nav-btn" style="opacity: 0">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>
    </header>

    <!-- 分类筛选 -->
    <section v-if="showCategories" class="category-section">
      <div class="category-grid">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="category-item"
          :class="{ 'category-item-active': selectedCategoryId === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <span>{{ cat.name }}</span>
        </div>
      </div>
    </section>

    <!-- 商品列表 -->
    <section class="goods-section">
      <div class="goods-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="goods-card" @click="navigateToProduct(product.id)">
          <div class="goods-image-wrapper">
            <img :src="product.image" :alt="product.name" class="goods-image" />
            <div v-if="product.tag" class="goods-tag-badge">{{ product.tag }}</div>
          </div>
          <div class="goods-name">{{ product.name }}</div>
          <div class="goods-price-row">
            <div class="goods-price">¥{{ product.price.toFixed(2) }}</div>
            <button class="goods-cart-btn" @click.stop="handleAddToCart(product.id)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
                <path d="M9 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2" />
                <path d="M20 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div v-if="filteredProducts.length === 0" class="empty-state">
        <div class="empty-text">暂无相关商品</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productApi, cartApi } from '@/api'
import type { Product, Category } from '@/types'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const { incrementRefreshToken } = cartStore

const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const selectedCategoryId = ref<string | null>(null)
const searchKeyword = ref<string>('')

onMounted(() => {
  fetchData()
  const categoryId = route.query.categoryId as string
  const search = route.query.search as string
  if (categoryId) {
    selectedCategoryId.value = categoryId
  }
  if (search) {
    searchKeyword.value = search
  }
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

const selectCategory = (categoryId: string) => {
  selectedCategoryId.value = categoryId
}

const navigateToProduct = (productId: string) => {
  router.push(`/product/${productId}`)
}

const goBack = () => {
  router.back()
}

const filteredProducts = computed(() => {
  return products.value.filter((product: any) => {
    const matchesCategory = !selectedCategoryId.value || product.categoryId === selectedCategoryId.value
    const matchesSearch = !searchKeyword.value || searchKeywords.value.some((keyword: string) =>
      product.name.includes(keyword) ||
      (product.tags && product.tags.some((tag: string) => tag.includes(keyword))) ||
      (product.tag && product.tag.includes(keyword))
    )
    return matchesCategory && matchesSearch
  })
})

const searchKeywords = computed(() => {
  if (!searchKeyword.value) return []
  return searchKeyword.value.split(/\s+/).filter(k => k)
})

const pageTitle = computed(() => {
  if (searchKeyword.value) {
    return searchKeyword.value
  }
  if (selectedCategoryId.value) {
    const category = categories.value.find(c => c.id === selectedCategoryId.value)
    return category?.name || '商品列表'
  }
  return '商品列表'
})

const showCategories = computed(() => {
  // 只有在通过 categoryId 进入时才显示分类筛选
  return route.query.categoryId && categories.value.length > 0
})
</script>

<style scoped>
.category-page {
  min-height: 100vh;
}

/* 顶部导航栏 */
.category-header {
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 分类筛选 */
.category-section {
  padding: 60px 16px 12px;
  background: #fff;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.category-item {
  padding: 10px 4px;
  cursor: pointer;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  color: #666;
  transition: all 0.2s ease;
}

.category-item-active {
  background: #27AE60;
  color: #fff;
}

/* 商品列表 */
.goods-section {
  padding: 12px 16px;
  padding-bottom: 20px;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.goods-card:active {
  transform: scale(0.98);
}

.goods-image-wrapper {
  width: 100%;
  aspect-ratio: 1;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
}

.goods-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-tag-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  z-index: 10;
}

.goods-tag-badge:nth-child(n) {
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
}

.goods-name {
  padding: 10px 12px 4px;
  font-size: 14px;
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
  padding: 4px 12px 12px;
}

.goods-price {
  font-size: 18px;
  font-weight: 600;
  color: #E63946;
}

.goods-cart-btn {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: none;
  background: #27AE60;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.goods-cart-btn:active {
  background: #219150;
}

/* 空状态 */
.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-text {
  font-size: 14px;
  color: #999;
}
</style>
