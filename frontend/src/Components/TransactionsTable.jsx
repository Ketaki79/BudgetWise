// src/Components/TransactionsTable.jsx
import React from 'react';
import { useTransactions } from '../Context/TransactionsContext';

const TransactionsTable = () => {
  const { transactions } = useTransactions();

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">All Transactions</h1>
      <table className="w-full text-left border">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td className="border p-2">{t.title}</td>
              <td className="border p-2">
                {t.date ? new Date(t.date).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }) : 'N/A'}
              </td>
              <td className="border p-2">{t.type}</td>
              <td className="border p-2">{t.category || t.customCategory || '-'}</td>
              <td className="border p-2">{t.amount}</td>
              <td className="border p-2">{t.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
