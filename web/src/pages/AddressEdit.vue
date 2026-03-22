<template>
  <div class="page">
    <form @submit.prevent="handleSubmit" class="card">
      <div class="flex-column" style="gap: 16px">
        <div>
          <label class="text-sm text-secondary mb-8">收货人</label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="请输入收货人姓名"
          />
        </div>

        <div>
          <label class="text-sm text-secondary mb-8">手机号</label>
          <input
            v-model="formData.phone"
            type="tel"
            placeholder="请输入手机号"
          />
        </div>

        <div>
          <label class="text-sm text-secondary mb-8">省份</label>
          <input
            v-model="formData.province"
            type="text"
            placeholder="请输入省份"
          />
        </div>

        <div>
          <label class="text-sm text-secondary mb-8">城市</label>
          <input
            v-model="formData.city"
            type="text"
            placeholder="请输入城市"
          />
        </div>

        <div>
          <label class="text-sm text-secondary mb-8">区县</label>
          <input
            v-model="formData.district"
            type="text"
            placeholder="请输入区县"
          />
        </div>

        <div>
          <label class="text-sm text-secondary mb-8">详细地址</label>
          <textarea
            v-model="formData.detail"
            placeholder="请输入详细地址"
            rows="3"
            style="resize: none"
          />
        </div>

        <label class="flex-center" style="gap: 8px; cursor: pointer">
          <input
            v-model="formData.isDefault"
            type="checkbox"
            style="width: auto; margin: 0"
          />
          <span class="text-sm">设为默认地址</span>
        </label>
      </div>

      <div class="flex-column mt-12" style="gap: 8px">
        <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
          {{ loading ? '保存中...' : '保存' }}
        </button>
        <button type="button" class="btn btn-secondary btn-lg" @click="router.push('/address')">
          取消
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { addressApi } from '@/api'

const router = useRouter()
const route = useRoute()
const id = route.params.id as string

const formData = ref({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})
const loading = ref(false)
const isEdit = !!id

onMounted(() => {
  if (id) {
    fetchAddress()
  }
})

const fetchAddress = async () => {
  try {
    const res = await addressApi.getAddresses()
    const address = res.data.find((a: any) => a.id === id)
    if (address) {
      formData.value = {
        name: address.name,
        phone: address.phone,
        province: address.province,
        city: address.city,
        district: address.district,
        detail: address.detail,
        isDefault: address.isDefault
      }
    }
  } catch (error) {
    console.error('Failed to fetch address:', error)
  }
}

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.phone || !formData.value.province || !formData.value.city || !formData.value.district || !formData.value.detail) {
    alert('请填写完整信息')
    return
  }

  loading.value = true
  try {
    if (isEdit) {
      await addressApi.updateAddress(id!, formData.value)
    } else {
      await addressApi.addAddress(formData.value)
    }
    router.push('/address')
  } catch (error) {
    console.error('Failed to save address:', error)
    alert('保存失败')
  } finally {
    loading.value = false
  }
}
</script>
