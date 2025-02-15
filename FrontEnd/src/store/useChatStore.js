import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser:null,
  isUsersLoading: false,
  isMessagesLoading: false,
  socket: null,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/users/sidebar");
      console.log(res.data)
      set({ users: res.data });
    } catch (error) {
      console.log('Error caught Fetching the Users')
      toast.error(error.response.data.message);
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
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  
  initializeSocket: (userId) => {
    const socket = io("http://localhost:5000", {
      query: { userId }
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    set({ socket });
  },

  subscribeToMessages: () => {
  const { selectedUser } = get();
  if (!selectedUser) return;

  const socket = useAuthStore.getState().socket;

  // Ensure socket is initialized before subscribing
  if (!socket) {
    console.error("Socket not initialized");
    return;
  }
    // socket.on("newMessage", (newMessage) => {
    //   const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
    //   if (!isMessageSentFromSelectedUser) return;

    //   set({
    //     messages: [...get().messages, newMessage],
    //   });
    // });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }
  
    //socket.off("newMessage");
  },

  setSelectedUser: (user) => {
    if (!user) {
      set({ selectedUser: null, messages: [] });
    } else {
      set({ selectedUser: user, messages: [] });
    }
  },
})); 