import User from '../models/userModels.js';

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedUserId = req.user._id;

    // Fetch the logged-in user data (or any additional data you need)
    const loggedUser = await User.findById(loggedUserId).select('userName profilePic');

    console.log("Logged-in User:", loggedUser);

    // Send back only the logged-in user's data
    res.status(200).json(loggedUser);
  } catch (error) {
    console.log("Error Occurred at server Side:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
