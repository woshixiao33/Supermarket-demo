import { useEffect, useState } from 'react';
import { couponApi } from '@/api';
import type { Coupon } from '@/types';

export default function Coupons() {
  const [selectedTab, setSelectedTab] = useState<'available' | 'used' | 'expired'>('available');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, [selectedTab]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await couponApi.getCoupons({ status: selectedTab });
      setCoupons(res.data);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { label: '可用', value: 'available', count: 0 },
    { label: '已使用', value: 'used', count: 0 },
    { label: '已过期', value: 'expired', count: 0 },
  ];

  return (
    <div className="page">
      <div className="flex-center" style={{ gap: 8, marginBottom: 12, padding: '0 4px' }}>
        {tabs.map((tab) => (
          <div
            key={tab.value}
            className={`btn btn-sm ${selectedTab === tab.value ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedTab(tab.value as 'available' | 'used' | 'expired')}
            style={{
              whiteSpace: 'nowrap',
              background: selectedTab === tab.value ? 'var(--color-primary)' : '#f5f5f5',
              color: selectedTab === tab.value ? '#fff' : '#666',
              border: 'none',
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : coupons.length === 0 ? (
        <div className="empty">暂无优惠券</div>
      ) : (
        <div className="flex-column" style={{ gap: 12 }}>
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="card"
              style={{
                display: 'flex',
                background: coupon.status === 'available' ? 'linear-gradient(135deg, #FF6B6B, #FF8E53)' : '#f5f5f5',
                color: coupon.status === 'available' ? '#fff' : '#999',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                className="flex-center"
                style={{
                  flex: '0 0 auto',
                  minWidth: 100,
                  padding: '16px 12px',
                  borderRight: coupon.status === 'available' ? '2px dashed rgba(255,255,255,0.3)' : '2px dashed #ddd',
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>
                  ¥{coupon.amount.toFixed(2)}
                </div>
                <div style={{ fontSize: 12, opacity: 0.9, textAlign: 'center' }}>
                  满¥{coupon.minAmount}可用
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                    {coupon.title}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>
                    {coupon.description}
                  </div>
                  {coupon.category && (
                    <div
                      style={{
                        fontSize: 10,
                        background: 'rgba(255,255,255,0.2)',
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 10,
                        marginTop: 6,
                      }}
                    >
                      {coupon.category}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>
                  有效期至：{new Date(coupon.validUntil).toLocaleDateString()}
                </div>
              </div>

              {coupon.status !== 'available' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%) rotate(-15deg)',
                    fontSize: 32,
                    fontWeight: 700,
                    opacity: 0.3,
                    letterSpacing: 4,
                  }}
                >
                  {coupon.status === 'used' ? '已使用' : '已过期'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
