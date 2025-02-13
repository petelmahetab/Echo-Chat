import User from '../models/userModels.js';

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedUser = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: loggedUser } }).select("-password").select("userName profilePic"); ; 

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error Occurred at server Side:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};