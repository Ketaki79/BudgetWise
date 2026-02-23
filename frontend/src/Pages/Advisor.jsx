import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../Components/Sidebar';
import { Send } from 'lucide-react';
import { useTransactions } from '../Context/TransactionsContext';

const Advisor = () => {
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Hello! I am your AI Advisor. I can provide insights based on your Dashboard data.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { transactions, fetchTransactions } = useTransactions();

  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Please login first.' },
      ]);
      return;
    }

    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0];

      const normalIncome = transactions.filter(
        (t) => t.type === 'income' && !t.reserved
      );
      const reservedFuture = transactions.filter(
        (t) => t.type === 'income' && t.reserved && t.date > today
      );
      const maturedReserved = transactions.filter(
        (t) => t.type === 'income' && t.reserved && t.date <= today
      );
      const normalExpense = transactions.filter((t) => t.type === 'expense');

      const totalIncome = normalIncome.reduce(
        (sum, t) => sum + Number(t.amount || 0),
        0
      );
      const reservedSavings = reservedFuture.reduce(
        (sum, t) => sum + Number(t.amount || 0),
        0
      );
      const totalExpenses =
        normalExpense.reduce((sum, t) => sum + Number(t.amount || 0), 0) +
        maturedReserved.reduce((sum, t) => sum + Number(t.amount || 0), 0);
      const totalBalance = totalIncome - totalExpenses;

      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthStr = lastMonth.toISOString().slice(0, 7);
      const lastMonthExpenses = transactions
        .filter((t) => t.type === 'expense' && t.date.startsWith(lastMonthStr))
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      const predictedNextMonth =
        Math.round(lastMonthExpenses * 1.1) || totalExpenses;

      const suggestedSavings = Math.round(totalIncome * 0.2);
      const suggestedInvest = Math.round((totalBalance - suggestedSavings) * 0.5);
      const safeSpending = totalBalance - suggestedSavings - suggestedInvest;

      const categoryTotals = {};
      normalExpense.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
      });
      const highestCategory = Object.entries(categoryTotals).sort((a,b) => b[1]-a[1])[0];

      const question = input.toLowerCase();
      let aiResponse = `- Total Income = ₹${totalIncome}
- Total Expenses = ₹${totalExpenses}
- Total Reserved = ₹${reservedSavings}
- Total Balance = ₹${totalBalance}
- Next month, expected expenses ≈ ₹${predictedNextMonth}
- Advice: Keep spending under control, save ₹${suggestedSavings} next month, invest ₹${suggestedInvest}, and spend safely ₹${safeSpending}.`;

      if (question.includes('summary')) aiResponse = aiResponse;
      else if (question.includes('total expense')) aiResponse = `- Total Expenses = ₹${totalExpenses}`;
      else if (question.includes('total income')) aiResponse = `- Total Income = ₹${totalIncome}`;
      else if (question.includes('total reserved')) aiResponse = `- Total Reserved = ₹${reservedSavings}`;
      else if (question.includes('total balance')) aiResponse = `- Total Balance = ₹${totalBalance}`;
      else if (question.includes('next month')) aiResponse = `- Next month, expected expenses ≈ ₹${predictedNextMonth}`;
      else if (question.includes('advice'))
        aiResponse = `- Advice: Keep spending under control, save ₹${suggestedSavings}, invest ₹${suggestedInvest}, spend safely ₹${safeSpending}.`;
      else if (question.includes('highest expense')) 
        aiResponse = highestCategory
          ? `- Highest Expense Category: ${highestCategory[0]} = ₹${highestCategory[1]}`
          : '- No expenses recorded.';
      else if (question.includes('investment') || question.includes('invest'))
        aiResponse = `- Suggested Investment Amount = ₹${suggestedInvest} 
- Suggested Savings = ₹${suggestedSavings} 
- Remaining safe spending = ₹${safeSpending}`;

      setMessages((prev) => [...prev, { from: 'bot', text: aiResponse }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Error processing your question. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 flex flex-col h-screen bg-gray-50 p-0">
        {/* AI Advisor header in blue */}
        <div className="bg-blue-600 text-white p-6 sticky top-0 z-10">
          <h1 className="text-3xl font-bold">AI Advisor</h1>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-white">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg max-w-full wrap-break-word ${
                msg.from === 'user'
                  ? 'bg-indigo-100 self-end text-right'
                  : 'bg-gray-100 self-start text-left'
              }`}
              style={{ whiteSpace: 'pre-line' }}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="text-gray-500">AI is typing...</div>}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input box */}
        <div className="p-4 bg-gray-50 sticky bottom-0 flex gap-2 z-10 border-t border-gray-200">
          <input
            type="text"
            className="flex-1 border rounded px-4 py-2"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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