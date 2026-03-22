import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Category from '@/pages/Category';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Profile from '@/pages/Profile';
import Messages from '@/pages/Messages';
import Orders from '@/pages/Orders';
import AddressList from '@/pages/AddressList';
import AddressEdit from '@/pages/AddressEdit';
import Favorites from '@/pages/Favorites';
import CustomerService from '@/pages/CustomerService';
import Coupons from '@/pages/Coupons';
import PaymentResult from '@/pages/PaymentResult';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';

function App() {
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchCart();
    fetchUser();
  }, [fetchCart, fetchUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Outlet /></Layout>}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="category" element={<Category />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<Messages />} />
          <Route path="orders" element={<Orders />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="address" element={<AddressList />} />
          <Route path="address/new" element={<AddressEdit />} />
          <Route path="address/:id/edit" element={<AddressEdit />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="customer-service" element={<CustomerService />} />
          <Route path="payment-result/:orderId" element={<PaymentResult />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
