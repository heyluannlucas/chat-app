import { Router } from 'express';
import { signup, login, getUserInfo, updateProfile } from '../controllers/AuthController.js'; 
import { verifyToken } from '../middlewares/AuthMiddleware.js';

const authRoutes = Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login)
authRoutes.post('/user-info', verifyToken, getUserInfo)
authRoutes.post('/update-profile', verifyToken, updateProfile)


export default authRoutes;
