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
      const res = await userApi.getUser()
      user.value = res.data
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
