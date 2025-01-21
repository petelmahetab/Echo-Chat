import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const dbConnection = async () => {
  try {
    const url = process.env.MONGO_DB_URL;
    //console.log("MongoDB URL:", url); // Log the URL to check if it's loaded correctly

    if (!url) {
      throw new Error('MONGO_DB_URL is not defined in environment variables');
    }

    await mongoose.connect(url);
    console.log("Connected to Cloud DB successfully");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
};

export default dbConnection;
