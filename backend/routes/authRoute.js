import express from "express"
import { authCheck, login, logout, signup } from "../controllers/authController.js";
import protectRoute from "../middleware/protectRoute.js";

const authRouter = express.Router();

authRouter.post('/signup',signup);
authRouter.post('/login',login);
authRouter.post('/logout',logout);

authRouter.get('/check',protectRoute,authCheck);


export default authRouter;