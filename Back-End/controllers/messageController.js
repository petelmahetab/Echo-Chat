import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModels.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body; // Extract the message content from the request body
    const { id: receiverId } = req.params; // Extract the receiverId from the request params
    const senderId = req.user._id; // Extract the senderId from the authenticated user

    // Find or create a conversation between the sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [], // Initialize the messages array
      });
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message, // The message content (title)
    });

    // Save the new message to the database
    await newMessage.save();

    // Push the new message's ID to the conversation's messages array
    conversation.messages.push(newMessage._id);

    // Save the updated conversation
    await conversation.save();

    // Send a success response with the new message's ID
    res.status(200).json({ messageId: newMessage._id });

  } catch (error) {
    console.log("Error Occurred at server Side:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessage=async(req,res)=>{
  try {
    const {id:userToChatId}=req.params;
    const senderId=req.user._id;

    const conversation=await Conversation.findOne({
      participants:{$all:[senderId,userToChatId]},
    }).populate('messages');


    if(!conversation) return res.status(200).json([])
const message=conversation.messages;
    res.status(200).json(message)

  } catch (error) {
    console.log("Error Occured at server Side")
    res.status(500).json({err:"Internal Server Error"})
  }
}