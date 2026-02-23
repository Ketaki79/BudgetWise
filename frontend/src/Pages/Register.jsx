import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideEye, LucideEyeOff } from 'lucide-react';
import axios from 'axios';
import InputGroup from '../Components/InputGroup';
import logo from '../assets/budget.png';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [agreementError, setAgreementError] = useState('');
  const [backendError, setBackendError] = useState(''); // ✅ backend error message

  const validate = (name, value) => {
    const val = value.trim();
    if (name === 'username') {
      const normalized = val.replace(/\s+/g, ' ');
      if (normalized.length < 3) return 'Username must be at least 3 characters';
      if (!/^[A-Za-z ]+$/.test(normalized))
        return 'Username must contain only letters and spaces';
    }
    if (name === 'email') {
      if (!val) return 'Enter a valid email address';
      if (!val.endsWith('@gmail.com')) return 'Email must end with @gmail.com';
      if (/\s/.test(val)) return 'Email must not contain spaces';
      if (!/^[a-z0-9@.]+$/.test(val))
        return 'Email must only contain lowercase letters, numbers, @ and .';
    }
    if (name === 'password') {
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(val)) {
        return 'Password must contain uppercase, lowercase, number & symbol';
      }
    }
    if (name === 'confirmPassword' && val !== formData.password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleEvent = (e) => {
    const { name, value, type } = e.target;
    if (type === 'blur') setTouched(prev => ({ ...prev, [name]: true }));
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError(''); // reset backend error

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (!agreed) {
      setAgreementError('You must agree to the User Agreement, Privacy Policy and Cookie Policy');
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ username: true, email: true, password: true, confirmPassword: true });
      return;
    }

    try {
      const normalizedUsername = formData.username.trim().replace(/\s+/g, ' ');
      const response = await axios.post(
        'http://localhost:8080/api/auth/register',
        {
          username: normalizedUsername,
          email: formData.email.toLowerCase().trim(),
          password: formData.password
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // ✅ Registration successful, go to OTP page
      navigate('/verify-email', { state: { email: formData.email.toLowerCase().trim() } });

    } catch (err) {
      console.error(err);

      // Show backend error on the form
      if (err.response) {
        // If backend returns string message
        const msg = typeof err.response.data === 'string'
          ? err.response.data
          : err.response.data?.message || 'Something went wrong';
        setBackendError(msg);
      } else {
        setBackendError('Cannot reach server. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-400 via-blue-500 to-cyan-400 p-4">
      <div className="w-full max-w-md bg-white rounded-4xl shadow-2xl p-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-xl border-2 border-indigo-500 bg-white shadow-md">
            <img src={logo} alt="BudgetWise" className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-indigo-700">BudgetWise</h1>
        </div>

        <h2 className="text-xl font-semibold text-blue-500 text-center mb-8">
          Create your account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <InputGroup label="Username" name="username" placeholder="Enter Username" value={formData.username} onChange={handleEvent} onBlur={handleEvent} error={touched.username && errors.username} />
          <InputGroup label="Email" name="email" type="email" placeholder="Enter Email" value={formData.email} onChange={handleEvent} onBlur={handleEvent} error={touched.email && errors.email} />

          <div className="relative">
            <InputGroup label="Password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter Password" value={formData.password} onChange={handleEvent} onBlur={handleEvent} error={touched.password && errors.password} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-10 text-slate-400">
              {showPassword ? <LucideEye size={20} /> : <LucideEyeOff size={20} />}
            </button>
          </div>

          <div className="relative">
            <InputGroup label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter Password" value={formData.confirmPassword} onChange={handleEvent} onBlur={handleEvent} error={touched.confirmPassword && errors.confirmPassword} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-10 text-slate-400">
              {showConfirmPassword ? <LucideEye size={20} /> : <LucideEyeOff size={20} />}
            </button>
          </div>

          <div className="flex items-start gap-2 text-sm text-black">
            <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setAgreementError(''); }} className="mt-1" />
            <p>By clicking Register, you agree to our <span className="font-semibold">User Agreement</span>, <span className="font-semibold">Privacy Policy</span> and <span className="font-semibold">Cookie Policy</span>.</p>
          </div>
          {agreementError && <p className="text-red-500 text-xs">{agreementError}</p>}
          {backendError && <p className="text-red-500 text-xs">{backendError}</p>} {/* ✅ backend error displayed */}

          <button disabled={!agreed} className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transition-opacity ${agreed ? 'bg-linear-to-r from-indigo-500 to-cyan-400 text-white hover:opacity-90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Register</button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">Already have an account?
          <button onClick={() => navigate('/login')} className="text-blue-600 font-bold ml-1 hover:underline">Login</button>
        </p>
      </div>
    </div>
  );
};

export default Register;
