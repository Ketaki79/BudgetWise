import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Receipt,
  BarChart3,
  Target,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Wallet,
  TrendingUp
} from "lucide-react";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import wealthIllustration from "../assets/logo.jpg";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Smart Expense Tracking",
      desc: "Track daily income and expenses with structured categorization, ensuring accuracy and clarity across all financial activities.",
      icon: <Receipt size={26} />,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      title: "Advanced Financial Analytics",
      desc: "Analyze spending patterns, income trends, and balances through clean dashboards designed for better decision-making.",
      icon: <BarChart3 size={26} />,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Goal & Budget Planning",
      desc: "Define monthly budgets and long-term savings goals while monitoring progress in real time.",
      icon: <Target size={26} />,
      color: "from-pink-500 to-pink-600"
    },
    {
      title: "Enterprise-Grade Security",
      desc: "Your financial data is protected with encryption, secure authentication, and privacy-first architecture.",
      icon: <ShieldCheck size={26} />,
      color: "from-emerald-500 to-emerald-600"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "₹10M+", label: "Expenses Tracked" },
    { number: "4.9/5", label: "User Rating" },
    { number: "99.9%", label: "System Uptime" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      <Navbar />

      {/* HERO */}
      <section id="home" className="pt-40 pb-32 bg-indigo-50">

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <div>

            <span className="text-sm font-semibold text-indigo-700 bg-indigo-100 px-4 py-2 rounded-full">
              Smart Personal Finance Platform
            </span>

            <h1 className="text-5xl font-bold leading-tight mt-6 text-slate-900">
              Manage Your Money <br /> Smarter with BudgetWise
            </h1>

            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              BudgetWise helps individuals and families gain complete control
              over their finances by tracking expenses, analyzing financial
              patterns, and planning budgets effectively.
            </p>

            <ul className="mt-8 space-y-3 text-slate-600">
              {[
                "Track income and expenses easily",
                "Visual financial reports and analytics",
                "Secure financial management platform"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-indigo-600" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-center gap-6">

              <button
                onClick={() => navigate("/register")}
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg"
              >
                Get Started
                <ArrowRight size={18} />
              </button>

              <span className="text-sm text-slate-500">
                Free to start • No credit card required
              </span>

            </div>

          </div>

          <div className="flex justify-center">

            <div className="relative">

              <div className="absolute -top-6 -left-6 bg-white shadow-xl rounded-xl p-4 text-sm">
                <p className="text-slate-500">Monthly Savings</p>
                <p className="text-green-600 font-bold text-lg">₹12,400</p>
              </div>

              <div className="absolute bottom-6 -right-6 bg-white shadow-xl rounded-xl p-4 text-sm">
                <p className="text-slate-500">Expenses</p>
                <p className="text-red-500 font-bold text-lg">₹6,200</p>
              </div>

              <img
                src={wealthIllustration}
                alt="Dashboard"
                className="max-w-lg w-full rounded-2xl shadow-2xl"
              />

            </div>

          </div>

        </div>

      </section>

      {/* STATS */}
      <section className="py-24 bg-white">

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">

          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-indigo-50 p-8 rounded-xl text-center shadow-sm hover:shadow-lg transition"
            >
              <h3 className="text-4xl font-bold text-indigo-600">
                {s.number}
              </h3>

              <p className="mt-2 text-slate-600">
                {s.label}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* ABOUT */}
      <section id="about" className="py-32 bg-slate-50">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center text-slate-900">
            How BudgetWise Works
          </h2>

          <p className="mt-6 text-center text-slate-600 max-w-3xl mx-auto text-lg">
            BudgetWise simplifies financial management by combining expense
            tracking, analytics and goal planning in a single platform.
          </p>

          <div className="mt-20 grid md:grid-cols-3 gap-10">

            <div className="bg-white p-10 rounded-2xl shadow-md text-center hover:shadow-xl transition">
              <Wallet className="mx-auto text-indigo-600" size={36} />
              <h3 className="mt-6 text-xl font-semibold">
                Add Transactions
              </h3>
              <p className="mt-3 text-slate-600">
                Easily record income and expenses with structured categories.
              </p>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-md text-center hover:shadow-xl transition">
              <BarChart3 className="mx-auto text-purple-600" size={36} />
              <h3 className="mt-6 text-xl font-semibold">
                Analyze Spending
              </h3>
              <p className="mt-3 text-slate-600">
                Visual dashboards help you understand where your money goes.
              </p>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-md text-center hover:shadow-xl transition">
              <TrendingUp className="mx-auto text-pink-600" size={36} />
              <h3 className="mt-6 text-xl font-semibold">
                Improve Finances
              </h3>
              <p className="mt-3 text-slate-600">
                Set goals and track progress to achieve better financial health.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 bg-slate-100">

        <div className="max-w-7xl mx-auto px-6">

          <div className="mb-24 text-center max-w-3xl mx-auto">

            <h2 className="text-4xl font-bold text-slate-900">
              Built for Modern Financial Management
            </h2>

            <p className="mt-6 text-slate-600 text-lg">
              BudgetWise combines simplicity with professional-grade tools
              used in modern financial platforms.
            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-2xl hover:-translate-y-1 transition"
              >

                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-white bg-linear-to-r ${f.color} mb-6`}
                >
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

      <Footer />

    </div>
  );
};

export default Home;