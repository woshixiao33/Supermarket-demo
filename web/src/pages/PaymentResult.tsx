import { useNavigate, useParams } from 'react-router-dom';

export default function PaymentResult() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: 300, textAlign: 'center', padding: '40px 20px' }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            background: '#E8F8F5',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            fontWeight: 700,
            margin: '0 auto 20px',
          }}
        >
          ✓
        </div>

        <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>支付成功</div>

        <div className="text-sm text-secondary mb-12">
          你的生鲜订单已提交，正在为你极速备货。
        </div>

        <div className="text-sm text-hint mb-12">
          订单号：{orderId || '暂无'}
        </div>

        <div className="flex-column" style={{ gap: 8 }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/orders')}>
            查看订单
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/home')}>
            继续逛逛
          </button>
        </div>
      </div>
    </div>
  );
}
