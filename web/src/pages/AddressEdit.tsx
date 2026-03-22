import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addressApi } from '@/api';

export default function AddressEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const isEdit = !!id;

  useEffect(() => {
    if (id) {
      fetchAddress();
    }
  }, [id]);

  const fetchAddress = async () => {
    try {
      const res = await addressApi.getAddresses();
      const address = res.data.find((a: any) => a.id === id);
      if (address) {
        setFormData({
          name: address.name,
          phone: address.phone,
          province: address.province,
          city: address.city,
          district: address.district,
          detail: address.detail,
          isDefault: address.isDefault,
        });
      }
    } catch (error) {
      console.error('Failed to fetch address:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.province || !formData.city || !formData.district || !formData.detail) {
      alert('请填写完整信息');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await addressApi.updateAddress(id!, formData);
      } else {
        await addressApi.addAddress(formData);
      }
      navigate('/address');
    } catch (error) {
      console.error('Failed to save address:', error);
      alert('保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <form onSubmit={handleSubmit} className="card">
        <div className="flex-column" style={{ gap: 16 }}>
          <div>
            <label className="text-sm text-secondary mb-8">收货人</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入收货人姓名"
            />
          </div>

          <div>
            <label className="text-sm text-secondary mb-8">手机号</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="请输入手机号"
            />
          </div>

          <div>
            <label className="text-sm text-secondary mb-8">省份</label>
            <input
              type="text"
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              placeholder="请输入省份"
            />
          </div>

          <div>
            <label className="text-sm text-secondary mb-8">城市</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="请输入城市"
            />
          </div>

          <div>
            <label className="text-sm text-secondary mb-8">区县</label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              placeholder="请输入区县"
            />
          </div>

          <div>
            <label className="text-sm text-secondary mb-8">详细地址</label>
            <textarea
              value={formData.detail}
              onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
              placeholder="请输入详细地址"
              rows={3}
              style={{ resize: 'none' }}
            />
          </div>

          <label className="flex-center" style={{ gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              style={{ width: 'auto', margin: 0 }}
            />
            <span className="text-sm">设为默认地址</span>
          </label>
        </div>

        <div className="flex-column mt-12" style={{ gap: 8 }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? '保存中...' : '保存'}
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/address')}>
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
