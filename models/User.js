const mongoose = require('mongoose');
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')

const UserSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true, "Name is required"],
        },
        email:{
            type:String,
            required:[true, "Email is required"],
            unique:true,
        },
        phone:{
            type:String,
            required:[true, "Phone no is required"],
            unique:true,
        },
        username:{
            type:String,
            unique:true,
            required:[true, "username is required"],
        },
        dateOfBirth:{
            type:Date,
        },
        avatar:{
            type: String,
        },
        bio:{
            type:String,
        },
        userVerified:{
            type:Boolean,
            default:false,
            select: false
        },
        password:{
            type:String,
            required:[true, "Password is required"],
            select: false
        },
        emailVerified:{
            type:Boolean,
            default:false,
            select: false
        },
        isAdmin:{
            type:Boolean,
            default:false,
            select: false
        },
        otp: Number,
        otpExpired: Date
    },
    {
        timestamps:true
    }
);

// Generating otp
UserSchema.methods.generateOtp = function(){
    // Generating Token
    const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets:false, specialChars: false });
    
    // Hashing and adding reset password token to user schema
    this.otp = otp;
    this.otpExpired = Date.now() + 2 * 60 * 1000;
    return otp;
}

// JWT Token
UserSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
}

module.exports = mongoose.model('User', UserSchema)