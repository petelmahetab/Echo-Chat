import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:5000"
  : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        // Optionally handle the case when there's no token.
        set({ authUser: null, isCheckingAuth: false });
        return;
      }
      
      const res = await axiosInstance.get("/auth/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
      localStorage.removeItem("authToken");
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("✅ Logged out successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", {
        ...data,
        email: data.email.toLowerCase().trim()
      });

      // Store token in localStorage
      localStorage.setItem("authToken", res.data.token);

      // Log response for debugging
      console.log(res);

      // Set user data in store
      set({
        authUser: res.data,
        isAuthenticated: true
      });

      toast.success("✅ Logged in successfully");
      get().connectSocket();
    } catch (error) {
      if (error.response) {
        // Show error toast only if backend sends an error
        const errorMessage = error.response.data?.error || error.response.data?.message || "❌ Login failed";
        toast.error(errorMessage);
      } else {
        // If there's no response (network error), show a generic message
        toast.error("⚠️ Network error. Please try again.");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },



  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");

      if (res.status === 200) {
        // Only show toast if logout is successful
        toast.success("✅ Logged out successfully");
      }

      set({ authUser: null });
      get().disconnectSocket();
    }  catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.error || error.response.data?.message || "❌ Login failed";
        toast.error(errorMessage);
      } else {
        toast.error("⚠️ Network error. Please try again.");
      }
    }
    
  },


  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // connectSocket: () => {
  //   const { authUser } = get();
  //   if (!authUser || get().socket?.connected) return;

  //   const socket = io(BASE_URL, {
  //     query: { userId: authUser._id },
  //   });

  //   socket.connect();
  //   set({ socket });

  //   socket.on("getOnlineUsers", (userIds) => {
  //     set({ onlineUsers: userIds });
  //   });
  // },

  // disconnectSocket: () => {
  //   const { socket } = get();
  //   if (socket?.connected) {
  //     socket.disconnect();
  //   }
  // },
}));