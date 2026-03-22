<template>
  <div class="page" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px">
    <div style="font-size: 64px; margin-bottom: 20px">🎉</div>
    <div style="font-size: 24px; font-weight: 600; margin-bottom: 8px">支付成功</div>
    <div class="text-sm text-secondary" style="margin-bottom: 8px">
      订单号：{{ orderId }}
    </div>
    <div class="text-sm text-secondary" style="margin-bottom: 32px">
      感谢您的购买，我们将尽快为您发货
    </div>

    <button class="btn btn-primary btn-lg" @click="router.push('/orders')">
      查看订单
    </button>
    <button class="btn btn-secondary btn-lg" @click="router.push('/home')" style="margin-top: 12px">
      继续购物
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const orderId = route.params.orderId as string

onMounted(() => {
  console.log('Payment successful for order:', orderId)
})
</script>
