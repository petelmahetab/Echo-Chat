import express from 'express'
import protectRoute from '../middlewares/protectRoute.js';
import { getUserForSidebar } from '../controllers/userControllers.js';

const router=express.Router();

router.get('/sidebar',protectRoute,getUserForSidebar);

export default router;