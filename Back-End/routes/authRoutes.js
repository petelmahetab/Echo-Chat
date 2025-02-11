import express from 'express'
import { loginUser, logOutUser, signUp } from '../controllers/authController.js';
import protectRoute from '../middlewares/protectRoute.js'

const router=express.Router()

router.post('/signup',signUp)
router.post('/login',loginUser)
router.post("/logout", logOutUser);

router.get("/check", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    res.json(user);
  });
});
  

export default router;