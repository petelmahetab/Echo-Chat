import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

// Add Authorization Header if a token is stored
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // Assuming you store the token in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { axiosInstance };
