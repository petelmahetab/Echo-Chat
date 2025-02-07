import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String }, // Optional text message
    media: { type: String }, // Cloudinary URL for image or video
    mediaType: { type: String, enum: ["image", "video", "auto"], default: "auto" }, // Stores type
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
