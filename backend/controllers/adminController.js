import User from "../models/UserModel.js";
import { isValidObjectId } from "mongoose";

async function getVerificationRequests(req, res) {
  try {
    const students = await User.find({role : "student"}).select("-password").sort({createdAt : 1})
    return res.status(200).json(students)
  } 
  catch (error) {
    console.log(`Error in getVerificationRequests controller : ${error.message}`);
    return res.status(500).json({message : "Internal Server error"})
  }
}

async function updateStudentVerificationStatus(req,res) {
  const {verificationStatus,rejectionReason} = req.body
  const studentId = req.params.studentId

  try {
    // check if it is valid studentId format or not : 
    if(!isValidObjectId(studentId)) return res.status(400).json({message : "Invalid objectId"})

    // check if the student exist or not 
    const existingUser = await User.findOne({_id : studentId,role : "student"});
    if(!existingUser) return res.status(404).json({message : "User does not exist"})

    const updatedUser = await User.findOneAndUpdate(
        {_id : studentId, role : "student", verificationStatus : "pending"},
        {$set : {
          verificationStatus : verificationStatus, 
          rejectionReason : (verificationStatus === "rejected") ? rejectionReason : ""}
        },
        {returnDocument : "after"}
    ).select("-password")

    if(!updatedUser) return res.status(409).json({message : "This student verification request has already been reviewed."}) 

    return res.status(200).json(updatedUser)

    //  Need to take care of the rest condition when two admin update the same document

  }

  catch(error) {
    console.log(`Error in updateStudentVerificationStatus controller : ${error.message}`);
    return res.status(500).json({message : "Internal Server error"})
  }
}

export {getVerificationRequests,updateStudentVerificationStatus};