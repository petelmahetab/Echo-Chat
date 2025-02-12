import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Save,ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom"; // Add this import

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    username: authUser?.userName || "",
    email: authUser?.email || "",
    profilePic: authUser?.profilePic || ""
  });

  // Keep formData in sync if authUser changes (e.g., after login)
  useEffect(() => {
    if (authUser) {
      setFormData({
        username: authUser.userName || "",
        email: authUser.email || "",
        profilePic: authUser.profilePic || ""
      });
    }
  }, [authUser]);

  // Handle image upload and update formData.profilePic with base64 data
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        profilePic: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // On submit, update the profile using the formData
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  return (
    <div className="h-screen pt-20">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={formData.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Editable Fields */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="input input-bordered w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Update Button */}
          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="btn btn-primary w-full gap-2"
          >
            {isUpdatingProfile ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Save className="w-5 h-5" />
            )}
            Update Profile
          </button>

          <Link to="/" className="btn btn-ghost w-full gap-2">
              <ChevronLeft className="w-5 h-5" />
              Back to Home
            </Link>

          {/* Account Information */}
          {authUser && (
            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Member Since</span>
                  <span>{authUser.createdAt ? authUser.createdAt.split("T")[0] : ""}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span className="text-green-500">Active</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </form>
      <footer className="mt-10 bg-base-300 rounded-xl p-6 text-center space-y-4">
  <h2 className="text-lg font-medium">Stay Connected</h2>
  
  {/* Social Media Icons */}
  <div className="flex justify-center space-x-4">
    <a href="#" className="text-base-content hover:text-blue-500 transition-all duration-200">
      <i className="fab fa-facebook-f"></i>
    </a>
    <a href="#" className="text-base-content hover:text-blue-400 transition-all duration-200">
      <i className="fab fa-twitter"></i>
    </a>
    <a href="#" className="text-base-content hover:text-pink-500 transition-all duration-200">
      <i className="fab fa-instagram"></i>
    </a>
    <a href="#" className="text-base-content hover:text-blue-600 transition-all duration-200">
      <i className="fab fa-linkedin-in"></i>
    </a>
  </div>

  {/* Quick Navigation Links */}
  <div className="space-x-4 text-sm">
    <Link to="/" className="hover:text-primary transition-all duration-200">Home</Link>
    <Link to="/settings" className="hover:text-primary transition-all duration-200">Settings</Link>
    <Link to="/help" className="hover:text-primary transition-all duration-200">Help</Link>
  </div>

  {/* Contact Information */}
  <p className="text-sm text-zinc-400">
    Contact us: <a href="mailto:support@example.com" className="hover:underline">support@example.com</a>
  </p>

  {/* Copyright Notice */}
  <p className="text-xs text-zinc-500">
    © {new Date().getFullYear()} Your Company. All rights reserved.
  </p>
</footer>
    </div>
  );
};

export default ProfilePage;
