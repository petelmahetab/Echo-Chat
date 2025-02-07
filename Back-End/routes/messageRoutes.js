import express from "express";
import multer from "multer";
import { sendMessage, getMessage } from "../controllers/messageController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

// Multer setup for handling multiple file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Routes
router.get("/:id", protectRoute, getMessage);
router.post("/send/:id", protectRoute, upload.array("media", 5), sendMessage); // Allow multiple files

export default router;
