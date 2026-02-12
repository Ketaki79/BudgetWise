import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  Target,
  List,
  Bot,
  Settings,
  LogOut,
} from 'lucide-react';
import budgetLogo from '../assets/budget.png';
import axiosInstance from '../axiosConfig';

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Accounts', icon: Wallet, path: '/accounts' },
    { name: 'Transactions', icon: List, path: '/transactions' },
    { name: 'Goals', icon: Target, path: '/goals' },
    { name: 'AI Advisor', icon: Bot, path: '/ai-advisor' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-lg flex flex-col">
      <div className="flex items-center gap-3 p-6 mb-4">
        <div className="w-16 h-16 flex items-center justify-center rounded-xl border-2 border-indigo-500 bg-white shadow-md">
          <img src={budgetLogo} alt="BudgetWise Logo" className="w-10 h-10" />
        </div>
        <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">
          BudgetWise
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
              ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600'}`
            }
          >
            <Icon size={20} />
            {name}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold transition-all duration-200"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
