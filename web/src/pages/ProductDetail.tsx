import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi, cartApi } from '@/api';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const incrementRefreshToken = useCartStore((state) => state.incrementRefreshToken);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    try {
      const res = await productApi.getProduct(productId);
      setProduct(res.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await cartApi.addToCart({ productId: product.id, quantity });
      incrementRefreshToken();
      alert('已加入购物车');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('添加失败');
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (!product) {
    return <div className="empty">商品不存在</div>;
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 12 }}
        />

        <div className="card mt-12">
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{product.name}</div>
          <div style={{ fontSize: 24, color: 'var(--color-danger)', fontWeight: 700, marginBottom: 8 }}>
            ¥{product.price}
          </div>
          <div className="text-sm text-secondary">{product.desc}</div>

          <div className="flex-center mt-12" style={{ gap: 8, flexWrap: 'wrap' }}>
            {product.tags?.map((tag, index) => (
              <span
                key={index}
                style={{
                  background: '#E8F8F5',
                  color: 'var(--color-primary)',
                  padding: '4px 12px',
                  borderRadius: 12,
                  fontSize: 12,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-12 text-sm text-secondary">库存：{product.stock} 件</div>
        </div>
      </div>

      <div className="card" style={{ padding: '12px 16px' }}>
        <div className="flex-between">
          <div className="flex-center" style={{ gap: 8 }}>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span className="text-sm" style={{ minWidth: 40, textAlign: 'center' }}>
              {quantity}
            </span>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            >
              +
            </button>
          </div>

          <div className="flex-center" style={{ gap: 8 }}>
            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/cart')}>
              购物车
            </button>
            <button
              className="btn btn-primary"
              style={{ padding: '12px 24px' }}
              onClick={handleAddToCart}
            >
              加入购物车
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
