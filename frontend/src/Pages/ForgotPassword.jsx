import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputGroup from '../Components/InputGroup';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      alert('OTP sent to your email');
      navigate('/verify-login', { state: { email } }); // updated route
    } catch (err) {
      if (err.response?.status === 404) alert('Email not registered');
      else alert('Something went wrong, check backend logs');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-4xl shadow-2xl p-10">
        <h2 className="text-xl font-semibold text-blue-500 text-center mb-8">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputGroup
            label="Email"
            name="email"
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="w-full bg-indigo-500 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-opacity">
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
