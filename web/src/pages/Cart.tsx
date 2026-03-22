import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartApi, orderApi } from '@/api';
import type { CartData } from '@/types';
import { useCartStore } from '@/store/cartStore';

export default function Cart() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState<CartData>({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const incrementRefreshToken = useCartStore((state) => state.incrementRefreshToken);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await cartApi.getCart();
      setCartData(res.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      await cartApi.addToCart({ productId, quantity });
      await fetchCart();
      incrementRefreshToken();
    } catch (error) {
      console.error('Failed to update cart:', error);
      alert('更新失败');
    }
  };

  const handleCheckout = async () => {
    if (cartData.items.length === 0) {
      alert('购物车为空');
      return;
    }

    if (!confirm(`确认结算 ¥${cartData.totalAmount} 吗？`)) {
      return;
    }

    setCheckingOut(true);
    try {
      const res = await orderApi.checkout();
      if (res.data.success) {
        incrementRefreshToken();
        navigate(`/payment-result/${res.data.orderId}`);
      }
    } catch (error) {
      console.error('Failed to checkout:', error);
      alert('结算失败');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {cartData.items.length === 0 ? (
          <div className="empty">
            <div>购物车还是空的~</div>
            <button className="btn btn-primary mt-12" onClick={() => navigate('/home')}>
              去逛逛
            </button>
          </div>
        ) : (
          cartData.items.map((item) => (
            <div key={item.productId} className="card mb-8">
              <div className="flex-between" style={{ gap: 12 }}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${item.productId}`)}
                />
                <div style={{ flex: 1 }}>
                  <div
                    className="text-sm"
                    style={{ fontWeight: 600, marginBottom: 4, cursor: 'pointer' }}
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    {item.product.name}
                  </div>
                  <div className="text-xs text-secondary mb-8">
                    {item.product.tags?.join(' · ')}
                  </div>
                  <div className="flex-between">
                    <div className="text-sm price">¥{item.product.price}</div>
                    <div className="flex-center" style={{ gap: 8 }}>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="text-sm" style={{ minWidth: 24, textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cartData.items.length > 0 && (
        <div className="card" style={{ padding: '12px 16px' }}>
          <div className="flex-between mb-12">
            <div className="text-sm">
              共 {cartData.items.reduce((sum, item) => sum + item.quantity, 0)} 件商品
            </div>
            <div className="text-sm" style={{ fontWeight: 600 }}>
              合计：¥{cartData.totalAmount}
            </div>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleCheckout}
            disabled={checkingOut}
          >
            {checkingOut ? '结算中...' : '去结算'}
          </button>
        </div>
      )}
    </div>
  );
}
