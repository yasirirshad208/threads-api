const Reply = require('../models/Reply');
const ReReply = require('../models/ReReply');
const Post = require('../models/Post');
const Activity = require('../models/Activity')
const ErrorHandler = require('../utils/errorHandler');
const ApiFeatures = require('../utils/apiFeatures');
const ResponseHandler = require('../utils/resHandler');

//reply on post
exports.replyPost = async(req, res, next)=>{
    try {
        const{postId, message} = req.body
        const post = await Post.findById(postId);
        if(!post){
            return next(new ErrorHandler(`post not found`, 401));
        }

        const replyAdded = await Reply.create({
            postId,
            userId:req.user._id,
            message
        })

        if(replyAdded){
            const activity = await Activity.findOne({user:post.createdBy})
            activity.activities.push({userId:req.user._id, activity:'reply'})
            await activity.save({
                validateBeforeSave:false
            })
        }

        return new ResponseHandler(res, 201, true, 'Reply added successfully', replyAdded)

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

//edit reply on post
exports.editReply = async(req, res, next)=>{
    try {
        const{repId, message} = req.body

        const reply = await Reply.findByIdAndUpdate(repId, {message});

        if(!reply){
            return next(new ErrorHandler(`Reply not found`, 404));
        }

        return new ResponseHandler(res, 200, true, 'Reply updated successfully')
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// delete reply

exports.deleteReply = async(req, res, next)=>{
    try {
        const{repId} = req.body
        const reply = await Reply.findById(repId);
        if(!reply){
            return next(new ErrorHandler(`Reply not found`, 404));
        }

        await reply.deleteOne()

        return new ResponseHandler(res, 200, true, 'Reply deleted successfully')
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

//like reply
exports.likeReply = async(req, res, next)=>{
    try {
        const reply = await Reply.findById(req.params.id);
        if(!reply){
            return next(new ErrorHandler(`Reply not found`, 401));
        }

        const alreadyLiked = reply.likes.find(l => l._id.toString() === req.user._id.toString());


        if(alreadyLiked){
            return next(new ErrorHandler(`Reply already liked`, 401));
        }

        const likeAdded = reply.likes.push(req.user._id);

        if(likeAdded){
            const activity = await Activity.findOne({user:reply.userId})
            activity.activities.push({userId:req.user._id, activity:'replyLike'})
            await activity.save({
                validateBeforeSave:false
            })
        }

        const noOfLikes=reply.likes.length;

        await reply.save({
            validateBeforeSave:false
        })

        return new ResponseHandler(res, 200, true, 'Liked successfully', {noOfLikes})
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

//unlike reply
exports.unLikeReply = async(req, res, next)=>{
    try {
        const reply = await Reply.findById(req.params.id);
        if(!reply){
            return next(new ErrorHandler(`Reply not found`, 401));
        }

        const likes = reply.likes.filter((like) => {
            like._id.toString() !== req.user._id.toString()
        });

        const noOfLikes=likes.length;

        await reply.updateOne({
            likes
        })

        return new ResponseHandler(res, 200, true, 'UnLiked successfully', {noOfLikes})
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// get all replies of the post
exports.getAllReplies = async(req, res, next)=>{
    try {
        const {postId} = req.params

        const apiFeature = new ApiFeatures(Reply.find({postId}).populate('userId'), req.query).pagination(10)

        const replies = await apiFeature.query

        if(!replies){
            return next(new ErrorHandler(`Replies not found`, 401));
        }

        // replies.forEach((rep)=>{

        // })
        return new ResponseHandler(res, 200, true, '', {
            noOfReplies:replies.length,
            replies
        })
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// get user replies on posts
exports.getUserRepliesOnPosts = async(req, res, next)=>{
    const {userId} = req.params
    try {

        const apiFeature = new ApiFeatures(Reply.find({ userId }).populate('userId').sort({ createdAt: -1 }), req.query).pagination(10)

        const replies = await apiFeature.query;

        return new ResponseHandler(res, 200, true, '', {
            replies
        })
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

//ReReply of a reply
exports.reReplyOfReply = async(req, res, next)=>{
    try {
        const{repId, postId, message} = req.body
        const reply = await Reply.findById(repId);
        if(!reply){
            return next(new ErrorHandler(`Reply not found`, 401));
        }

        const replyAdded = await ReReply.create({
            postId,
            repId,
            userId:req.user._id,
            message:message
        })

        if(replyAdded){
            const activity = await Activity.findOne({user:reply.userId})
            activity.activities.push({userId:req.user._id, activity:'reply'})
            await activity.save({
                validateBeforeSave:false
            })
        }

        return new ResponseHandler(res, 200, true, 'Reply added successfully', replyAdded)
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

//edit reReply
exports.editReReply = async(req, res, next)=>{
    try {
        const{reRepId, message} = req.body
        const reReply = await ReReply.findByIdAndUpdate(reRepId,{message});
        if(!reReply){
            return next(new ErrorHandler(`Reply not found`, 401));
        }

        return new ResponseHandler(res, 200, true, 'Reply Updated successfully')
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// delete reReply
exports.deleteReReply = async(req, res, next)=>{
    try {
        const{reRepId} = req.body
        const reReply = await ReReply.findByIdAndDelete(reRepId);
        if(!reReply){
            return next(new ErrorHandler(`Reply not found`, 404));
        }

        return new ResponseHandler(res, 200, true, 'Reply deleted successfully')
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

//like reReply
exports.likeReReply = async(req, res, next)=>{
    try {
        const reReply = await ReReply.findById(req.params.id);
        if(!reReply){
            return next(new ErrorHandler(`Reply not found`, 404));
        }

        const alreadyLiked = reReply.likes.find(l => l._id.toString() === req.user._id.toString());


        if(alreadyLiked){
            return next(new ErrorHandler(`Reply already liked`, 401));
        }

        const likeAdded = reReply.likes.push(req.user._id);

        if(likeAdded){
            const activity = await Activity.findOne({user:reReply.userId})
            activity.activities.push({userId:req.user._id, activity:'replyLike'})
            await activity.save({
                validateBeforeSave:false
            })
        }

        const noOfLikes=reReply.likes.length;

        await reReply.save({
            validateBeforeSave:false
        })

        return new ResponseHandler(res, 200, true, 'Liked successfully', {
            noOfLikes
        })

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

//unlike reply
exports.unLikeReReply = async(req, res, next)=>{
    try {
        const reReply = await ReReply.findById(req.params.id);
        if(!reReply){
            return next(new ErrorHandler(`Reply not found`, 401));
        }

        const likes = reReply.likes.filter((like) => {
            like._id.toString() !== req.user._id.toString()
        });

        const noOfLikes=likes.length;

        await reReply.updateOne({
            likes
        })

        return new ResponseHandler(res, 200, true, 'UnLiked successfully', {
            noOfLikes
        })
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}