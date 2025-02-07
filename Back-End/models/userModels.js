import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: {  // Changed fullName to userName
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    profilePic: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// Export the User model
const User = mongoose.model('User', userSchema);
export default User;
