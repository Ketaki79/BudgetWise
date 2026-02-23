import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import axios from 'axios';
import { Eye, EyeOff, Camera } from 'lucide-react';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = async () => {
    if (!profilePhoto) return setError("Please select a photo first");

    setLoading(true);
    const formData = new FormData();
    formData.append('photo', profilePhoto);

    try {
      await axios.post('/api/users/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage("Profile photo updated!");
      setPhotoPreview(null);
      setProfilePhoto(null);
      setError('');
    } catch (err) {
      console.error(err);
      setError("Failed to upload photo");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setMessage('');
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword)
      return setError("All fields are required");

    if (newPassword !== confirmPassword)
      return setError("New passwords do not match");

    if (!validatePassword(newPassword))
      return setError(
        "Password must have 8+ chars, uppercase, number & special char"
      );

    setLoading(true);
    try {
      const res = await axios.post('/api/users/change-password', {
        currentPassword,
        newPassword,
      });
      setMessage(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ value, setValue, show, setShow, placeholder }) => (
    <div className="relative mt-4">
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-4 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 shadow-sm placeholder-gray-400 transition"
      />
      <span
        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-indigo-600"
        onClick={() => setShow(!show)}
      >
        {show ? <Eye size={22} /> : <EyeOff size={22} />}
      </span>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-8">Settings</h1>

        <div className="max-w-3xl mx-auto space-y-10">

          {/* Profile Photo Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl flex flex-col items-center space-y-4 transition hover:shadow-2xl">
            <div className="relative group">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-5xl font-bold border-4 border-indigo-200">
                  {/** Initials or icon */}
                  <Camera />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
              />
            </div>
            <button
              onClick={handlePhotoUpload}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl space-y-6 transition hover:shadow-2xl">
            <h2 className="text-2xl font-semibold text-gray-800">Change Password</h2>

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
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 mt-4"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
