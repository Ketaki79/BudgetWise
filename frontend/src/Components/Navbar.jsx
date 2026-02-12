import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/budget.png';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeBtn, setActiveBtn] = useState(''); // track clicked button
  const navigate = useNavigate();

  const handleNavClick = (btn) => {
    setActiveBtn(btn);
    navigate(btn === 'login' ? '/login' : '/register');
  };

  return (
    <header className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">

        {/* LOGO */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-14 h-14 flex items-center justify-center
                          bg-white rounded-xl border-2 border-indigo-600
                          shadow-md hover:scale-105 transition">
            <img src={logo} alt="BudgetWise" className="w-9 h-9 object-contain" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Budget<span className="text-indigo-600">Wise</span>
          </span>
        </div>

        {/* DESKTOP LINKS */}
        <nav className="hidden md:flex items-center gap-10 text-slate-800 tracking-wide">
          <Link to="/" className="hover:text-indigo-600 transition font-normal text-lg">Home</Link>
          <a href="#features" className="hover:text-indigo-600 transition font-normal text-lg">Features</a>
          <a href="#about" className="hover:text-indigo-600 transition font-normal text-lg">About</a>
          <Link to="/contact" className="hover:text-indigo-600 transition font-normal text-lg">Contact</Link>
        </nav>

        {/* DESKTOP LOGIN / REGISTER */}
        <div className="hidden md:flex items-center gap-3">
          {['login', 'register'].map((btn) => (
            <button
              key={btn}
              onClick={() => handleNavClick(btn)}
              className={`px-6 py-2 rounded-xl font-bold text-sm sm:text-base transition
                ${activeBtn === btn
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : btn === 'login'
                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }
              `}
            >
              {btn === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-slate-900"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg animate-slideDown">
          <div className="px-6 py-6 flex flex-col gap-4">

            {/* Mobile Links */}
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-slate-800 font-normal hover:text-indigo-600 transition">Home</Link>
            <a href="#features" onClick={() => setMobileOpen(false)} className="text-slate-800 font-normal hover:text-indigo-600 transition">Features</a>
            <a href="#about" onClick={() => setMobileOpen(false)} className="text-slate-800 font-normal hover:text-indigo-600 transition">About</a>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="text-slate-800 font-normal hover:text-indigo-600 transition">Contact</Link>

            {/* Mobile Login / Register */}
            <div className="flex flex-col gap-3 mt-3">
              {['login', 'register'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => { setMobileOpen(false); handleNavClick(btn); }}
                  className={`px-6 py-2 rounded-xl font-bold text-sm transition
                    ${activeBtn === btn
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : btn === 'login'
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }
                  `}
                >
                  {btn === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
