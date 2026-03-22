import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productApi, cartApi } from '@/api';
import type { Product, Category } from '@/types';
import { useCartStore } from '@/store/cartStore';

export default function Category() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const incrementRefreshToken = useCartStore((state) => state.incrementRefreshToken);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryId && selectedCategory !== categoryId) {
      setSelectedCategory(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await productApi.getCategories();
      setCategories(res.data);
      if (!selectedCategory && res.data.length > 0) {
        setSelectedCategory(res.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async (catId: string) => {
    setLoading(true);
    try {
      const res = await productApi.getProducts({ categoryId: catId });
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await cartApi.addToCart({ productId, quantity: 1 });
      incrementRefreshToken();
      alert('已加入购物车');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('添加失败');
    }
  };

  return (
    <div className="page" style={{ display: 'flex', gap: 8, padding: 12 }}>
      <aside style={{ width: 90, flexShrink: 0, background: '#fff', borderRadius: 12, padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`text-sm ${selectedCategory === cat.id ? 'text-primary' : 'text-secondary'}`}
            style={{
              padding: '10px 8px',
              borderRadius: 8,
              cursor: 'pointer',
              background: selectedCategory === cat.id ? '#E8F8F5' : 'transparent',
              fontWeight: selectedCategory === cat.id ? 600 : 400,
            }}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </div>
        ))}
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div className="loading">加载中...</div>
        ) : products.length === 0 ? (
          <div className="empty">暂无商品</div>
        ) : (
          <div className="grid-2">
            {products.map((product) => (
              <div key={product.id} className="card">
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', borderRadius: 8, marginBottom: 8 }}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
                <div
                  className="text-sm"
                  style={{ fontWeight: 600, marginBottom: 4, cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.name}
                </div>
                <div className="text-xs text-secondary mb-8">
                  库存：{product.stock}
                </div>
                <div className="flex-between">
                  <div className="text-sm price">¥{product.price}</div>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    加入购物车
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
