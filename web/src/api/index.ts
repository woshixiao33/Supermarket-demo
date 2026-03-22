import axios from 'axios';
import type { ApiResponse, CartData, Order, User, Message, Address, Favorite, FAQ, ChatMessage } from '@/types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const productApi = {
  getCategories: () => api.get<any[]>('/categories').then(res => ({ data: res.data, success: true })),
  getProducts: (params?: { categoryId?: string; q?: string }) => api.get<any[]>('/products', { params }).then(res => ({ data: res.data, success: true })),
  getProduct: (id: string) => api.get<any>(`/products/${id}`).then(res => ({ data: res.data, success: true })),
};

export const cartApi = {
  getCart: () => api.get<CartData>('/cart').then(res => ({ data: res.data, success: true })),
  addToCart: (data: { productId: string; quantity: number }) => api.post('/cart', data).then(res => ({ data: res.data, success: true })),
};

export const orderApi = {
  checkout: () => api.post<{ success: boolean; orderId: string }>('/checkout').then(res => ({ data: res.data, success: res.data.success })),
  getOrders: (params?: { status?: string }) => api.get<any[]>('/orders', { params }).then(res => ({ data: res.data, success: true })),
};

export const userApi = {
  getUserInfo: () => api.get<any>('/user/info').then(res => ({ data: res.data.data, success: res.data.code === 200 })),
  uploadAvatar: (formData: FormData) => api.post<{ avatar: string }>('/user/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => ({ data: res.data.data, success: res.data.code === 200 })),
};

export const messageApi = {
  getMessages: (params?: { type?: string }) => api.get<any>('/messages', { params }).then(res => ({ data: res.data.data, success: res.data.code === 200 })),
  markAsRead: (id: string) => api.put(`/messages/${id}/read`).then(res => ({ data: res.data, success: res.data.code === 200 })),
  deleteMessages: (ids: string[]) => api.delete('/messages', { data: { ids } }).then(res => ({ data: res.data, success: res.data.code === 200 })),
};

export const addressApi = {
  getAddresses: () => api.get<any>('/addresses').then(res => ({ data: res.data.data, success: res.data.code === 200 })),
  addAddress: (data: Omit<Address, 'id'>) => api.post<any>('/addresses', data).then(res => ({ data: res.data.data, success: res.data.code === 200 })),
  updateAddress: (id: string, data: Partial<Address>) => api.put(`/addresses/${id}`, data).then(res => ({ data: res.data, success: res.data.code === 200 })),
  deleteAddress: (id: string) => api.delete(`/addresses/${id}`).then(res => ({ data: res.data, success: res.data.code === 200 })),
  setDefault: (id: string) => api.put(`/addresses/${id}/default`).then(res => ({ data: res.data, success: res.data.code === 200 })),
};

export const favoriteApi = {
  getFavorites: () => api.get<any>('/favorites').then(res => ({ data: res.data.data, success: res.data.code === 200 })),
  addFavorite: (productId: string) => api.post('/favorites', { productId }).then(res => ({ data: res.data, success: res.data.code === 200 })),
  deleteFavorite: (productId: string) => api.delete(`/favorites/${productId}`).then(res => ({ data: res.data, success: res.data.code === 200 })),
};

export const customerServiceApi = {
  getFAQ: () => api.get<any>('/customer-service/faq').then(res => ({ data: res.data.data, success: res.data.code === 200 })),
  sendMessage: (message: string) => api.post('/customer-service/chat', { message }).then(res => ({ data: res.data, success: res.data.code === 200 })),
  getChatHistory: () => api.get<any>('/customer-service/chat').then(res => ({ data: res.data.data, success: res.data.code === 200 })),
};

export const couponApi = {
  getCoupons: (params?: { status?: 'available' | 'used' | 'expired' }) => api.get<any[]>('/coupons', { params }).then(res => ({ data: res.data, success: true })),
};

export default api;
