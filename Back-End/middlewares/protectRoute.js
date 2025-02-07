import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    console.log(token)
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Server error in protectRoute:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;
