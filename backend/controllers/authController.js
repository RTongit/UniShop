import createJWT from "../lib/jwt.js";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";
import { createHash,randomBytes } from "node:crypto";
import { sendPasswordResetEmail } from "../lib/emailService.js";

const FRONTEND_URL =  process.env.FRONTEND_URL 


async function signup(req,res) {
    const {name,enrollmentId,password,department,graduationYear,phoneNumber,email} = req.body;
    try {

        if(!name || !enrollmentId || !password || !department || !graduationYear || !phoneNumber || !email) {
            return res.status(400).json({message : "All fields are required"});
        }

        if(password.length<6) {
            return res.status(400).json({message:"Password must be atleast 6 characters long"})
        }

        // check the email format : 
        if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
           return res.status(400).json({ message: "Enter a valid email address." });
        }

        // Check for duplicate email : 
        let existingUser = await User.findOne({email})
        if(existingUser) return res.status(400).json({message : "Email number already exists"});

        // check for duplicate phone number as well :
        existingUser = await User.findOne({phoneNumber})
        if(existingUser) return res.status(400).json({message : "Phone number already exists"});

        // Check for duplicate enrollmentId :
        existingUser = await User.findOne({enrollmentId});
        if(existingUser) return res.status(400).json({message : "Enrollment ID already exists"});

        // Generate Hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        

        // newUser is js object but with added mongoose features
        const newUser = new User({
            name : name,
            enrollmentId : enrollmentId,
            password : hashedPassword,
            department : department,
            graduationYear : graduationYear,
            phoneNumber : phoneNumber,
            profilePic : "",
            email : email,
            role : "student",
            verificationStatus : "pending"
        })
        await newUser.save();

        // todo : will create a jwt
        const token = createJWT(newUser,res);

        return res.status(201).json(
        {
            userId : newUser._id,
            name : newUser.name,
            role : newUser.role,
            enrollmentId : newUser.enrollmentId,
            department : newUser.department,
            graduationYear : newUser.graduationYear,
            phoneNumber : newUser.phoneNumber,
            profilePic : newUser.profilePic,
            email : newUser.email,
            role : newUser.role,
            verificationStatus : "pending",
        }
        );
    }
    catch(error) {
        console.log(`Error in signup controller : ${error.message}`);
        return res.status(500).json({message : "Internal Server error"})
    }
}

async function login(req,res) {
    try {
        const {email,password} = req.body;

        if((!password || password==="") || (!email || email==="")) {
            return res.status(400).json({message : "Invalid credentials"});
        }
        // Verify the user
        let existingUser = await User.findOne({email : email});
        if(!existingUser) return res.status(400).json({message : "Invalid credentials"});

        // Verify the password : 
        const isMatched = await bcrypt.compare(password,existingUser.password);
        if(!isMatched) return res.status(400).json({message : "Invalid credentials"});
        
        // jwt is generated : 
        createJWT(existingUser,res);

        return res.status(200).json({
            userId : existingUser._id,
            name : existingUser.name,
            role : existingUser.role,
            verificationStatus : existingUser.verificationStatus,
        })
    }
    catch(error) {
        console.log(`Error in login controller : ${error.message}`);
        return res.status(500).json({message : "Internal Server error"});
    }
}

async function logout(req,res) {
    try {
        // jwt is cleared :
        res.clearCookie('authCookie',
        {   
            secure : (process.env.NODE_ENV==="production") ? true : false,
            sameSite : process.env.NODE_ENV === "production" ? "none" : "lax", 
            httpOnly: true,
        })
        return res.status(200).json({message : "You have successfully logged out"});

    }
    catch(error) {
        console.log(`Error in logout controller : ${error.message}`);
        return res.status(500).json({message : "Internal Server error"})
    }
}

function authCheck(req,res) {
    try {
        return res.status(200).json({
            ...req.AuthUser,
            verificationStatus: req.verificationStatus,
        });
    }
    catch(error) {
        console.log(`Error in authCheck controller ${error.message}`)
        return res.status(500).json({message : "Internal Server Error"});
    }
}

