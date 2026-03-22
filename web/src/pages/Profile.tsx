import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { userApi, orderApi } from '@/api';

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, fetchUser } = useUserStore();
  const [uploading, setUploading] = useState(false);
  const [orderCounts, setOrderCounts] = useState({
    pending: 0,
    paid: 0,
    shipped: 0,
    received: 0,
    refund: 0,
  });

  useEffect(() => {
    fetchUser();
    fetchOrderCounts();
  }, [fetchUser]);

  const fetchOrderCounts = async () => {
    try {
      const { data: orders } = await orderApi.getOrders();
      const counts = {
        pending: 0,
        paid: 0,
        shipped: 0,
        received: 0,
        refund: 0,
      };
      orders.forEach((order) => {
        if (order.status === '待付款') counts.pending++;
        else if (order.status === '已支付') counts.paid++;
        else if (order.status === '待收货') counts.shipped++;
        else if (order.status === '待评价') counts.received++;
        else if (order.status === '退换/售后') counts.refund++;
      });
      setOrderCounts(counts);
    } catch (error) {
      console.error('Failed to fetch order counts:', error);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      await userApi.uploadAvatar(formData);
      await fetchUser();
      alert('头像修改成功');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('头像上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const quickActions = [
    { icon: '📍', label: '收货地址', path: '/address' },
    { icon: '❤️', label: '我的收藏', path: '/favorites' },
    { icon: '🎁', label: '邀请有礼', path: '#' },
    { icon: '💬', label: '客服中心', path: '/customer-service' },
  ];

  const orderActions = [
    { icon: '💳', label: '待付款', count: orderCounts.pending, path: '/orders?status=pending' },
    { icon: '📦', label: '待收货', count: orderCounts.shipped, path: '/orders?status=shipped' },
    { icon: '⭐', label: '待评价', count: orderCounts.received, path: '/orders?status=received' },
    { icon: '🔄', label: '退换/售后', count: orderCounts.refund, path: '/orders?status=refund' },
  ];

  if (!user) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="page">
      <section className="section">
        <div className="flex-between" style={{ marginBottom: 16 }}>
          <div className="flex-center" style={{ gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <img
                src={user.avatar}
                alt="头像"
                className="avatar"
                onClick={handleAvatarClick}
                style={{ opacity: uploading ? 0.5 : 1 }}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              {uploading && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    color: '#fff',
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '50%',
                  }}
                >
                  上传中
                </div>
              )}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{user.username}</div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{user.memberLevel}</div>
            </div>
          </div>
          <div className="flex-center" style={{ gap: 16 }}>
            <div onClick={() => navigate('/messages')}>
              <span style={{ fontSize: 20 }}>💬</span>
            </div>
            <div>
              <span style={{ fontSize: 20 }}>⚙️</span>
            </div>
          </div>
        </div>

        <div className="grid-3">
          <div
            className="flex-column flex-center"
            style={{ padding: '12px 0', cursor: 'pointer' }}
          >
            <div style={{ fontSize: 20, fontWeight: 700 }}>{user.points}</div>
            <div style={{ fontSize: 12, color: '#999' }}>积分</div>
          </div>
          <div
            className="flex-column flex-center"
            style={{ padding: '12px 0', cursor: 'pointer' }}
            onClick={() => navigate('/coupons')}
          >
            <div style={{ fontSize: 20, fontWeight: 700 }}>{user.coupons}</div>
            <div style={{ fontSize: 12, color: '#999' }}>优惠券</div>
          </div>
          <div
            className="flex-column flex-center"
            style={{ padding: '12px 0', cursor: 'pointer' }}
          >
            <div style={{ fontSize: 20, fontWeight: 700 }}>¥{user.balance}</div>
            <div style={{ fontSize: 12, color: '#999' }}>余额</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div className="section-title">我的订单</div>
          <div className="section-more" onClick={() => navigate('/orders')}>
            查看全部
          </div>
        </div>
        <div className="grid-4">
          {orderActions.map((action) => (
            <div
              key={action.label}
              className="flex-column flex-center"
              style={{ padding: '12px 0', cursor: 'pointer', position: 'relative' }}
              onClick={() => navigate(action.path)}
            >
              <span style={{ fontSize: 24 }}>{action.icon}</span>
              <span style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{action.label}</span>
              {action.count > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'var(--color-danger)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    fontSize: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {action.count}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div className="section-title">快捷功能</div>
        </div>
        <div className="grid-2">
          {quickActions.map((action) => (
            <div
              key={action.label}
              className="flex-center card"
              style={{ padding: '16px 12px', cursor: 'pointer', gap: 8 }}
              onClick={() => action.path !== '#' && navigate(action.path)}
            >
              <span style={{ fontSize: 24 }}>{action.icon}</span>
              <span style={{ fontSize: 14, color: '#666' }}>{action.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
