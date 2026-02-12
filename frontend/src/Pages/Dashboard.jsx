import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import { TrendingUp, TrendingDown, Wallet, Clock } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import axios from 'axios';
import { useTransactions } from '../Hooks/useTransactions';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6666', '#66CC99', '#FFCCFF', '#66B2FF'];
const SUMMARY_COLORS = ['#34D399', '#F87171', '#3B82F6']; // Green = Income, Red = Expenses, Blue = Balance

const Dashboard = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const { transactions, setTransactions } = useTransactions();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch user and transactions
  useEffect(() => {
    const fetchUserAndTransactions = async () => {
      try {
        const userRes = await axios.get('http://localhost:8080/api/auth/me', { withCredentials: true });
        setUser(userRes.data);

        const txRes = await axios.get('http://localhost:8080/api/transactions', { withCredentials: true });
        setTransactions(txRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Session check failed:', err);
        setLoading(false);
      }
    };
    fetchUserAndTransactions();
  }, [setTransactions]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout error:', err);
    }
    navigate('/login');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl font-semibold text-gray-600">Loading...</p>
    </div>
  );

  // --- Stat Card Calculations ---
  const totalIncome = transactions
    .filter(t => t.type === 'income' && (!t.reserved || t.date <= today))
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const rawBalance = totalIncome - totalExpenses;
  const totalBalance = rawBalance < 0 ? 0 : rawBalance;

  const reservedSavings = transactions
    .filter(t => t.type === 'income' && t.reserved && t.date > today)
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount || 0);
      return acc;
    }, {});

  const pieCategoryData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  const pieSummaryData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expenses', value: totalExpenses },
    { name: 'Balance', value: totalBalance },
  ];

  const filteredTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === selectedYear && date.getMonth() + 1 === selectedMonth;
  });

  const monthlyIncome = filteredTransactions
    .filter(t => t.type === 'income' && (!t.reserved || t.date <= today))
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const monthlyExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const monthlyBalance = monthlyIncome - monthlyExpenses;

  const monthlyBarData = [
    {
      name: new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' }),
      Income: monthlyIncome,
      Expenses: monthlyExpenses,
      Balance: monthlyBalance < 0 ? 0 : monthlyBalance
    }
  ];

  const yearlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const income = transactions
      .filter(t => t.type === 'income' && (!t.reserved || t.date <= today) && new Date(t.date).getFullYear() === selectedYear && new Date(t.date).getMonth() + 1 === month)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const expense = transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getFullYear() === selectedYear && new Date(t.date).getMonth() + 1 === month)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const balance = income - expense;
    return {
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      Income: income,
      Expenses: expense,
      Balance: balance < 0 ? 0 : balance
    };
  });

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome Back, {user?.username}!</h1>
            <p className="text-slate-500">Track your income, expenses, and categories</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/add-transaction')} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition">
              + New Transaction
            </button>
            <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-600 transition">
              Logout
            </button>
          </div>
        </header>

        {/* --- Stat Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Income" value={`₹${totalIncome}`} icon={<TrendingUp className="text-emerald-600" />} />
          <StatCard title="Total Expenses" value={`₹${totalExpenses}`} icon={<TrendingDown className="text-rose-600" />} />
          <StatCard title="Reserved Savings" value={`₹${reservedSavings}`} icon={<Clock className="text-blue-600" />} />
          <StatCard title="Total Balance" value={`₹${totalBalance}`} icon={<Wallet className="text-indigo-600" />} />
        </div>

        {/* --- Month & Year Selectors --- */}
        <div className="flex gap-4 mb-6">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="p-2 rounded-xl border bg-white"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i+1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="p-2 rounded-xl border bg-white"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
        </div>

        {/* --- Pie Chart: Expense Categories --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieCategoryData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {pieCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Income / Expenses / Balance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieSummaryData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {pieSummaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SUMMARY_COLORS[index % SUMMARY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Monthly & Yearly Bar Charts --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Selected Month Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Income" fill="#34D399" />
                <Bar dataKey="Expenses" fill="#F87171" />
                <Bar dataKey="Balance" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Yearly Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Income" fill="#34D399" />
                <Bar dataKey="Expenses" fill="#F87171" />
                <Bar dataKey="Balance" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Transaction Table --- */}
        <div className="bg-white p-6 rounded-3xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4">Transactions</h3>
          <table className="w-full text-left">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="py-2">Title</th>
                <th className="py-2">Category</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Date</th>
                <th className="py-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className="border-b border-gray-100">
                  <td className="py-2">{tx.title}</td>
                  <td className="py-2">{tx.category}</td>
                  <td className={`py-2 font-bold ${
                    tx.type === 'income' && !tx.reserved ? 'text-green-600' :
                    tx.type === 'expense' ? 'text-red-600' :
                    tx.type === 'income' && tx.reserved ? 'text-blue-600' : ''
                  }`}>
                    ₹{tx.amount}
                  </td>
                  <td className="py-2">{tx.date}</td>
                  <td className="py-2">{tx.type}{tx.reserved ? ' (Reserved)' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-3xl border shadow-sm">
    <div className="bg-slate-100 p-3 w-fit rounded-xl mb-3">{icon}</div>
    <p className="text-slate-500 text-sm">{title}</p>
    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
  </div>
);

export default Dashboard;
