const User = require('../models/User');
const UserEngagement = require('../models/UserEngagement')
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const cryptoJs = require('crypto-js')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto');
const ApiFeatures = require('../utils/apiFeatures');
const Activity = require('../models/Activity');
const fs = require('fs');
const Wallet = require('../models/Wallet');
const ResponseHandler = require('../utils/resHandler');

// Register a user
exports.registerUser = async (req, res, next)=>{
    const {name, email, phone, username, dateOfBirth, password} = req.body;
    try {
    const checkUser = await User.findOne({email: email});
        if(checkUser){
            return next(new ErrorHandler("User already registered", 400));
        }
        const user = new User({
            name,
            email,
            phone,
            username,
            dateOfBirth,
            password:cryptoJs.AES.encrypt(password, process.env.SEC_KEY).toString(),
        });

        const otp = user.generateOtp();

        await user.save();

        const message = `Your email verification otp is :- \n\n ${otp} \n\n if you have not requested this mail then please ignore it`;

        await sendEmail({
            email: user.email,
            subject: 'Threads Email Verification',
            message
        });

        
        const userEngagement = await UserEngagement.create({user:user._id})
        const activity = await Activity.create({user:user._id})
        const wallet = await Wallet.create({user:user._id})

        return new ResponseHandler(res, 201, true, `Verification otp has sent to ${user.email} successfully`, user)

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
}

// resend otp
exports.resendOtp = async(req, res, next)=>{
    try {
        const {email} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return next(new ErrorHandler("User not found", 500))
        }

        const otp = user.generateOtp();

        await user.save();

        const message = `Your email verification otp is :- \n\n ${otp} \n\n if you have not requested this mail then please ignore it`;

        await sendEmail({
            email: user.email,
            subject: 'Threads Email Verification',
            message
        });

        return new ResponseHandler(res, 200, true, `Verification otp has sent to ${user.email} successfully`)

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
}

// verify otp
exports.verifyOtp = async(req, res, next)=>{
    try {
        const {otp} = req.body;

        const user = await User.findOne({
            otp,
            otpExpired: {$gt:Date.now()}
        })
        if(!user){
            return next(new ErrorHandler("Otp is invalid or has been expired", 400));
        }

        user.emailVerified=true,
        user.otp=undefined,
        user.otpExpired=undefined

        await user.save()

        sendToken(user, 201, res)
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
}

// update avatar
exports.updateAvatar = async(req, res, next)=>{
    try{
        const user = await User.findOne({_id:req.user._id});

         if(req.file && user.avatar){
           const updatedAvatar = await user.updateOne({avatar:req.file.path})
           if(updatedAvatar){
            fs.unlinkSync(user.avatar)
           }
           
         }else{
            return next(new ErrorHandler("Avatar not updated", 400));
         }

         return new ResponseHandler(res, 200, true, 'Avatar updated successfully')

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
}

// update bio
exports.updateBio = async(req, res, next)=>{
    try{
        const {bio} = req.body
        const user = await User.findOne({_id:req.user._id});

        await user.updateOne({bio})

         return new ResponseHandler(res, 200, true, 'bio updated successfully')

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
}

// check username
exports.checkUsername = async(req, res, next)=>{
    try {
        const {username} = req.body
        const user = await User.findOne({username});

        if(user){
            return next(new ErrorHandler("Username already taken", 400));
        }

        return new ResponseHandler(res, 200, true, 'Username is unique')
        

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
}

// check phone
exports.checkphone = async(req, res, next)=>{
    try {
        const {phone} = req.body
        const user = await User.findOne({phone});

        if(user){
            return next(new ErrorHandler("Phone no already added", 400));
        }

        return new ResponseHandler(res, 200, true, 'Phone no is unique')
        

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
}

// update username
exports.updateBio = async(req, res, next)=>{
    try{
        const {username} = req.body
        const user = await User.findOne({_id:req.user._id});

        await user.updateOne({username})

        return new ResponseHandler(res, 200, true, 'Username updated successfully')

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
}

// Login
exports.login = async (req,res,next)=>{
    try {
        const user = await User.findOne({ $or: [ { email: req.body.email }, { username: req.body.username }, { phone: req.body.phone } ] }).select('+password').select('+emailVerified');

        if(!user){
            return next(new ErrorHandler("Invalid credentials", 401))
        }

        const hashedPassword = cryptoJs.AES.decrypt(user.password, process.env.SEC_KEY);

        const orignalPassword = hashedPassword.toString(cryptoJs.enc.Utf8);

        if(orignalPassword !== req.body.password){
            return next(new ErrorHandler("Invalid Credentials", 401));
        }

        if(user.emailVerified === false){
            const otp = user.generateOtp();

            await user.save({validateBeforeSave:false});

            const message = `Your email verification otp is :- \n\n ${otp} \n\n if you have not requested this mail then please ignore it`;

            await sendEmail({
                email: user.email,
                subject: 'Threads Email Verification',
                message
            });

            return next(new ErrorHandler(`Email verification otp has sent to ${user.email}. Please verify it first`, 401));
        }

        sendToken(user, 201, res)
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
}


// reset password
exports.resetPassword = async (req,res,next)=>{
    try {
        const {email} = req.body;

        const user = await User.findOne({
            email
        });

        if(!user){
            return next(new ErrorHandler("user not found", 400));
        }

        if(req.body.password !== req.body.confirmPassword){
            return next(new ErrorHandler("Password doesn't matched", 400));
        }

        user.password = cryptoJs.AES.encrypt(req.body.password, process.env.SEC_KEY).toString();
        user.otp=undefined;
        user.otpExpired=undefined;
        await user.save();
        sendToken(user,200,res);
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
};

// auth data
exports.authData = (req, res, next)=>{
    try {
        if (req.isAuthenticated()) {
            res.json(req.user);
          } else {
            res.redirect('/');
          }
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// edit profile
exports.editProfile = async(req, res, next)=>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body);
        if(!user){
            return next(new ErrorHandler("User not updated", 500))
        }

        return new ResponseHandler(res, 200, true, "User's profile updated successfully")

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// suggest users

exports.suggestUser = async(req, res, next)=>{
    try {
        const userEngagements = await UserEngagement.findOne({user:req.user._id}, {followers:1})

        let followers=[]
        userEngagements.followers.forEach((f)=>{
            followers.push(f._id.toString)
        })

        const users = await UserEngagement.find({followers:{$in:followers}}, {user:1, followers:1}).populate('user')

        const usersWithMutualFollowers = users.map((userEngagement) => {
            const mutualFollowersCount = userEngagement.followers.filter((follower) => followers.includes(follower._id.toString())).length
            return {
                user: userEngagement.user,
                mutualFollowersCount: mutualFollowersCount,
                followers:userEngagement.followers.length
            }
        })

        return new ResponseHandler(res, 200, true, '', usersWithMutualFollowers) 

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// search users
exports.searchUsers = async(req, res, next)=>{
    try {
        const userEngagement = await UserEngagement.findOne({user:req.user._id}, {blockedUsers:1}) 

        console.log(userEngagement)
        
        let allBlockedUsers = []

        userEngagement.blockedUsers.forEach((u)=>{
            allBlockedUsers.push(u._id.toString())
        })

        const apiFeature = new ApiFeatures(User.find({_id:{$nin:{allBlockedUsers}}}) ,req.query).search().pagination(10);

        const users = await apiFeature.query;

        return new ResponseHandler(res, 200, true, '', users)

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// get single user
exports.getSingleUser = async(req, res, next)=>{
    const {id} = req.params
    try {
        const user = await User.findById(id);

        const userEngagement = await UserEngagement.findOne({user:id}, {followers:1, shoutoutStatus:1})
        
        const follow = userEngagement.followers.find(f => f._id.toString() === req.user._id.toString())

        let followed=false

        if(follow){
            followed=true
        }

        return new ResponseHandler(res, 200, true, '', {
            noOfFollowes: userEngagement.followers.length,
            followed,
            shoutoutStatus:userEngagement.shoutoutStatus,
            user,
        })

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}