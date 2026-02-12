// Advisor.jsx
import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import { Send } from 'lucide-react';

const Advisor = () => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! I am your AI Advisor. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setMessages((prev) => [...prev, { from: 'bot', text: "This is a dummy response!" }]);
    setInput('');
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 bg-gray-50 min-h-screen flex flex-col">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">AI Advisor</h1>
        <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-md p-4 flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg max-w-xs ${
                msg.from === 'user' ? 'bg-indigo-100 self-end' : 'bg-gray-100 self-start'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex mt-4 gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-4 py-2"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Advisor;
