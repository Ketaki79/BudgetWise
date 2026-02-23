import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputsRef = useRef([]);

  // If email is not provided, redirect to register page
  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  // ======================
  // Handle digit input
  // ======================
  const handleChange = (e, index) => {
    const val = e.target.value;
    if (!/^\d?$/.test(val)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Focus next input if a digit is entered
    if (val && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // ======================
  // Handle backspace
  // ======================
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputsRef.current[index - 1].focus();
    }
  };

  // ======================
  // Validate OTP
  // ======================
  const isOtpValid = () => {
    if (otp.some(d => !d)) return 'Please enter all 6 digits';
    return '';
  };

  // ======================
  // Verify OTP
  // ======================
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const otpError = isOtpValid();
    if (otpError) {
      setError(otpError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/verify-otp',
        null,
        { params: { email, otpInput: otp.join('') } }
      );

      if (response.status === 200) {
        setMessage('OTP verified successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500); // Redirect after 1.5s
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setError(err.response.data || 'Invalid OTP');
      } else if (err.response?.status === 404) {
        setError('Email not found. Please register first.');
        setTimeout(() => navigate('/register'), 1500);
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Resend OTP
  // ======================
  const handleResendOtp = async () => {
    setError('');
    setMessage('');
    setResending(true);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/resend-otp',
        null,
        { params: { email } }
      );

      if (response.status === 200) {
        setMessage('A new OTP has been sent to your email');
        setOtp(['', '', '', '', '', '']); // clear inputs
        inputsRef.current[0].focus();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to resend OTP. Try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-400 via-indigo-500 to-cyan-400 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
          Verify Your Email
        </h2>
        <p className="text-center text-sm text-slate-600 mb-6">
          Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-5">
          {/* OTP Inputs */}
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={el => (inputsRef.current[index] = el)}
                className="w-12 h-12 text-center text-xl rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                maxLength={1}
              />
            ))}
          </div>

          {/* Error & Message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {message && <p className="text-green-600 text-sm mt-2">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-4 text-center text-sm">
          Didn't receive the OTP?{' '}
          <button
            onClick={handleResendOtp}
            disabled={resending}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {resending ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>

        {/* Back to Login */}
        <div className="mt-6 text-center text-sm text-slate-600">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 font-bold hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
