import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi, cartApi } from '@/api';
import type { Product, Category } from '@/types';
import { useCartStore } from '@/store/cartStore';

const LOCATIONS = [
  { id: '1', name: '北京市朝阳区', desc: '三里屯店' },
  { id: '2', name: '北京市海淀区', desc: '中关村店' },
  { id: '3', name: '北京市西城区', desc: '金融街店' },
];

const BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
  'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80',
  'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=800&q=80',
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
];

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentLocation, setCurrentLocation] = useState(LOCATIONS[0]);
  const [searchValue, setSearchValue] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const incrementRefreshToken = useCartStore((state) => state.incrementRefreshToken);

  useEffect(() => {
    fetchData();
    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 3000);
    return () => clearInterval(bannerInterval);
  }, []);

  const fetchData = async () => {
    try {
      const [catsRes, prodsRes] = await Promise.all([
        productApi.getCategories(),
        productApi.getProducts(),
      ]);
      setCategories(catsRes.data);
      setProducts(prodsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
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

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/category?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <div className="page">
      <div style={{ background: 'linear-gradient(135deg, #27AE60, #2ECC71)', borderRadius: 12, padding: 16, color: '#fff' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select
            value={currentLocation.id}
            onChange={(e) => setCurrentLocation(LOCATIONS.find(l => l.id === e.target.value) || LOCATIONS[0])}
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: 8,
              padding: '12px 12px 12px 16px',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          <div style={{ flex: 2, position: 'relative' }}>
            <input
              type="text"
              placeholder="搜索商品分类..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{
                width: '100%',
                padding: '12px 40px 12px 16px',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none',
                color: '#333',
              }}
            />
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#27AE60',
                cursor: 'pointer',
              }}
              onClick={handleSearch}
            >
              <circle cx={11} cy={11} r={8} />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>
      </div>

      <section style={{ padding: '12px', background: 'var(--color-bg)' }}>
        <div style={{ position: 'relative', width: '100%', height: 160, borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
          {BANNER_IMAGES.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Banner ${index + 1}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: currentBanner === index ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }}
            />
          ))}
          <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {BANNER_IMAGES.map((_, index) => (
              <div
                key={index}
                style={{
                  width: currentBanner === index ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: currentBanner === index ? '#27AE60' : 'rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div className="section-title">商品分类</div>
        </div>
        <div className="grid-4">
          {categories.slice(0, 8).map((cat) => (
            <div
              key={cat.id}
              className="flex-column flex-center"
              style={{ padding: '8px 4px', cursor: 'pointer', background: '#f5f5f5', borderRadius: 8 }}
              onClick={() => navigate(`/category?categoryId=${cat.id}`)}
            >
              <span style={{ fontSize: 12, textAlign: 'center' }}>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div className="section-title">热门商品</div>
        </div>
        <div className="grid-2">
          {products.map((product) => (
            <div key={product.id} className="card">
              <div style={{ width: '100%', paddingTop: '100%', position: 'relative', marginBottom: 8, overflow: 'hidden', borderRadius: 8 }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              </div>
              <div
                className="text-sm"
                style={{ fontWeight: 600, marginBottom: 4, cursor: 'pointer' }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {product.name}
              </div>
              <div className="text-xs text-secondary mb-8">
                {product.tags?.join(' · ')}
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
      </section>
    </div>
  );
}
