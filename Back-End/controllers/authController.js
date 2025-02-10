import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import generateTokenANDSetCookie from "../utils/generateToken.js";

export const signUp = async (req, res) => {
  try {
    const { email, userName, password, confirmPassword } = req.body;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if the email is already registered
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // Default Profile Pic (Can be updated later)
    const profilePic = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;

    // Create new user
    const newUser = new User({
      email,
      userName,  
      password: hashedPass,
      profilePic
    });


    // Save user to DB
    await newUser.save();
    generateTokenANDSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      userName: newUser.userName,  
      email: newUser.email,
      profilePic: newUser.profilePic
    });

  } catch (err) {
    console.log("Error in Sign Up Route:", err.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
   
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid Email or Password." });
    }

    generateTokenANDSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      userName: user.userName,  // Changed from fullName to userName
      email: user.email,
      profilePic: user.profilePic
    });

  } catch (err) {
    console.log("Error while logging in:", err.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const logOutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Successfully Logged Out." });

  } catch (error) {
    console.log("Error during log out:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};


export const check=(req,res)=>{
  
}