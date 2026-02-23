import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideEye, LucideEyeOff } from 'lucide-react';
import InputGroup from '../Components/InputGroup';
import axios from 'axios';
import { useTransactions } from '../Context/TransactionsContext';
import logo from '../assets/budget.png';

const Login = () => {
  const navigate = useNavigate();
  const { fetchTransactions } = useTransactions();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ✅ Validation
  const validate = (name, value) => {
    const val = value.trim();

    if (name === 'email' && !/^[a-z0-9.]+@gmail\.com$/.test(val)) {
      return 'Email must be lowercase, numbers only, end with @gmail.com';
    }

    if (
      name === 'password' &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(val)
    ) {
      return 'Password must be 8+ chars, uppercase, lowercase, number & symbol';
    }

    return '';
  };

  const handleEvent = (e) => {
    const { name, value, type } = e.target;

    if (type === 'blur') {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validate(name, value),
    }));
  };

  // ✅ Submit Handler
  const handleSubmit = async (e) => {
  e.preventDefault();

  const emailError = validate('email', formData.email);
  const passwordError = validate('password', formData.password);

  if (emailError || passwordError) {
    setErrors({
      email: emailError,
      password: passwordError,
    });

    setTouched({
      email: true,
      password: true,
    });

    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:8080/api/auth/login',
      formData
    );

    // ✅ SAVE JWT TOKEN
    localStorage.setItem("token", response.data.token);

    // ✅ Fetch transactions AFTER saving token
    await fetchTransactions();

    alert('Login successful!');
    navigate('/dashboard');

  } catch (err) {
    if (err.response?.status === 404) {
      alert('User not registered');
      navigate('/register');
    } else if (err.response?.status === 401) {
      alert('Invalid password');
    } else if (err.response?.status === 403) {
      alert('Email not verified. Please verify your email first.');
      navigate('/verify-email', { state: { email: formData.email } });
    } else {
      alert('Something went wrong');
    }
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-400 via-blue-500 to-cyan-400 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">

        {/* Logo Section */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-xl border-2 border-indigo-500 bg-white shadow-md">
            <img src={logo} alt="BudgetWise" className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-indigo-700">
            BudgetWise
          </h1>
        </div>

        <h2 className="text-xl font-semibold text-blue-500 text-center mb-8">
          Login
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>

          <InputGroup
            label="Email"
            name="email"
            type="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleEvent}
            onBlur={handleEvent}
            error={touched.email && errors.email}
          />

          <div className="relative">
            <InputGroup
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleEvent}
              onBlur={handleEvent}
              error={touched.password && errors.password}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-10 text-slate-400"
            >
              {showPassword ? (
                <LucideEye size={20} />
              ) : (
                <LucideEyeOff size={20} />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-indigo-500 to-cyan-400 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
          >
            Login
          </button>

        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-blue-600 font-bold hover:underline"
          >
            Forgot Password?
          </button>
        </p>

        <p className="mt-8 text-center text-sm text-slate-600">
          Don't have an account?
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 font-bold ml-1 hover:underline"
          >
            Register
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;
