import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'; 

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-black text-white mb-6 tracking-tighter">BudgetWise</h2>
            <p className="text-sm leading-relaxed mb-6">
              Empowering thousands of users to take control of their financial destiny through AI-driven insights and smart budgeting.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Github size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/features" className="hover:text-white transition-colors">AI Advisor</Link></li>
              <li><Link to="/features" className="hover:text-white transition-colors">Expense Tracking</Link></li>
              <li><Link to="/features" className="hover:text-white transition-colors">Goal Setting</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Stay Updated</h4>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-colors"
              />
              <button className="absolute right-2 top-2 bg-indigo-600 text-white p-1.5 rounded-lg hover:bg-indigo-500">
                <Mail size={16} />
              </button>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest">
          <p>© 2026 BudgetWise AI. All rights reserved.</p>
          <p>Made with ❤️ for financial freedom</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }) => (
  <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
    {icon}
  </a>
);

export default Footer;

