import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTransactions } from '../Context/TransactionsContext';
import api from '../api';
import { useNavigate, useLocation } from 'react-router-dom';

const AddTransaction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date().toISOString().split('T')[0];

  const { fetchTransactions } = useTransactions();

  // If editing an existing transaction
  const editingTransaction = location.state?.transaction || null;

  const [form, setForm] = useState({
    type: editingTransaction?.type || 'expense',
    title: editingTransaction?.title || '',
    category: editingTransaction?.category || '',
    amount: editingTransaction?.amount || '',
    date: editingTransaction?.date || today,
    description: editingTransaction?.description || '',
    reserved: editingTransaction?.reserved || false,
    id: editingTransaction?.id || null,
  });

  const categories = [
    'Salary',
    'Rent',
    'Groceries',
    'Transport',
    'Education',
    'Medical',
    'Food',
    'Shopping',
    'Entertainment',
    'Other'
  ];

  // Input handler
  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === 'title') {
      setForm({ ...form, title: value.replace(/[^a-zA-Z ]/g, '') });
    } else if (name === 'amount') {
      setForm({ ...form, amount: value.replace(/[^0-9]/g, '') });
    } else if (name === 'reserved') {
      setForm({ ...form, reserved: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const isFormValid = () =>
    form.title.trim() &&
    form.category &&
    form.amount &&
    form.date;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      if (form.id) {
        // Update existing transaction
        await api.put(
        `/api/transactions/${form.id}`,
        { ...form, amount: Number(form.amount) }
      );

      } else {
        // Create new transaction
        await api.post(
        '/api/transactions',
        { ...form, amount: Number(form.amount) }
      );

      }

      // Refresh transactions in dashboard
      await fetchTransactions();
      navigate('/dashboard');

    } catch (err) {
      console.error("FULL ERROR:", err);
      console.error("SERVER RESPONSE:", err.response);
      alert(err.response?.data?.message || "Failed to save transaction");
    }
  };

  // Reserved income should only allow future date
  const getDateProps = () =>
    form.type === 'income' && form.reserved
      ? { min: today }
      : { max: today };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl w-[400px] p-6 relative"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition"
        >
          <X size={20} className="text-gray-600" />
        </button>

        <div className="mb-5 text-center">
          <h2 className="text-xl font-semibold text-indigo-600">
            {form.id ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Keep track of your income and expenses
          </p>
        </div>

        {/* Type Toggle */}
        <div className="flex gap-3 justify-center mb-5">
          {['income', 'expense'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setForm({ ...form, type, reserved: false })}
              className={`flex-1 py-2 rounded-xl font-semibold text-sm transition 
              ${
                form.type === type
                  ? type === 'income'
                    ? 'bg-green-100 text-green-700 shadow-inner'
                    : 'bg-red-100 text-red-700 shadow-inner'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-3">

          <CardInput label="Title">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="w-full bg-transparent focus:outline-none text-gray-800 text-sm"
            />
          </CardInput>

          <CardInput label="Category">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-gray-800 text-sm"
            >
              <option value="" disabled hidden>Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </CardInput>

          <CardInput label="Amount">
            <input
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="w-full bg-transparent focus:outline-none text-gray-800 text-sm"
            />
          </CardInput>

          <CardInput label="Date">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-gray-800 text-sm"
              {...getDateProps()}
            />
          </CardInput>

          {form.type === 'income' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="reserved"
                checked={form.reserved}
                onChange={handleChange}
                className="w-4 h-4 accent-indigo-600"
              />
              <label className="text-gray-600 text-sm">
                Reserve for future
              </label>
            </div>
          )}

          <CardInput label="Description (optional)">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full bg-transparent focus:outline-none text-gray-800 h-16 resize-none text-sm"
            />
          </CardInput>

        </div>

        <button
          type="submit"
          disabled={!isFormValid()}
          className={`mt-5 w-full py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all ${
            !isFormValid() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {form.id ? 'Update Transaction' : 'Add Transaction'}
        </button>

      </form>
    </div>
  );
};

const CardInput = ({ label, children }) => (
  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 transition">
    <label className="text-gray-800 text-sm mb-1 block font-normal">
      {label}
    </label>
    {children}
  </div>
);

export default AddTransaction;