async function getProfile(req, res) {
    try {
        const user = await User.findById(req.AuthUser.userId).select("name email phoneNumber enrollmentId department graduationYear profilePic role verificationStatus rejectionReason createdAt");
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
    } catch (error) {
        console.log(`Error in getProfile controller: ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function updateProfile(req, res) {
    try {
        const { profilePic } = req.body;
        if (typeof profilePic !== "string" || !/^data:image\/(png|jpeg|jpg|webp);base64,/.test(profilePic)) {
            return res.status(400).json({ message: "Choose a valid image for your profile photo" });
        }
        const uploadedImage = await cloudinary.uploader.upload(profilePic, { folder: "unishop/profile-pictures" });
        const user = await User.findByIdAndUpdate(
            req.AuthUser.userId,
            { $set: { profilePic: uploadedImage.secure_url } },
            { new: true, runValidators: true }
        ).select("name email phoneNumber enrollmentId department graduationYear profilePic role verificationStatus rejectionReason createdAt");
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
    } catch (error) {
        console.log(`Error in updateProfile controller: ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function requestPasswordReset(req, res) {
    const {email} = req.body
    try {
        // check if the user exist or not in db based on the email :
        const existingUser = await User.findOne({email : email});
        
        if(!existingUser) return res.status(400).json({message : "If an account exists with that email, you’ll receive a password reset link shortly."});

        // generating the token : 
        const resetToken = randomBytes(32).toString("hex");

        // hashing the token : 
        const resetTokenHash = createHash("sha256") // choose SHA-256 as the hashing algorithm
        .update(resetToken)                        // give the token to the hash function
        .digest("hex");                            // output the hash as a hex string

    
        // storing the hashed token to the db along with the expiry time: 
        await User.findOneAndUpdate({email : email}, 
            {$set : {  passwordResetTokenHash : resetTokenHash, 
                       passwordResetExpiresAt : new Date(Date.now() + 30 * 60 * 1000) 
                       // validity 30 min 
                    }
            }
        )

        // sends an email link with the actual token 
        try {
            const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
            await sendPasswordResetEmail(existingUser.email,resetUrl);

        }
        catch(sendEmailError) {

            // revert the changes made to the DB : 
            await User.findOneAndUpdate(
                {email : email, passwordResetTokenHash: resetTokenHash,}, 
                {$set : {  passwordResetTokenHash : null, 
                           passwordResetExpiresAt : null,
                           // validity 30 min 
                        }
                }
            )

            console.log(`Error in requestPasswordReset controller : ${sendEmailError.message}`);
            return res.status(500).json({message : "We couldn’t process your request right now. Please try again later."})
        }

    }

    catch(error) {
        console.log(`Error in requestPasswordReset controller : ${error.message}`);
        return res.status(500).json({message : "Internal Server error"})
    }
    return res.status(200).json({message : "If an account exists with that email, you’ll receive a password reset link shortly."})
}

async function resetPassword(req,res) {
    const {token, newPassword} = req.body
    try {

        // check for empty token and password : 
        if(!token || typeof token !== "string" || token.trim() === "") return res.status(400).json({message : "Invalid or missing reset token."})
        if(!newPassword || typeof newPassword !== "string" || newPassword.length === 0) return res.status(400).json({message : "Password is empty"})
        if(newPassword.length<6) return res.status(400).json({message : "Password must be atleast 6 characters long"})

        // hashing the token : 
        const hashedToken = createHash("sha256") // choose SHA-256 as the hashing algorithm
        .update(token)                        // give the token to the hash function
        .digest("hex");  

        const existingUser = await User.findOne(
            {
                passwordResetTokenHash : hashedToken,
                passwordResetExpiresAt : {$gt : new Date()}
            }
        )
        if(!existingUser) return res.status(400).json({message : "This password reset link is invalid or has expired. Please request a new one."})

        // hash the newPassword 
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword,salt);

        // update the user password 
        const updatedUser = await User.findOneAndUpdate(
            {_id : existingUser._id, passwordResetTokenHash : hashedToken, passwordResetExpiresAt : {$gt : new Date()}},
            {$set : 
                {
                    password : hashedNewPassword,
                    passwordResetTokenHash : null,
                    passwordResetExpiresAt : null
                }
            },
            {returnDocument : "after"}
        )

        // if the token gets expired just before updating the user 
        // if two request happens at the same time 
        // the below handles that 

        if (!updatedUser) {
           return res.status(400).json({
           message: "This password reset link is invalid or has expired. Please request a new one.",
           });
        }

        // todo : also the devices that this user is logged in must be logged out ,ie jwt must be cleared

        return res.status(200).json({message : "Password has been reset successfully. Please log in with your new password."})
    }

    catch(error) {
        console.log(`Error in resetPassword controller: ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export {signup,login,logout,authCheck,getProfile,updateProfile,requestPasswordReset,resetPassword};
