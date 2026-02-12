import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Receipt,
  BarChart3,
  Target,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Layers,
  Lock,
  Users
} from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import wealthIllustration from '../assets/logo.jpg';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Smart Expense Tracking",
      desc: "Track daily income and expenses with structured categorization, ensuring accuracy and clarity across all financial activities.",
      icon: <Receipt size={24} />,
      color: "bg-indigo-100 text-indigo-700"
    },
    {
      title: "Advanced Financial Analytics",
      desc: "Analyze spending patterns, income trends, and balances through clean dashboards designed for better decision-making.",
      icon: <BarChart3 size={24} />,
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "Goal & Budget Planning",
      desc: "Define monthly budgets and long-term savings goals while monitoring progress in real time.",
      icon: <Target size={24} />,
      color: "bg-pink-100 text-pink-700"
    },
    {
      title: "Enterprise-Grade Security",
      desc: "Your financial data is protected with encryption, secure authentication, and privacy-first architecture.",
      icon: <ShieldCheck size={24} />,
      color: "bg-emerald-100 text-emerald-700"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      {/* HERO */}
      <section className="pt-40 pb-36 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="inline-block mb-5 text-sm font-semibold bg-white/20 px-5 py-1.5 rounded-full">
              Simple • Secure • Smart
            </span>

            <h1 className="text-6xl font-extrabold leading-tight tracking-tight">
              Smarter Financial <br />
              Management for Everyone
            </h1>

            <p className="mt-8 text-lg text-indigo-100 max-w-xl leading-relaxed">
              BudgetWise helps you track expenses, analyze spending,
              and plan better financial decisions — all in one powerful platform.
            </p>

            <ul className="mt-8 space-y-4 text-indigo-100">
              {[
                "Track income and expenses easily",
                "Beautiful visual reports & insights",
                "Secure and privacy-focused"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex items-center gap-6">
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-indigo-700 px-9 py-4 rounded-xl font-semibold
                           hover:scale-105 transition shadow-2xl flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight size={18} />
              </button>

              <span className="text-sm text-indigo-100">
                No credit card required
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src={wealthIllustration}
              alt="Dashboard Preview"
              className="max-w-xl w-full rounded-3xl shadow-2xl border border-white/30 bg-white/10 backdrop-blur-md"
            />
          </div>
        </div>
      </section>

      {/* ABOUT / HOW IT WORKS */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-slate-900">
            How BudgetWise Works
          </h2>

          <p className="mt-6 text-center text-slate-600 max-w-3xl mx-auto text-lg">
            Designed with industry best practices, BudgetWise simplifies money management
            while providing powerful insights for long-term financial growth.
          </p>

          <div className="mt-20 grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <Layers className="mx-auto text-indigo-600" size={36} />
              <h3 className="mt-6 text-xl font-semibold">Organize Your Finances</h3>
              <p className="mt-3 text-slate-600">
                Categorize income and expenses in a structured, intuitive system.
              </p>
            </div>

            <div className="text-center">
              <BarChart3 className="mx-auto text-purple-600" size={36} />
              <h3 className="mt-6 text-xl font-semibold">Analyze & Improve</h3>
              <p className="mt-3 text-slate-600">
                Understand spending habits through clean charts and reports.
              </p>
            </div>

            <div className="text-center">
              <Target className="mx-auto text-pink-600" size={36} />
              <h3 className="mt-6 text-xl font-semibold">Plan for the Future</h3>
              <p className="mt-3 text-slate-600">
                Set budgets and savings goals to stay financially disciplined.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900">
              Built for Modern Financial Management
            </h2>
            <p className="mt-6 text-slate-600 text-lg">
              BudgetWise combines simplicity with professional-grade tools used in modern finance platforms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-slate-200
                           hover:shadow-2xl transition"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {f.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST / SECURITY */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Lock className="mx-auto text-emerald-600" size={42} />
          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Trusted by Users, Built with Security First
          </h2>

          <p className="mt-6 text-slate-600 max-w-3xl mx-auto text-lg">
            BudgetWise follows industry security standards to ensure your financial
            information remains protected, private, and under your control.
          </p>

          <div className="mt-14 flex justify-center gap-12 flex-wrap text-slate-700">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-600" />
              Data Encryption
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-indigo-600" />
              User Privacy
            </div>
            <div className="flex items-center gap-3">
              <Lock className="text-purple-600" />
              Secure Authentication
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
