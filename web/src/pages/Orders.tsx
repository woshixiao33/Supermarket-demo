import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '@/api';
import type { Order } from '@/types';

export default function Orders() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = selectedStatus ? { status: selectedStatus } : undefined;
      const res = await orderApi.getOrders(params);
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (orderStatus: string) => {
    const statusMap: Record<string, string> = {
      '待付款': 'pending',
      '已支付': 'paid',
      '待收货': 'shipped',
      '待评价': 'received',
      '退换/售后': 'refund',
    };
    return statusMap[orderStatus] || '';
  };

  const tabs = [
    { label: '全部', value: '' },
    { label: '待付款', value: 'pending' },
    { label: '待收货', value: 'shipped' },
    { label: '待评价', value: 'received' },
    { label: '售后', value: 'refund' },
  ];

  const statusMap: Record<string, string> = {
    'pending': '待付款',
    'paid': '已支付',
    'shipped': '待收货',
    'received': '待评价',
    'refund': '退换/售后',
  };

  return (
    <div className="page">
      <div className="flex-center" style={{ gap: 8, marginBottom: 12, overflowX: 'auto', padding: '0 4px' }}>
        {tabs.map((tab) => (
          <div
            key={tab.value}
            className={`btn btn-sm ${selectedStatus === tab.value ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedStatus(tab.value)}
            style={{
              whiteSpace: 'nowrap',
              background: selectedStatus === tab.value ? 'var(--color-primary)' : '#f5f5f5',
              color: selectedStatus === tab.value ? '#fff' : '#666',
              border: 'none',
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : orders.length === 0 ? (
        <div className="empty">暂无订单</div>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order.orderId} className="card mb-8">
              <div className="flex-between mb-8">
                <div className="text-sm" style={{ fontWeight: 600 }}>
                  订单号：{order.orderId}
                </div>
                <div
                  className="text-sm"
                  style={{
                    color: order.status === '待付款' ? 'var(--color-danger)' : 'var(--color-primary)',
                  }}
                >
                  {order.status}
                </div>
              </div>

              <div className="flex-between" style={{ marginBottom: 8 }}>
                <div className="flex-center" style={{ gap: 8 }}>
                  <img
                    src={order.previewImage}
                    alt=""
                    style={{ width: 60, height: 60, borderRadius: 6, objectFit: 'cover' }}
                  />
                  <div>
                    <div className="text-sm" style={{ fontWeight: 600, marginBottom: 4 }}>
                      {order.previewName}
                    </div>
                    <div className="text-xs text-secondary">
                      共 {order.itemCount || 0} 件商品
                    </div>
                  </div>
                </div>
                <div className="text-sm" style={{ fontWeight: 600 }}>
                  ¥{order.totalAmount}
                </div>
              </div>

              <div className="flex-between mt-12" style={{ paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                <div className="text-xs text-hint">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
                <div className="flex-center" style={{ gap: 8 }}>
                  {order.status === '待付款' && (
                    <>
                      <button className="btn btn-sm btn-secondary">取消订单</button>
                      <button className="btn btn-sm btn-primary">去付款</button>
                    </>
                  )}
                  {order.status === '待收货' && (
                    <button className="btn btn-sm btn-primary">确认收货</button>
                  )}
                  {order.status === '待评价' && (
                    <button className="btn btn-sm btn-primary">去评价</button>
                  )}
                  {order.status === '退换/售后' && (
                    <button className="btn btn-sm btn-secondary">查看进度</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
