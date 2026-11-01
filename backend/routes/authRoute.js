import express from "express"
import { authCheck, getProfile, login, logout, signup, updateProfile } from "../controllers/authController.js";
import protectRoute from "../middleware/protectRoute.js";

const authRouter = express.Router();

authRouter.post('/signup',signup);
authRouter.post('/login',login);
authRouter.post('/logout',logout);

authRouter.get('/check',protectRoute,authCheck);
authRouter.get('/profile',protectRoute,getProfile);
authRouter.patch('/profile',protectRoute,updateProfile);


export default authRouter;
