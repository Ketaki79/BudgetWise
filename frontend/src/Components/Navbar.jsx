import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import logo from '../assets/budget.png';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkStyle = "text-lg font-semibold text-slate-700 hover:text-indigo-600 transition-colors duration-200";

  return (
    <header className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">

        {/* LOGO - BudgetWise Name is now bigger (text-3xl) */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-12 h-12 flex items-center justify-center
                          bg-white rounded-xl border-2 border-indigo-600
                          shadow-md transition-all">
            <img src={logo} alt="BudgetWise" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-3xl font-black text-slate-900 tracking-tighter">
            Budget<span className="text-indigo-600">Wise</span>
          </span>
        </div>

        {/* DESKTOP LINKS */}
        <nav className="hidden lg:flex items-center gap-10">
          <a href="#home" className={navLinkStyle}>Home</a>
          <a href="#about" className={navLinkStyle}>About</a>
          <a href="#features" className={navLinkStyle}>Features</a>
          <a href="#contact" className={navLinkStyle}>Contact</a>
        </nav>

        {/* SEPARATE ACTION BUTTONS - Login is now bigger with a box */}
        <div className="hidden md:flex items-center gap-5">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-2.5 text-base font-bold text-slate-700 border-2 border-slate-200 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all"
          >
            Login
          </button>
          
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white text-base font-bold rounded-xl 
                       hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            Get Started
            <ArrowRight size={18} />
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-900 hover:bg-slate-50 rounded-lg transition"
        >
          {mobileOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-6 py-8 flex flex-col gap-6">
            <a href="#home" onClick={() => setMobileOpen(false)} className="text-xl font-bold text-slate-800 hover:text-indigo-600 transition-colors">Home</a>
            <a href="#about" onClick={() => setMobileOpen(false)} className="text-xl font-bold text-slate-800 hover:text-indigo-600 transition-colors">About</a>
            <a href="#features" onClick={() => setMobileOpen(false)} className="text-xl font-bold text-slate-800 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#contact" onClick={() => setMobileOpen(false)} className="text-xl font-bold text-slate-800 hover:text-indigo-600 transition-colors">Contact</a>

            <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
              <button 
                onClick={() => { navigate('/login'); setMobileOpen(false); }}
                className="w-full py-4 font-bold text-slate-700 border-2 border-slate-200 rounded-xl"
              >
                Login
              </button>
              <button 
                onClick={() => { navigate('/register'); setMobileOpen(false); }}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;