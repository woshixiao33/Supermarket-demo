import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', redirect: '/home' },
      { path: 'home', component: () => import('@/pages/Home.vue') },
      { path: 'category', component: () => import('@/pages/Category.vue') },
      { path: 'product/:id', component: () => import('@/pages/ProductDetail.vue') },
      { path: 'cart', component: () => import('@/pages/Cart.vue') },
      { path: 'profile', component: () => import('@/pages/Profile.vue') },
      { path: 'messages', component: () => import('@/pages/Messages.vue') },
      { path: 'orders', component: () => import('@/pages/Orders.vue') },
      { path: 'coupons', component: () => import('@/pages/Coupons.vue') },
      { path: 'address', component: () => import('@/pages/AddressList.vue') },
      { path: 'address/new', component: () => import('@/pages/AddressEdit.vue') },
      { path: 'address/:id/edit', component: () => import('@/pages/AddressEdit.vue') },
      { path: 'favorites', component: () => import('@/pages/Favorites.vue') },
      { path: 'customer-service', component: () => import('@/pages/CustomerService.vue') },
      { path: 'payment-result/:orderId', component: () => import('@/pages/PaymentResult.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
