import createJWT from "../lib/jwt.js";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs"

async function signup(req,res) {
    const {name,enrollmentId,password,department,graduationYear,phoneNumber,email} = req.body;
    try {

        if(!name || !enrollmentId || !password || !department || !graduationYear || !phoneNumber) {
            return res.status(400).json({message : "All fields are required"});
        }

        if(password.length<6) {
            return res.status(400).json({message:"Password must be atleast 6 characters long"})
        }
        // Check for duplicate enrollmentId :
        let existingUser = await User.findOne({enrollmentId});
        if(existingUser) return res.status(400).json({message : "Enrollment ID already exists"});

        // check for duplicate phone number as well :
        existingUser = await User.findOne({phoneNumber})
        if(existingUser) return res.status(400).json({message : "Phone number already exists"});

        // Generate Hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        // todo : admin will verify later
        const success = true

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
            verificationStatus : (success) ? "verified" : "rejected"
        })
        await newUser.save();

        // todo : will create a jwt
        const token = createJWT(newUser,res);

        return res.status(201).json(
        {
            name : newUser.name,
            enrollmentId : newUser.enrollmentId,
            department : newUser.department,
            graduationYear : newUser.graduationYear,
            phoneNumber : newUser.phoneNumber,
            profilePic : newUser.profilePic,
            email : newUser.email,
            role : newUser.role,
            verificationStatus : newUser.verificationStatus,
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
        const {enrollmentId,password,email} = req.body;

        if((!password || password==="") || ((!enrollmentId || enrollmentId==="") &&(!email || email===""))) {
            return res.status(400).json({message : "Invalid credentials"});
        }
        // Verify the user
        let existingUser = await User.findOne({$or : [{enrollmentId:enrollmentId},{email:email}]});
        if(!existingUser) return res.status(400).json({message : "Invalid credentials"});

        // Verify the password : 
        const isMatched = await bcrypt.compare(password,existingUser.password);
        if(!isMatched) return res.status(400).json({message : "Invalid credentials"});
        
        // jwt is generated : 
        createJWT(existingUser,res);

        return res.status(200).json({
            userId : existingUser._id,
            name : existingUser.name,
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
            // todo : Need to change for production
            secure : false,
            sameSite : "lax",
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
        return res.status(200).json(req.AuthUser);
    }
    catch(error) {
        console.log(`Error in authCheck controller ${error.message}`)
        return res.status(500).json({message : "Internal Server Error"});
    }
}


export {signup,login,logout,authCheck};
