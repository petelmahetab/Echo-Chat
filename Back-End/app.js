import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js'; 
import connectToMongoDB from "./db/dbConnection.js";
import bodyParser from "body-parser"; 

const app = express();

dotenv.config();  
app.get('/', (req, res) => {
  res.send('Hello');
});

app.use(bodyParser.json());

// OR directly using Express (built-in since v4.16.0)
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;
app.use((req, res, next) => {
  console.log("Raw Body:", req.body);
  next();
});
 
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
