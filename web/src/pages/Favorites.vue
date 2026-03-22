<template>
  <div class="page">
    <section class="section">
      <div class="section-header">
        <div class="section-title">我的收藏</div>
      </div>

      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="favoriteProducts.length === 0" class="empty">暂无收藏商品</div>
      <div v-else class="grid-2">
        <div v-for="product in favoriteProducts" :key="product.id" class="card">
          <div class="product-image-container">
            <img
              :src="product.image"
              :alt="product.name"
              @click="router.push(`/product/${product.id}`)"
            />
          </div>
          <div
            class="text-sm"
            style="font-weight: 600; margin-bottom: 4px; cursor: pointer"
            @click="router.push(`/product/${product.id}`)"
          >
            {{ product.name }}
          </div>
          <div class="text-xs text-secondary" style="margin-bottom: 8px">
            {{ product.tags?.join(' · ') }}
          </div>
          <div class="flex-between">
            <div class="text-sm price">¥{{ product.price }}</div>
            <button
              class="btn btn-sm btn-primary"
              @click="handleRemoveFavorite(product.id)"
            >
              取消收藏
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { favoriteApi, productApi } from '@/api'
import type { Product } from '@/types'

const router = useRouter()
const favoriteProducts = ref<Product[]>([])
const loading = ref(true)

onMounted(() => {
  fetchFavorites()
})

const fetchFavorites = async () => {
  try {
    const favRes = await favoriteApi.getFavorites()
    const prodRes = await productApi.getProducts()

    const products = prodRes.data as Product[]
    favoriteProducts.value = products.filter(p => favRes.data.includes(p.id))
  } catch (error) {
    console.error('Failed to fetch favorites:', error)
  } finally {
    loading.value = false
  }
}

const handleRemoveFavorite = async (productId: string) => {
  try {
    await favoriteApi.removeFavorite(productId)
    favoriteProducts.value = favoriteProducts.value.filter((p: any) => p.id !== productId)
  } catch (error) {
    console.error('Failed to remove favorite:', error)
    alert('取消收藏失败')
  }
}
</script>

<style scoped>
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
