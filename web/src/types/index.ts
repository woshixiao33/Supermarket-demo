export interface Product {
  id: string
  name: string
  price: number
  stock: number
  categoryId: string
  image: string
  tags: string[]
  desc: string
}

export interface Category {
  id: string
  name: string
}

export interface CartItem {
  productId: string
  quantity: number
  product: Product
}

export interface CartData {
  items: CartItem[]
  totalAmount: number
}

export interface Order {
  orderId: string
  items: CartItem[]
  totalAmount: number
  status: string
  previewName: string
  previewImage: string
  itemCount: number
  createdAt: number
}

export interface User {
  id: string
  username: string
  avatar: string
  memberLevel: string
  points: number
  coupons: number
  balance: number
}

export interface Address {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

export interface Message {
  id: string
  type: 'system' | 'order' | 'activity'
  title: string
  content: string
  isRead: boolean
  createdAt: number
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface ChatMessage {
  id: string | number
  role: 'user' | 'assistant'
  content: string
  time: number
}

export interface Coupon {
  id: string
  title: string
  amount: number
  minAmount: number
  category: string
  status: 'available' | 'used' | 'expired'
  validUntil: number
  description: string
}
