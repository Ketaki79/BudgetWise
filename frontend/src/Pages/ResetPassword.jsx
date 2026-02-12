import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InputGroup from '../Components/InputGroup';
import axios from 'axios';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { email, otp } = useLocation().state || {};
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return alert('Passwords do not match');

    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      alert('Password updated successfully');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data || 'Something went wrong');
    }
  };

  if (!email || !otp) return null; // prevent direct access

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <div className="w-full max-w-md bg-white rounded-4xl shadow-2xl p-10">
        <h2 className="text-xl font-semibold text-blue-500 text-center mb-8">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputGroup
            label="New Password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <InputGroup
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="w-full bg-indigo-500 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-opacity">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
