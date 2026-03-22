<template>
  <div class="page">
    <section class="section">
      <div class="grid-4">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="category-item"
          @click="selectCategory(cat.id)"
        >
          <span style="font-size: 12px; text-align: center">{{ cat.name }}</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <div class="section-title">商品列表</div>
      </div>
      <div class="grid-2">
        <div v-for="product in filteredProducts" :key="product.id" class="card">
          <div class="product-image-container">
            <img :src="product.image" :alt="product.name" @click="navigateToProduct(product.id)" />
          </div>
          <div class="text-sm" style="font-weight: 600; margin-bottom: 4px; cursor: pointer" @click="navigateToProduct(product.id)">
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

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesCategory = !selectedCategoryId.value || product.categoryId === selectedCategoryId.value
    const matchesSearch = !searchKeyword.value || product.name.includes(searchKeyword.value)
    return matchesCategory && matchesSearch
  })
})
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
