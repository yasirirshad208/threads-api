const Activity = require('../models/Activity');
const Post = require('../models/Post');
const UserEngagement = require('../models/UserEngagement');
const ApiFeatures = require('../utils/apiFeatures');
const ErrorHandler = require('../utils/errorHandler');
const ResponseHandler = require('../utils/resHandler');

//Follow user
exports.followUser= async(req, res, next)=>{
    try {
        const {followingUser} = req.body;
        const addFollowing = await UserEngagement.findOne({user:req.user._id});

        const alreadyFollowed = addFollowing.following.find(f => f._id.toString() === followingUser.toString())

        if(alreadyFollowed){
            return next(new ErrorHandler("User already Followed", 400))
        }

        const addFollower = await UserEngagement.findOne({user:followingUser});
        
        addFollowing.following.push(followingUser);

        const followerAdded = addFollower.followers.push(req.user._id);

        if(followerAdded){
            const activity = await Activity.findOne({user:followingUser})
            activity.activities.push({userId:addFollowing.user, activity:'follow'})
            await activity.save({
                validateBeforeSave:false
            })
        }

        await addFollowing.save({
            validateBeforeSave:false
        })

        await addFollower.save({
            validateBeforeSave:false
        })

        return new ResponseHandler(res, 200, true, 'Followed Successfully')

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

exports.unfollowUser= async(req, res, next)=>{
    try {
        const {unFollowingUser} = req.body;
        const removeFollowing = await UserEngagement.findOne({user:req.user._id});

        const removeFollower = await UserEngagement.findOne({user:unFollowingUser});
        
        const remainingFollowings = removeFollowing.following.filter(f => f._id.toString() !== unFollowingUser.toString())

        const followers = removeFollower.followers.filter(follower => follower._id.toString() !== req.user._id.toString());

        await removeFollowing.updateOne({
            following:remainingFollowings
        })

        await removeFollower.updateOne({
            followers
        })

        res.status(201).json({
            success:true,
            message:"Unfollowed Successfully",
        })

        return new ResponseHandler(res, 200, true, 'Unfollowed Successfully')

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// bookmark post
exports.bookmarkPost=async(req, res, next)=>{
    try {
        const {postId} = req.body

        const userEngagement = await UserEngagement.findOne({user:req.user._id});

        const alreadyBookmarked = userEngagement.bookMarkedPosts.find(post => post._id.toString() === postId.toString());

        if(alreadyBookmarked){
            return next(new ErrorHandler("Post already Bookmarked", 400))
        }

        userEngagement.bookMarkedPosts.push(postId);

        await userEngagement.save({
            validateBeforeSave:false
        })

        return new ResponseHandler(res, 200, true, 'Post bookmarked Successfully')

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// unbookmark post
exports.unBookmarPost = async(req, res, next)=>{
    try {
        const {postId} = req.body

        const userEngagement = await UserEngagement.findOne({user:req.user._id});

        const remainingBookmarks = userEngagement.bookMarkedPosts.filter(b => b._id.toString() !== postId.toString())

        await userEngagement.updateOne({
            bookMarkedPosts:remainingBookmarks
        })

        return new ResponseHandler(res, 200, true, 'Post unbookmarked Successfully')

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// get all bookmarked posts
exports.getAllBokkmarkedPosts = async(req, res, next)=>{
    try {
        const getBookmarks = await UserEngagement.findOne({user:req.user._id}, {bookMarkedPosts:1});

        let b = [];

        getBookmarks.bookMarkedPosts.forEach((curr)=>{
            b.push(curr._id.toString())
        })

        const apiFaeture = new ApiFeatures(Post.find({_id:{ $in: b }}).populate('createdBy').sort({ createdAt: -1 }), req.query).pagination(10)

        const posts = await apiFaeture.query

        return new ResponseHandler(res, 200, true, '', posts)
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

//mute user 
exports.muteUser = async(req, res, next)=>{
    try {
        const {userId} = req.body

        const userEngagement = await UserEngagement.findOne({user:req.user._id});

        const alreadyMuted = userEngagement.mutedUsers.find(user => user._id.toString() === userId.toString());

        if(alreadyMuted){
            return next(new ErrorHandler("User already muted", 400))
        }

        userEngagement.mutedUsers.push(userId);

        await userEngagement.save({
            validateBeforeSave:false
        })

        return new ResponseHandler(res, 200, true, 'User muted Successfully')

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// unmute users
exports.unMuteUser = async(req, res, next)=>{
    try {
        const {userId} = req.body

        const userEngagement = await UserEngagement.findOne({user:req.user._id});

        const remainingMutes = userEngagement.mutedUsers.filter(b => b._id.toString() !== userId.toString())

        await userEngagement.updateOne({
            mutedUsers:remainingMutes
        })

        return new ResponseHandler(res, 200, true, 'User unmuted Successfully')

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

//block user
exports.blockUser = async(req, res, next)=>{
    try {
        const {userId} = req.body

        const userEngagement = await UserEngagement.findOne({user:req.user._id});

        const alreadyBlocked = userEngagement.blockedUsers.find(user => user._id.toString() === userId.toString());

        if(alreadyBlocked){
            return next(new ErrorHandler("User already blocked", 400))
        }

        userEngagement.blockedUsers.push(userId);

        await userEngagement.save({
            validateBeforeSave:false
        })

        return new ResponseHandler(res, 200, true, 'User blocked Successfully')

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// unblock user
exports.unBlockUser = async(req, res, next)=>{
    try {
        const {userId} = req.body

        const userEngagement = await UserEngagement.findOne({user:req.user._id});

        const remainingblock = userEngagement.blockedUsers.filter(b => b._id.toString() !== userId.toString())

        await userEngagement.updateOne({
            blockedUsers:remainingblock
        })

        return new ResponseHandler(res, 200, true, 'User unblocked Successfully')

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// hide post
exports.hidePost=async(req, res, next)=>{
    try {
        const {postId} = req.body

        const userEngagement = await UserEngagement.findOne({user:req.user._id}, {hiddenPosts:1});

        const alreadyhidden = userEngagement.hiddenPosts.find(post => post._id.toString() === postId.toString());

        if(alreadyhidden){
            return next(new ErrorHandler("Post already hidden", 400))
        }

        userEngagement.hiddenPosts.push(postId);

        await userEngagement.save({
            validateBeforeSave:false
        })

        return new ResponseHandler(res, 200, true, 'Post hide Successful')

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// unHide post
exports.unHidePost = async(req, res, next)=>{
    try {
        const {postId} = req.body

        const userEngagement = await UserEngagement.findOne({user:req.user._id}, {hiddenPosts:1});

        const remaininghiddens = userEngagement.hiddenPosts.filter(b => b._id.toString() !== postId.toString())

        await userEngagement.updateOne({
            hiddenPosts:remaininghiddens
        })

        return new ResponseHandler(res, 200, true, 'Post unhide Successful')

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}
