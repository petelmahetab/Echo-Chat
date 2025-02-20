import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import generateTokenANDSetCookie from "../utils/generateToken.js";
import { v2 as cloudinary } from 'cloudinary';

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

    console.log(token)
    res.status(200).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePic: user.profilePic,
      token: token 
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
    res.status(500).json({ error: "Internal Server Error..." });
  }
};




export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, email, profilePic } = req.body;

    // Validation checks
    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required' });
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for duplicate email
    if (email !== existingUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    // Validate base64 image format if profilePic is provided
    if (profilePic && !profilePic.startsWith('data:image')) {
      return res.status(400).json({ message: 'Invalid image format. Please use base64 encoded image' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          userName: username, 
          email, 
          ...(profilePic && { profilePic }) // Only update if provided
        }
      },
      { 
        new: true, 
        runValidators: true,
        context: 'query' // Needed for proper validation
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);

  } catch (error) {
    console.error('Profile update error:', error);

  
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ 
        message: `${field === 'email' ? 'Email' : 'Username'} already exists`
      });
    }

    // Handle invalid ID format
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // General server error
    res.status(500).json({ 
      message: error.message || 'Server error during profile update'
    });
  }
};

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadBase64Image = async (base64String) => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'profile-pictures',
      format: 'webp',
      quality: 'auto:best'
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};