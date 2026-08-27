import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {  
        role : {
            type : String,
            enum : ["student", "admin"],
            default : "student"
        },
        name : {
            type : String,
            required :true,
            trim : true
        },
        enrollmentId : {
            type : String,
            required : function () {return this.role==="student"},
            unique : true,
            uppercase : true,
            trim: true,
            default : undefined
        },
        password : {
            type : String,
            required : true,
            minlength : 6,
        },
        department : {
            type : String,
            required : true,
            trim : true
        },
        graduationYear : {
            type : Number,
            required : function () {return this.role==="student"},
            default : undefined
        },
        phoneNumber : {
            type : String,
            required : true,
            unique : true,
        },
        profilePic : {
            type : String,
            // Will see later
            default : "",
        },
        email : {
            type : String,
            unique : true,
            trim : true,
            default : "",
        },
        verificationStatus : {
            type : String,
            enum: ["pending", "verified", "rejected"],
            default : "verified"
        }
    },

    {
        timestamps : true
    }
);

const User = mongoose.model("User",userSchema);
export default User;