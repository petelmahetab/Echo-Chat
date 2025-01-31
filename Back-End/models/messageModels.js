import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null, // Initially null, will be set when the message is deleted
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

const Message = mongoose.model("Message", messageSchema);
export default Message;