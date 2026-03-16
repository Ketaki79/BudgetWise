import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../Components/Sidebar";
import { Send } from "lucide-react";

const Advisor = () => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello! I am your AI Financial Advisor. Ask me anything about your finances.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Please login first." },
      ]);
      return;
    }

    const userMessage = { from: "user", text: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/ai/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: input,
        }),
      });

      if (!response.ok) {
        throw new Error("API error");
      }

      const data = await response.json();

      const aiText =
        data.response ||
        "AI Advisor could not generate a response. Please try again.";

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: aiText },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Error connecting to AI Advisor. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 md:ml-64 flex flex-col h-screen bg-gray-50">

        {/* Header */}
        <div className="bg-blue-600 text-white p-6 sticky top-0 z-10">
          <h1 className="text-3xl font-bold">AI Advisor</h1>
          <p className="text-sm opacity-90">
            Ask questions about your spending, savings, and finances.
          </p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-white">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg max-w-[75%] ${
                msg.from === "user"
                  ? "bg-blue-100 self-end text-right"
                  : "bg-gray-100 self-start text-left"
              }`}
              style={{ whiteSpace: "pre-line" }}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="text-gray-500 text-sm">
              AI is typing...
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input */}
        <div className="p-4 bg-gray-50 border-t flex gap-2">

          <input
            type="text"
            className="flex-1 border rounded px-4 py-2"
            placeholder="Ask something like 'Give me financial summary'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <Send size={20} />
          </button>

        </div>

      </main>
    </div>
  );
};

export default Advisor;