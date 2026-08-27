import jwt from "jsonwebtoken"
import User from "../models/UserModel.js";
export default async function protectRoute(req,res,next) {
    try {
        // If the user is unauthorised
        const token = req.cookies.authCookie;
        if(!token) {
            return res.status(401).json({message : "Unauthorised! No token provided"});
        }

        // Verify the token by server : 
        const payloadObj = jwt.verify(token,process.env.SECRET_KEY);
        const existingUser = await User.findOne({_id : payloadObj.userId},{password:0});

        if(!existingUser) {return res.status(404).json({message : "User Not Found"})};

        if(payloadObj) {
            req.AuthUser = payloadObj;
            next();
        };
    }

    catch(error) {
        console.log(`Error in protectRoute : ${error.message}`);
        return res.status(401).json({message: "Unauthorized - Invalid or expired token" });
    }
}