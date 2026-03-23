import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userApi, couponApi } from '@/api'

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

      // 获取实际的优惠券数量
      await fetchCouponCount()
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const fetchCouponCount = async () => {
    try {
      // 获取可用的优惠券数量，传递 userId 以包含春节活动领取的优惠券
      const res = await couponApi.getCoupons('available', 'user001')
      const availableCoupons = res.data || []
      if (user.value) {
        user.value.coupons = availableCoupons.length
        console.log('优惠券数量更新为:', user.value.coupons)
      }
    } catch (error) {
      console.error('Failed to fetch coupon count:', error)
    }
  }

  const updateUser = (userData: User) => {
    user.value = userData
  }

  return {
    user,
    fetchUser,
    fetchCouponCount,
    updateUser
  }
})
