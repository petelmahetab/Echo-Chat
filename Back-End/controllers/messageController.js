import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModels.js";
import cloudinary from "../utils/cloudinaryConfig.js"; // Import Cloudinary config

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body; // Extract text from request
    const { id: receiverId } = req.params; // Extract receiverId
    const senderId = req.user._id; // Extract senderId from authenticated user

    let mediaUrls = []; // To store uploaded media URLs

    if (req.files && req.files.length > 0) {
      // Upload multiple files to Cloudinary
      for (let file of req.files) {
        const uploadedMedia = await cloudinary.uploader.upload(file.path, {
          folder: "chat_media",
          resource_type: "auto", // Auto-detect image/video
        });
        mediaUrls.push(uploadedMedia.secure_url); // Store uploaded file URL
      }
    }

    if (!text && mediaUrls.length === 0) {
      return res.status(400).json({ error: "Message must contain text or media." });
    }

    // Find or create a conversation between sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    // Create a new message with text and media URLs
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      media: mediaUrls, // Store multiple media URLs
    });

    // Save message and update conversation
    await newMessage.save();
    conversation.messages.push(newMessage._id);
    await conversation.save();

    res.status(200).json({ messageId: newMessage._id, mediaUrls });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error occurred in getMessage:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
