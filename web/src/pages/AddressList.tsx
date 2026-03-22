import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addressApi } from '@/api';
import type { Address } from '@/types';

export default function AddressList() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await addressApi.getAddresses();
      setAddresses(res.data);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressApi.setDefault(id);
      await fetchAddresses();
    } catch (error) {
      console.error('Failed to set default:', error);
      alert('设置失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该地址吗？')) return;
    try {
      await addressApi.deleteAddress(id);
      await fetchAddresses();
    } catch (error) {
      console.error('Failed to delete address:', error);
      alert('删除失败');
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="page">
      <div className="flex-between mb-12">
        <div className="text-sm text-secondary">共 {addresses.length} 个地址</div>
        <button className="btn btn-sm btn-primary" onClick={() => navigate('/address/new')}>
          新增地址
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="empty">暂无地址</div>
      ) : (
        addresses.map((addr) => (
          <div key={addr.id} className="card mb-8" style={{ position: 'relative' }}>
            {addr.isDefault && (
              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'var(--color-primary)',
                  color: '#fff',
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 4,
                }}
              >
                默认
              </div>
            )}

            <div className="flex-between mb-8" style={{ paddingRight: 40 }}>
              <div>
                <span className="text-sm" style={{ fontWeight: 600 }}>
                  {addr.name}
                </span>
                <span className="text-sm text-secondary" style={{ marginLeft: 8 }}>
                  {addr.phone}
                </span>
              </div>
            </div>

            <div className="text-sm text-secondary mb-8">
              {addr.province} {addr.city} {addr.district} {addr.detail}
            </div>

            <div className="flex-center" style={{ gap: 8, justifyContent: 'flex-end' }}>
              {!addr.isDefault && (
                <button className="btn btn-sm btn-secondary" onClick={() => handleSetDefault(addr.id)}>
                  设为默认
                </button>
              )}
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => navigate(`/address/${addr.id}/edit`)}
              >
                编辑
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(addr.id)}>
                删除
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
