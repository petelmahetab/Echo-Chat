import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Save } from "lucide-react";

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
    </div>
  );
};

export default ProfilePage;
