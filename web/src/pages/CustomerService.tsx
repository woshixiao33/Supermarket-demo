import { useEffect, useState, useRef } from 'react';
import { customerServiceApi } from '@/api';
import type { FAQ, ChatMessage } from '@/types';

export default function CustomerService() {
  const [faqList, setFaqList] = useState<FAQ[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFAQ();
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchFAQ = async () => {
    setLoading(true);
    try {
      const res = await customerServiceApi.getFAQ();
      setFaqList(res.data);
    } catch (error) {
      console.error('Failed to fetch FAQ:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const res = await customerServiceApi.getChatHistory();
      setChatHistory(res.data);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      time: Date.now(),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setMessage('');
    setSending(true);

    try {
      await customerServiceApi.sendMessage(message);
      setTimeout(() => {
        fetchChatHistory();
      }, 1200);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  if (showChat) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="flex-center mb-12" style={{ justifyContent: 'flex-start', gap: 8 }}>
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setShowChat(false)}
            style={{ padding: '8px 16px' }}
          >
            ← 返回
          </button>
          <span className="text-sm">在线客服</span>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            background: '#f5f5f5',
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
          }}
        >
          {chatHistory.length === 0 ? (
            <div className="empty" style={{ padding: 20 }}>暂无聊天记录</div>
          ) : (
            chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex-center mb-8 ${msg.role === 'user' ? 'flex-end' : 'flex-start'}`}
              >
                <div
                  className="text-sm"
                  style={{
                    maxWidth: '80%',
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: msg.role === 'user' ? 'var(--color-primary)' : '#fff',
                    color: msg.role === 'user' ? '#fff' : '#333',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="flex-center" style={{ gap: 8 }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入消息..."
            onKeyDown={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
          />
          <button
            className="btn btn-primary"
            onClick={handleSendMessage}
            disabled={sending || !message.trim()}
          >
            发送
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <button
        className="btn btn-primary btn-lg mb-12"
        onClick={() => setShowChat(true)}
      >
        💬 联系在线客服
      </button>

      <div className="section">
        <div className="section-header">
          <div className="section-title">常见问题</div>
        </div>

        {loading ? (
          <div className="loading">加载中...</div>
        ) : faqList.length === 0 ? (
          <div className="empty">暂无常见问题</div>
        ) : (
          <div className="flex-column">
            {faqList.map((faq) => (
              <div
                key={faq.id}
                className="card mb-8"
                style={{ cursor: 'pointer' }}
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
              >
                <div className="flex-between">
                  <div className="text-sm" style={{ fontWeight: 600 }}>
                    {faq.question}
                  </div>
                  <span style={{ fontSize: 12 }}>{expandedFaq === faq.id ? '▲' : '▼'}</span>
                </div>
                {expandedFaq === faq.id && (
                  <div className="text-sm text-secondary mt-8">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
