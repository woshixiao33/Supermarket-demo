<template>
  <div class="page" style="display: flex; flex-direction: column; height: 100%">
    <div style="flex: 1; overflow-y: auto">
      <img
        :src="product.image"
        :alt="product.name"
        style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px"
      />

      <div class="card mt-12">
        <div style="font-size: 20px; font-weight: 600; margin-bottom: 8px">{{ product.name }}</div>
        <div style="font-size: 24px; color: var(--color-danger); font-weight: 700; margin-bottom: 8px">
          ¥{{ product.price }}
        </div>
        <div class="text-sm text-secondary">{{ product.desc }}</div>

        <div class="flex-center mt-12" style="gap: 8px; flex-wrap: wrap">
          <span
            v-for="(tag, index) in product.tags"
            :key="index"
            style="background: #E8F8F5; color: var(--color-primary); padding: 4px 12px; border-radius: 12px; font-size: 12px"
          >
            {{ tag }}
          </span>
        </div>

        <div class="mt-12 text-sm text-secondary">库存：{{ product.stock }} 件</div>
      </div>
    </div>

    <div class="card" style="padding: 12px 16px">
      <div class="flex-between">
        <div class="flex-center" style="gap: 8px">
          <button class="btn btn-sm btn-secondary" @click="quantity = Math.max(1, quantity - 1)">
            -
          </button>
          <span class="text-sm" style="min-width: 40px; text-align: center">
            {{ quantity }}
          </span>
          <button class="btn btn-sm btn-secondary" @click="quantity = Math.min(product.stock, quantity + 1)">
            +
          </button>
        </div>

        <div class="flex-center" style="gap: 8px">
          <button class="btn btn-sm btn-secondary" @click="router.push('/cart')">
            购物车
          </button>
          <button class="btn btn-primary" style="padding: 12px 24px" @click="handleAddToCart">
            加入购物车
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productApi, cartApi } from '@/api'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const { incrementRefreshToken } = cartStore

const product = ref<Product | null>(null)
const quantity = ref(1)

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    fetchProduct(id)
  }
})

const fetchProduct = async (productId: string) => {
  try {
    const res = await productApi.getProduct(productId)
    product.value = res.data
  } catch (error) {
    console.error('Failed to fetch product:', error)
  }
}

const handleAddToCart = async () => {
  if (!product.value) return

  try {
    await cartApi.addToCart({ productId: product.value.id, quantity: quantity.value })
    incrementRefreshToken()
    alert('已加入购物车')
  } catch (error) {
    console.error('Failed to add to cart:', error)
    alert('添加失败')
  }
}
</script>
