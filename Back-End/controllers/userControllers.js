import User from '../models/userModels.js';

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedUser = req.user._id;

    // Fetch all users except the logged-in user
    const filteredUsers = await User.find({ _id: { $ne: loggedUser } })
      .select("userName profilePic");

    console.log("Filtered Users:", filteredUsers);

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error Occurred at server Side:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
