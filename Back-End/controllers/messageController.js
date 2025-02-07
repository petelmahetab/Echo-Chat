import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModels.js";
import cloudinary from "../utils/cloudinaryConfig.js"; // Import Cloudinary config

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body; // Extract text from request
    const { id: receiverId } = req.params; // Extract receiverId
    const senderId = req.user._id; // Extract senderId from authenticated user
    let mediaUrl = null; // To store uploaded image/video URL

    if (req.file) {
      // Upload media (image or video) to Cloudinary
      const uploadedMedia = await cloudinary.uploader.upload(req.file.path, {
        folder: "chat_media",
        resource_type: "auto", // Auto-detect image/video
      });

      mediaUrl = uploadedMedia.secure_url; // Store uploaded file URL
    }

    if (!text && !mediaUrl) {
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

    // Create a new message with text or media
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      media: mediaUrl, // Store uploaded media URL
    });

    // Save message and update conversation
    await newMessage.save();
    conversation.messages.push(newMessage._id);
    await conversation.save();

    res.status(200).json({ messageId: newMessage._id, mediaUrl });
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
