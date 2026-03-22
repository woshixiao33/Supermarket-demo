<template>
  <div class="page">
    <section class="section">
      <div class="section-header">
        <div class="section-title">收货地址</div>
        <div class="section-more" @click="router.push('/address/new')">
          添加地址
        </div>
      </div>

      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="addresses.length === 0" class="empty">暂无收货地址</div>
      <div v-else class="flex-column" style="gap: 12px">
        <div
          v-for="addr in addresses"
          :key="addr.id"
          class="card"
          :style="{ border: addr.isDefault ? '2px solid var(--color-primary)' : 'none' }"
        >
          <div class="flex-between" style="margin-bottom: 8px">
            <div class="text-sm" style="font-weight: 600">
              {{ addr.name }}
            </div>
            <div v-if="addr.isDefault" style="font-size: 12px; color: var(--color-primary); padding: 2px 6px; background: #E8F8F5; border-radius: 4px">
              默认
            </div>
          </div>
          <div class="text-sm text-secondary" style="margin-bottom: 4px">
            {{ addr.phone }}
          </div>
          <div class="text-sm text-secondary">
            {{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}
          </div>
          <div class="flex-center" style="gap: 8px; margin-top: 8px">
            <button class="btn btn-sm btn-secondary" @click="router.push(`/address/${addr.id}/edit`)">
              编辑
            </button>
            <button class="btn btn-sm btn-danger" @click="handleDelete(addr.id)">
              删除
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
import { addressApi } from '@/api'
import type { Address } from '@/types'

const router = useRouter()
const addresses = ref<Address[]>([])
const loading = ref(true)

onMounted(() => {
  fetchAddresses()
})

const fetchAddresses = async () => {
  try {
    const res = await addressApi.getAddresses()
    addresses.value = res.data
  } catch (error) {
    console.error('Failed to fetch addresses:', error)
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('确定删除该地址吗？')) return

  try {
    await addressApi.deleteAddress(id)
    addresses.value = addresses.value.filter(addr => addr.id !== id)
  } catch (error) {
    console.error('Failed to delete address:', error)
    alert('删除失败')
  }
}
</script>
