import User from '../models/userModels.js';

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedUserId = req.user._id;

    // Fetch all users except the logged-in user
    const users = await User.find({ _id: { $ne: loggedUserId } }).select('userName profilePic');

    console.log("All Users for Sidebar:", users);

    // Send back the array of users
    res.status(200).json(users);
  } catch (error) {
    console.log("Error Occurred at server Side:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

