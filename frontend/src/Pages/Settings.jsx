import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // individual eye toggle for each field
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // profile photo
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handlePasswordReset = async () => {
    setMessage('');
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters, include uppercase, number, and special character"
      );
      return;
    }

    try {
      const response = await axios.post('/api/users/change-password', {
        currentPassword,
        newPassword,
      });
      setMessage(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error("Password reset error:", err.response || err);
      setError(err.response?.data?.message || "Error updating password");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = async () => {
    if (!profilePhoto) {
      setError("Please select a photo first");
      return;
    }

    const formData = new FormData();
    formData.append('photo', profilePhoto);

    try {
      const response = await axios.post('/api/users/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage("Profile photo updated successfully!");
      setError('');
      setProfilePhoto(null);
    } catch (err) {
      console.error("Photo upload error:", err.response || err);
      setError("Failed to upload photo");
    }
  };

  const PasswordInput = ({ value, setValue, show, setShow, placeholder }) => (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="p-3 rounded border w-full pr-10"
      />
      <span
        className="absolute right-3 top-3 cursor-pointer text-gray-500"
        onClick={() => setShow(!show)}
      >
        {show ? <Eye size={20} /> : <EyeOff size={20} />}
      </span>
    </div>
  );

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 bg-gray-50 min-h-screen text-gray-800">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">Settings</h1>

        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-6 max-w-md">
          {/* Profile Photo */}
          <h2 className="font-semibold text-lg">Profile Photo</h2>
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
          )}
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
          <button
            onClick={handlePhotoUpload}
            className="bg-indigo-600 text-white px-4 py-2 rounded mt-2 hover:bg-indigo-700 transition"
          >
            Upload Photo
          </button>

          {/* Change Password */}
          <h2 className="font-semibold text-lg mt-4">Change Password</h2>
          {message && <p className="text-green-600 font-medium">{message}</p>}
          {error && <p className="text-red-600 font-medium">{error}</p>}

          <PasswordInput
            value={currentPassword}
            setValue={setCurrentPassword}
            show={showCurrent}
            setShow={setShowCurrent}
            placeholder="Current Password"
          />
          <PasswordInput
            value={newPassword}
            setValue={setNewPassword}
            show={showNew}
            setShow={setShowNew}
            placeholder="New Password"
          />
          <PasswordInput
            value={confirmPassword}
            setValue={setConfirmPassword}
            show={showConfirm}
            setShow={setShowConfirm}
            placeholder="Confirm New Password"
          />

          <button
            onClick={handlePasswordReset}
            className="bg-indigo-600 text-white px-4 py-3 rounded mt-4 font-semibold hover:bg-indigo-700 transition"
          >
            Update Password
          </button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
