import User from '../models/userModels.js'; // Add .js extension

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedUser = req.user._id; // Get the logged-in user's ID

    // Find all users except the logged-in user
    const filteredUsers = await User.find({ _id: { $ne: loggedUser } }).select("-password"); // Exclude passwords

    res.status(200).json(filteredUsers); // Send the filtered users as a response
  } catch (error) {
    console.log("Error Occurred at server Side:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};