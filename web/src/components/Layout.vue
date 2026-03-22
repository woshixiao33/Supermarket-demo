<template>
  <div class="app-shell">
    <header v-if="showHeader" class="app-header">
      <div v-if="isSecondaryPage" class="back-button" @click="goBack">
        ←
      </div>
      <div class="header-title">{{ headerTitle }}</div>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <nav v-if="showTabBar" class="app-tabbar">
      <div
        v-for="item in tabItems"
        :key="item.path"
        :class="['tab-item', { active: isActive(item.path) }]"
        @click="navigate(item.path)"
      >
        <span v-html="item.icon"></span>
        <span>{{ item.label }}</span>
        <span v-if="item.showBadge && cartCount > 0" class="badge">{{ cartCount }}</span>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { RouterView } from 'vue-router'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const { cartCount } = cartStore

const tabItems = [
  { path: '/home', icon: '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>', label: '首页' },
  { path: '/category', icon: '<svg viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>', label: '分类' },
  { path: '/cart', icon: '<svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>', label: '购物车', showBadge: true },
  { path: '/profile', icon: '<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>', label: '我的' }
]

const isSecondaryPage = computed(() => {
  const mainPages = ['/home', '/category', '/cart', '/profile', '/']
  return !mainPages.includes(route.path)
})

const headerTitle = computed(() => {
  const path = route.path
  if (path === '/category') return '分类'
  if (path === '/cart') return '购物车'
  if (path === '/profile') return '我的'
  if (path === '/messages') return '消息中心'
  if (path === '/orders') return '我的订单'
  if (path === '/coupons') return '优惠券'
  if (path === '/address') return '收货地址'
  if (path.includes('/address')) return '编辑地址'
  if (path === '/favorites') return '我的收藏'
  if (path === '/customer-service') return '客服中心'
  if (path.startsWith('/product/')) return '商品详情'
  return '鲜生活'
})

const showHeader = computed(() => {
  return !route.path.startsWith('/payment-result')
})

const showTabBar = computed(() => {
  return ['/home', '/category', '/cart', '/profile'].includes(route.path) || route.path === '/'
})

const isActive = (path: string) => {
  return route.path === path || (path === '/home' && route.path === '/')
}

const navigate = (path: string) => {
  router.push(path)
}

const goBack = () => {
  router.back()
}
</script>
