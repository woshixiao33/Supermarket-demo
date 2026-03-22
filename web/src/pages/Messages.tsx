import { useEffect, useState } from 'react';
import { messageApi } from '@/api';
import type { Message } from '@/types';

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | 'system' | 'order' | 'activity'>('all');

  useEffect(() => {
    fetchMessages();
  }, [selectedType]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = selectedType !== 'all' ? { type: selectedType } : undefined;
      const res = await messageApi.getMessages(params);
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await messageApi.markAsRead(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDeleteRead = async () => {
    if (!confirm('确定要删除所有已读消息吗？')) return;
    try {
      await messageApi.deleteMessages([]);
      await fetchMessages();
    } catch (error) {
      console.error('Failed to delete messages:', error);
    }
  };

  const typeLabels = {
    all: '全部',
    system: '系统',
    order: '订单',
    activity: '活动',
  };

  const typeIcons = {
    all: '📋',
    system: '🔔',
    order: '📦',
    activity: '🎉',
  };

  return (
    <div className="page">
      <div className="flex-center" style={{ gap: 8, marginBottom: 12, overflowX: 'auto', padding: '0 4px' }}>
        {(Object.keys(typeLabels) as Array<keyof typeof typeLabels>).map((key) => (
          <div
            key={key}
            className={`btn btn-sm ${selectedType === key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedType(key)}
            style={{
              whiteSpace: 'nowrap',
              background: selectedType === key ? 'var(--color-primary)' : '#f5f5f5',
              color: selectedType === key ? '#fff' : '#666',
              border: 'none',
            }}
          >
            {typeIcons[key]} {typeLabels[key]}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : messages.length === 0 ? (
        <div className="empty">暂无消息</div>
      ) : (
        <>
          <div className="flex-between mb-12">
            <div className="text-sm text-secondary">共 {messages.length} 条消息</div>
            <div className="text-sm text-primary" style={{ cursor: 'pointer' }} onClick={handleDeleteRead}>
              删除已读
            </div>
          </div>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`card mb-8 ${!msg.isRead ? 'unread' : ''}`}
              style={{
                opacity: !msg.isRead ? 1 : 0.6,
                borderLeft: !msg.isRead ? '4px solid var(--color-primary)' : 'none',
                cursor: 'pointer',
              }}
              onClick={() => !msg.isRead && handleMarkAsRead(msg.id)}
            >
              <div className="flex-between mb-8">
                <div className="text-sm" style={{ fontWeight: 600 }}>
                  {msg.type === 'system' && '🔔'}
                  {msg.type === 'order' && '📦'}
                  {msg.type === 'activity' && '🎉'}
                  {' '}{msg.title}
                  {!msg.isRead && <span style={{ color: 'var(--color-danger)', marginLeft: 4 }}>未读</span>}
                </div>
                <div className="text-xs text-hint">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-sm text-secondary">{msg.content}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
