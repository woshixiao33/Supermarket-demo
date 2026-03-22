import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi } from '@/api'

interface User {
  id: string
  username: string
  avatar: string
  memberLevel: string
  points: number
  coupons: number
  balance: number
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  const fetchUser = async () => {
    try {
      console.log('userApi.getUser() 调用中...')
      const res = await userApi.getUser()
      console.log('API响应:', res)
      user.value = res.data
      console.log('user.value 设置为:', user.value)
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const updateUser = (userData: User) => {
    user.value = userData
  }

  return {
    user,
    fetchUser,
    updateUser
  }
})
