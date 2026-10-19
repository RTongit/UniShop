import express from "express"
import protectRoute from "../middleware/protectRoute.js";
import isAdmin from "../middleware/isAdmin.js";
import { getVerificationRequests, updateStudentVerificationStatus } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get('/verification-requests',protectRoute, isAdmin, getVerificationRequests);

adminRouter.patch('/verification-requests/:studentId',protectRoute, isAdmin, updateStudentVerificationStatus);


export default adminRouter;
