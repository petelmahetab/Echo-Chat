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

    // In signUp controller
if (password.length < 6) {
  return res.status(400).json({ error: "Password must be at least 6 characters" });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({ error: "Invalid email format" });
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
    
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();
    
    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: normalizedEmail });

    // Check if user exists first
   if (!user) {
  return res.status(400).json({ error: "Invalid Email or Password." });
}


    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid Email or Password." });
    }

    // Generate token and get it for response
    const token = generateTokenANDSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePic: user.profilePic,
      token: token // Send token in response body
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


export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.user; 
    const { username, email } = req.body;
    
    if (!username || !email) {
      return res.status(400).json({ message: "Username and email are required" });
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Find user and update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        userName: username,
        email: email.toLowerCase().trim(),
        ...(req.file && { profilePic: req.file.path }) 
      },
      { new: true, select: '-password' } // Return updated user without password
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
    
  } catch (error) {
    console.error("Update profile error:", error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    res.status(500).json({ message: "Server error updating profile" });
  }
};
