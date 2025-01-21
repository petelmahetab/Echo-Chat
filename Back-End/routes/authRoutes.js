import express from 'express'
import { loginUser, logOutUser, signUp } from '../controllers/authController.js';

const router=express.Router()

router.post('/signup',signUp)
router.get('/login',loginUser)
router.get('/logout',logOutUser)


export default router;