import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
import axios from 'axios';

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Merhaba! Size nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post('/api/chatgpt', { message: input });
      setMessages(msgs => [...msgs, { from: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { from: 'bot', text: 'Bir hata oluştu.' }]);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="chatbot-toggle" onClick={() => setOpen(!open)}>
        💬
      </div>
      {open && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <span>ChatBot</span>
            <button className="chatbot-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg-${msg.from}`}>{msg.text}</div>
            ))}
            {loading && <div className="chatbot-msg chatbot-msg-bot">Yanıt yazılıyor...</div>}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input-row" onSubmit={handleSend}>
            <input
              className="chatbot-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Mesajınızı yazın..."
              disabled={loading}
            />
            <button className="chatbot-send" type="submit" disabled={loading}>Gönder</button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatBot; 