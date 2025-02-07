import express from "express";
import multer from "multer";
import { sendMessage, getMessage } from "../controllers/messageController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

// Multer setup to handle file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Routes
router.get("/:id", protectRoute, getMessage);
router.post("/send/:id", protectRoute, upload.single("media"), sendMessage);

export default router;
