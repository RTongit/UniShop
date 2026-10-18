import express from "express"
import protectRoute from "../middleware/protectRoute.js";
import isAdmin from "../middleware/isAdmin.js";
import { getPendingVerificationRequests } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get('/verification-requests',protectRoute, isAdmin, getPendingVerificationRequests);

export default adminRouter;
