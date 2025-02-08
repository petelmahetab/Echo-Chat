import express from 'express'
import { loginUser, logOutUser, signUp } from '../controllers/authController.js';
import protectRoute from '../middlewares/protectRoute.js'

const router=express.Router()

router.post('/signup',signUp)
router.get('/login',loginUser)
router.get('/logout',logOutUser)

router.get("/check", protectRoute, (req, res) => {
    // If protectRoute passes, req.user will be available
    res.json({ authenticated: true, user: req.user });
  });
  

export default router;