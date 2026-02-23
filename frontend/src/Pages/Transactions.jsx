import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import api from '../api';

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchUserAndTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        // ✅ No need to send headers (interceptor handles it)
        const userRes = await api.get('/api/auth/me');
        setUser(userRes.data);

        const txRes = await api.get('/api/transactions');
        setTransactions(txRes.data);

      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchUserAndTransactions();
  }, [navigate]);

  const handleEdit = (tx) => {
    navigate('/add-transaction', { state: { transaction: tx } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    try {
      // ✅ Use api instance (token auto added)
      await api.delete(`/api/transactions/${id}`);

      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user)
    return <p className="text-center mt-20 text-gray-600">Loading...</p>;

  const getTypeColor = (tx) => {
    if (tx.reserved && tx.date > today)
      return 'text-purple-600 font-semibold';
    if (tx.type === 'income')
      return 'text-green-600';
    if (tx.type === 'expense')
      return 'text-red-600';
    return '';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8">Transactions</h1>

        <div className="bg-white shadow-xl rounded-3xl p-6 max-w-6xl mx-auto md:mx-0 border border-gray-200">
          {transactions.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            <table className="min-w-full border divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4">{tx.title}</td>
                    <td className="px-6 py-4">
                      {tx.date
                        ? new Date(tx.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'N/A'}
                    </td>
                    <td className={`px-6 py-4 ${getTypeColor(tx)}`}>
                      ₹{tx.amount}
                    </td>
                    <td className={`px-6 py-4 capitalize ${getTypeColor(tx)}`}>
                      {tx.reserved && tx.date > today ? 'Reserved' : tx.type}
                    </td>
                    <td className="px-6 py-4">
                      {tx.category || tx.customCategory || '-'}
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      <button
                        onClick={() => handleEdit(tx)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Transactions;
