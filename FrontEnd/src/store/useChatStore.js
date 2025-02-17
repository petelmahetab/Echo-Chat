import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  socket: null,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/users/sidebar");
  
      
      // Check if the response is already an array
      if (Array.isArray(res.data)) {
        set({ users: res.data });
      }
      
      // Check if it's a nested array
      else if (res.data.users && Array.isArray(res.data.users)) {
        set({ users: res.data.users });
      } 
      // If it's a single user object, store it as an array
      else if (res.data._id && res.data.userName) {
        set({ users: [res.data] }); // Wrap it in an array
      } 
      // Handle unexpected formats
      else {
        console.log("Unexpected response format:", res.data);
        toast.error("Unexpected response format received.");
      }
    } catch (error) {
      console.error("Error Fetching Users:", error);
      toast.error(
        error.response?.data?.message || "An error occurred while fetching users."
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },
  

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Error Fetching Messages:", error);
      toast.error(
        error.response?.data?.message || "An error occurred while fetching messages."
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

      // Using functional update to avoid stale state
      set((state) => ({
        messages: [...state.messages, res.data]
      }));

    } catch (error) {
      console.error("Error Sending Message:", error);
      toast.error(
        error.response?.data?.message || "An error occurred while sending the message."
      );
    }
  },

  initializeSocket: (userId) => {
    const existingSocket = get().socket;
  
    // Avoid re-initializing socket
    if (existingSocket) {
      console.log("Socket already initialized:", existingSocket.id);
      return;
    }
  
    // Initialize socket with userId query param
    const socket = io("http://localhost:5000", {
      query: { userId }
    });
  
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
  
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  
    socket.on("connect_error", (err) => {
      console.log("Socket connection error:", err);
    });
  
    set({ socket });
  },
  

  subscribeToMessages: () => {
    const { selectedUser, socket } = get();

    if (!selectedUser || !socket) {
      console.error(selectedUser ? "Socket not initialized" : "No user selected");
      return;
    }

    // Message handler with proper validation
    const handleNewMessage = (newMessage) => {
      if (!newMessage?.senderId || !newMessage?.content) {
        console.warn("Received invalid message format:", newMessage);
        return;
      }

      // Filter messages for currently selected user
      if (newMessage.senderId === selectedUser._id) {
        set((state) => ({
          messages: [...state.messages, newMessage]
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    // Clean up listener when unsubscribing
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  },

  unsubscribeFromMessages: () => {
    const { socket } = get();
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }
    socket.off("newMessage");
  },

 setSelectedUser: (user) => set({ selectedUser: user }),
}));
