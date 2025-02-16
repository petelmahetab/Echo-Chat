import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';
import connectToMongoDB from "./db/dbConnection.js";

import messageRoutes from './routes/messageRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import cors from 'cors';
import { createServer } from "http";
import { Server } from "socket.io";
import helmet from 'helmet';

const app = express();

dotenv.config();

app.get('/', (req, res) => {
  res.send('Hello');
});

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true,             
}));

// Socket.IO setup
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io/"
});

// Socket events handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("sendMessage", (message) => {
    console.log("Received message:", message);
    io.emit("message", message); // Broadcast the message to all clients
  });
  socket.on("disconnect", () => {     
    console.log("A user disconnected:", socket.id);
  });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', usersRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
