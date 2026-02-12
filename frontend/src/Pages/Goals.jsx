// Goals.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import { CalendarDays, Trash2, Pencil } from 'lucide-react';

const Goals = () => {
  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('currentUser')); // assumes { id: 'user123', email: '...' }
  const STORAGE_KEY = user ? `budgetwise_goals_${user.id}` : null;

  const [goals, setGoals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    days: '',
    targetAmount: '',
  });

  // Load goals for this user on mount
  useEffect(() => {
    if (!STORAGE_KEY) return;
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored) setGoals(stored);
  }, [STORAGE_KEY]);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (!STORAGE_KEY) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals, STORAGE_KEY]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only numbers for days & targetAmount
    if ((name === 'days' || name === 'targetAmount') && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', days: '', targetAmount: '' });
    setEditingId(null);
  };

  const submitGoal = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.days || !formData.targetAmount) return;

    if (editingId) {
      setGoals(
        goals.map((g) =>
          g.id === editingId
            ? { ...g, ...formData, days: Number(formData.days), targetAmount: Number(formData.targetAmount) }
            : g
        )
      );
    } else {
      setGoals([
        ...goals,
        {
          id: Date.now(),
          ...formData,
          days: Number(formData.days),
          targetAmount: Number(formData.targetAmount),
          savedAmount: 0,
        },
      ]);
    }
    resetForm();
  };

  const deleteGoal = (id) => setGoals(goals.filter((g) => g.id !== id));

  const editGoal = (goal) => {
    setEditingId(goal.id);
    setFormData(goal);
  };

  const updateSaved = (id, value) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, savedAmount: Number(value) } : g)));
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">

        {/* Form */}
        <form onSubmit={submitGoal} className="bg-white/60 backdrop-blur-md border border-white rounded-3xl shadow-lg p-6 mb-10">
          <h2 className="text-xl font-semibold text-indigo-600 mb-5">{editingId ? 'Edit Goal' : 'Add New Goal'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input className="input" name="title" placeholder="Goal title" value={formData.title} onChange={handleChange} />
            <input className="input" name="days" placeholder="Days" inputMode="numeric" value={formData.days} onChange={handleChange} />
            <input className="input" name="targetAmount" placeholder="Target amount (₹)" inputMode="numeric" value={formData.targetAmount} onChange={handleChange} />
            <input className="input md:col-span-2" name="description" placeholder="Description (optional)" value={formData.description} onChange={handleChange} />
          </div>
          <button className="mt-6 w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-2xl shadow-md hover:opacity-90 transition">
            {editingId ? 'Update Goal' : 'Add Goal'}
          </button>
        </form>

        {/* Goals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {goals.map((g) => {
            const percent = Math.min((g.savedAmount / g.targetAmount) * 100, 100);
            const remaining = Math.max(g.targetAmount - g.savedAmount, 0);
            const perDay = g.days > 0 ? Math.ceil(remaining / g.days) : 0;
            const completed = percent === 100;

            return (
              <div
                key={g.id}
                className={`relative bg-white rounded-3xl p-6 shadow-lg border transition-transform hover:scale-[1.03] duration-300 ${
                  completed ? 'ring-2 ring-green-400 shadow-green-200' : ''
                }`}
              >
                {completed && (
                  <span className="absolute top-3 right-3 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Completed 🎉
                  </span>
                )}

                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg text-indigo-700">{g.title}</h3>
                  <div className="flex gap-2">
                    <Pencil size={16} className="cursor-pointer text-gray-500" onClick={() => editGoal(g)} />
                    <Trash2 size={16} className="cursor-pointer text-red-500" onClick={() => deleteGoal(g.id)} />
                  </div>
                </div>

                {g.description && <p className="text-sm text-gray-500 mb-3">{g.description}</p>}

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <CalendarDays size={15} /> {g.days} days
                </div>

                {/* Animated Progress Bar */}
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-700 ${completed ? 'bg-green-400' : 'bg-linear-to-r from-indigo-600 to-purple-600'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-700 mb-2">
                  <span>₹{g.savedAmount}</span>
                  <span>₹{g.targetAmount}</span>
                </div>

                <p className="text-xs text-gray-500 mb-2">
                  Save <span className="font-semibold text-indigo-600">₹{perDay}/day</span> to finish on time
                </p>

                <input
                  type="range"
                  min="0"
                  max={g.targetAmount}
                  value={g.savedAmount}
                  onChange={(e) => updateSaved(g.id, e.target.value)}
                  className="w-full accent-indigo-600"
                />
              </div>
            );
          })}
        </div>

        <style>{`
          .input {
            border: 1px solid #e5e7eb;
            border-radius: 1rem;
            padding: 0.65rem 1rem;
            outline: none;
            background: rgba(255,255,255,0.9);
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          }
          .input:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
          }
        `}</style>
      </main>
    </div>
  );
};

export default Goals;
