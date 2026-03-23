import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type {
  Product,
  Category,
  CartData,
  Order,
  User,
  Address,
  Message,
  FAQ,
  ChatMessage,
  Coupon
} from '@/types'

const instance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000
})

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance

export interface ApiResponse<T> {
  data: T
  success: boolean
}

const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.get<any, ApiResponse<T>>(url, config).then((res) => {
      const responseData = res.data as any
      // 支持 code: 0 和 code: 200 两种格式
      const hasData = responseData.hasOwnProperty('data')
      const isSuccess = responseData.code === 0 || responseData.code === 200
      return {
        data: isSuccess && hasData ? responseData.data : responseData,
        success: isSuccess
      }
    }),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.post<any, ApiResponse<T>>(url, data, config).then((res) => {
      const responseData = res.data as any
      // 支持 code: 0 和 code: 200 两种格式
      const hasData = responseData.hasOwnProperty('data')
      const isSuccess = responseData.code === 0 || responseData.code === 200
      return {
        data: isSuccess && hasData ? responseData.data : responseData,
        success: isSuccess
      }
    }),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.put<any, ApiResponse<T>>(url, data, config).then((res) => {
      const responseData = res.data as any
      // 支持 code: 0 和 code: 200 两种格式
      const hasData = responseData.hasOwnProperty('data')
      const isSuccess = responseData.code === 0 || responseData.code === 200
      return {
        data: isSuccess && hasData ? responseData.data : responseData,
        success: isSuccess
      }
    }),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<any, ApiResponse<T>>(url, config).then((res) => {
      const responseData = res.data as any
      // 支持 code: 0 和 code: 200 两种格式
      const hasData = responseData.hasOwnProperty('data')
      const isSuccess = responseData.code === 0 || responseData.code === 200
      return {
        data: isSuccess && hasData ? responseData.data : responseData,
        success: isSuccess
      }
    })
}

export const productApi = {
  getCategories: () => api.get<Category[]>('/categories'),
  getProducts: () => api.get<Product[]>('/products'),
  getProduct: (id: string) => api.get<Product>(`/products/${id}`)
}

export const cartApi = {
  getCart: () => api.get<CartData>('/cart'),
  addToCart: (data: { productId: string; quantity: number }) => api.post('/cart', data),
  updateCartItem: (productId: string, quantity: number) => api.post('/cart', { productId, quantity }),
  removeFromCart: (productId: string) => api.delete(`/cart/${productId}`)
}

export const orderApi = {
  getOrders: (params?: { status?: string }) => api.get<Order[]>('/orders', { params }),
  checkout: (data?: { couponId?: string }) => api.post<{ orderId: string; totalAmount: number; couponDiscount: number }>('/checkout', data)
}

export const userApi = {
  getUser: () => api.get<User>('/user/info'),
  uploadAvatar: (formData: FormData) => api.post<{ avatar: string }>('/user/avatar', formData),
  updateUsername: (username: string) => api.put<{ username: string }>('/user/username', { username })
}

export const addressApi = {
  getAddresses: () => api.get<Address[]>('/addresses'),
  addAddress: (data: Partial<Address>) => api.post('/addresses', data),
  updateAddress: (id: string, data: Partial<Address>) => api.put(`/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/addresses/${id}`)
}

export const messageApi = {
  getMessages: () => api.get<Message[]>('/messages'),
  markAsRead: (id: string) => api.put(`/messages/${id}/read`)
}

export const favoriteApi = {
  getFavorites: () => api.get<string[]>('/favorites'),
  addFavorite: (productId: string) => api.post('/favorites', { productId }),
  removeFavorite: (productId: string) => api.delete(`/favorites/${productId}`)
}

export const customerServiceApi = {
  getFAQ: () => api.get<FAQ[]>('/customer-service/faq'),
  getChatHistory: () => api.get<ChatMessage[]>('/customer-service/chat'),
  sendMessage: (message: string) => api.post('/customer-service/chat', { message })
}

export const couponApi = {
  getCoupons: (status?: string, userId?: string) => {
    const params: any = {}
    if (status) params.status = status
    if (userId) params.userId = userId
    return api.get<Coupon[]>('/coupons', Object.keys(params).length > 0 ? { params } : undefined)
  }
}
