import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoriteApi } from '@/api';
import type { Favorite } from '@/types';

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await favoriteApi.getFavorites();
      setFavorites(res.data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId: string) => {
    if (!confirm('确定要取消收藏吗？')) return;
    try {
      await favoriteApi.deleteFavorite(productId);
      await fetchFavorites();
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      alert('取消失败');
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="page">
      {favorites.length === 0 ? (
        <div className="empty">暂无收藏</div>
      ) : (
        <div className="grid-2">
          {favorites.map((fav) => (
            fav.product && (
              <div key={fav.productId} className="card">
                <div onClick={() => navigate(`/product/${fav.productId}`)}>
                  <img
                    src={fav.product.image}
                    alt={fav.product.name}
                    style={{ width: '100%', borderRadius: 8, marginBottom: 8 }}
                  />
                  <div className="text-sm" style={{ fontWeight: 600, marginBottom: 4 }}>
                    {fav.product.name}
                  </div>
                  <div className="text-sm" style={{ color: '#999', marginBottom: 8 }}>
                    {fav.product.tags?.join(' · ')}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--color-danger)', fontWeight: 600 }}>
                    ¥{fav.product.price}
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-secondary"
                  style={{ width: '100%', marginTop: 8 }}
                  onClick={() => handleRemoveFavorite(fav.productId)}
                >
                  取消收藏
                </button>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
