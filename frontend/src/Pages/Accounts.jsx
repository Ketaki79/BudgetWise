import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import { CreditCard, Wallet } from 'lucide-react';

const Accounts = () => {
  // Dummy main balance
  const [mainBalance, setMainBalance] = useState(100000);

  // Dummy bank accounts
  const bankAccounts = [
    { name: 'HDFC Bank', balance: 52000 },
    { name: 'ICICI Bank', balance: 34000 },
    { name: 'SBI Savings', balance: 78000 },
    { name: 'Axis Bank', balance: 41000 },
    { name: 'Kotak Mahindra', balance: 29500 },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6">
        <h1 className="text-3xl font-semibold mb-8 text-slate-900">My Accounts</h1>

        {/* Main Account */}
        <div className="bg-linear-to-br from-indigo-600 to-purple-600 text-white rounded-3xl p-8 shadow-xl mb-10">
          <div className="flex items-center gap-3 text-lg font-medium opacity-90">
            <Wallet size={28} /> My Main Account
          </div>
          <p className="mt-6 text-sm opacity-80">Total Balance (Dashboard)</p>
          <p className="text-4xl font-bold mt-1">₹{mainBalance.toLocaleString()}</p>
        </div>

        {/* Linked Bank Accounts */}
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Linked Bank Accounts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bankAccounts.map((bank, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-2 text-indigo-600 font-medium">
                <CreditCard /> {bank.name}
              </div>
              <p className="mt-3 text-gray-600 text-sm">Available Balance</p>
              <p className="text-2xl font-semibold text-slate-900">
                ₹{bank.balance.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Accounts;
