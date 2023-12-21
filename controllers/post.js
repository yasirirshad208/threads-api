const Post = require('../models/Post');
const UserEngagement = require('../models/UserEngagement')
const Activity = require('../models/Activity')
const ErrorHandler = require('../utils/errorHandler');
const fs = require('fs');
const ApiFeatures = require('../utils/apiFeatures');
const ResponseHandler = require('../utils/resHandler');


// create post
exports.createPost = async(req, res, next)=>{
    try {
        const {text, media, postType,shoutoutRequestId} = req.body;

        const post = await Post.create({
            text,
            media,
            createdBy:req.user._id,
            postType,
            shoutoutRequestId
        })
        return new ResponseHandler(res, 201, true, '', post)
        
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
}

//upload post images
exports.uploadPostImage = async (req, res, next)=>{
    let mediaUrl;
    if(req.file){
        mediaUrl=req.file.path
    }else{
        return next(new ErrorHandler("Image not uploaded", 500));
    }

    return new ResponseHandler(res, 201, true, 'Media uploaded', {
        url:mediaUrl
    })
}

// get All posts
exports.getAllPosts = async(req,res,next)=>{
    try {
        const userEngagement = await UserEngagement.findOne({user:req.user._id}, {bookMarkedPosts:1, mutedUsers:1, blockedUsers:1, hiddenPosts:1})

        let mutedUsers = [];
        let blockedUsers = [];
        let hiddenPosts = [];

        userEngagement.mutedUsers.forEach((curr)=>{
            mutedUsers.push(curr._id.toString())
        })

        userEngagement.hiddenPosts.forEach((curr)=>{
            hiddenPosts.push(curr._id.toString())
        })

        userEngagement.blockedUsers.forEach((curr)=>{
            blockedUsers.push(curr._id.toString())
        })

        const resultPerPage = 10;

        const apiFeature = new ApiFeatures(Post.find({createdBy:{ $nin:[mutedUsers,blockedUsers, hiddenPosts] }}).populate(['createdBy', 'sharedPostId']).sort({ createdAt: -1 }), req.query).pagination(resultPerPage);

        const posts = await apiFeature.query;
       
        let allPosts=[]

        posts.forEach((post)=>{
            const likedPost = post.likes.find(l => l._id.toString() === req.user._id.toString());

            const postBookmarked = userEngagement.bookMarkedPosts.find(b => b._id.toString() === post._id.toString())

            let currPost = post  

            postBookmarked ? currPost.postBookmarked = true : currPost.postBookmarked = false

            likedPost ? currPost.postLiked = true : currPost.postLiked = false

            allPosts.push(currPost)
        })

        
        return new ResponseHandler(res, 200, true, '', allPosts)
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
}

// // edit Post
// exports.editPost = async(req, res,next)=>{
//     try {
//         const {id} = req.params
//         // const {threadText} = req.body
//         const post = await Post.findById(id);
//         if(!post){
//             return next(new ErrorHandler(`Post not found with id: ${id}`, 401));
//         }
        
//         const postEdit = await post.updateOne(
//             req.body,
//             // req.file ? {media:req.file.path} : {}
//         )

//         if(req.body.media && post.media.length > 0){
//             post.media.forEach((curr)=>{
//                 fs.unlinkSync(curr.url)
//             })
//         }

//         res.status(201).json({
//             success:true,
//             message:"Post edited successfully",
//             postEdit
//         })
//     } catch (error) {
//         return next(new ErrorHandler(error, 500))
//     }
// }

// // delete Post
// exports.deletePost = async(req, res,next)=>{
//     try {
//         const {id} = req.params;
//         const post = await Post.findById(id);
//         if(!post){
//             return next(new ErrorHandler(`Post not found with id: ${id}`, 401));
//         }

//         if(req.user._id.toString() === post.createdBy.toString()){
//             await post.deleteOne();
//         }else{
//             return next(new ErrorHandler("You don't have access to delete this post", 401))
//         }
        
//         res.status(201).json({
//             success:true,
//             message:`${id} deleted successfully`
//         })
//     } catch (error) {
//         return next(new ErrorHandler(error, 500))
//     }
// }

// share post
exports.sharePost = async(req, res, next)=>{
    try {
        const {id} = req.params;
        
        const post = await Post.findById(id);

        if(!post){
            return next(new ErrorHandler("Post not found", 401))
        }

        const postCreated = await Post.create({
            sharedPostId: post._id,
            createdBy:req.user._id
        })

        if(postCreated){
            const activity = await Activity.findOne({user:post.createdBy})
            activity.activities.push({userId:req.user._id, activity:'share'})
            await activity.save({
                validateBeforeSave:false
            })
        }

        return new ResponseHandler(res, 201, true, 'Post shared successfully')
        
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
}

// get a post
exports.getPost = async(req, res, next)=>{
    try {
        const {id} = req.params
        const post = await Post.findOne({_id:id}).populate(['shoutoutRequestId', 'sharedPostId', 'createdBy'])
        if(!post){
            return next(new ErrorHandler(`Post not found`, 404));
        }

        const likedPost = post.likes.find(l => l._id.toString() === req.user._id.toString());

        likedPost ? post.postLiked = true : ''

        return new ResponseHandler(res, 200, true, '', post)
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

//like post
exports.likePost = async(req, res, next)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return next(new ErrorHandler(`post not found`, 401));
        }

        const alreadyLiked = post.likes.find(l => l._id.toString() === req.user._id.toString());


        if(alreadyLiked){
            return next(new ErrorHandler(`Post already liked`, 401));
        }

        const likeAdded = post.likes.push(req.user._id);

        if(likeAdded){
            const activity = await Activity.findOne({user:post.createdBy})
            activity.activities.push({userId:req.user._id, activity:'postLike'})
            await activity.save({
                validateBeforeSave:false
            })
        }

        const noOfLikes=post.likes.length;

        await post.save({
            validateBeforeSave:false
        })

        return new ResponseHandler(res, 201, true, 'Liked Successfully', {
            noOfLikes
        })
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

//unlike post
exports.unLikePost = async(req, res, next)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return next(new ErrorHandler(`post not found`, 401));
        }

        const likes = post.likes.filter((like) => {
            like._id.toString() !== req.user._id.toString()
        });

        const noOfLikes=likes.length;

        await post.updateOne({
            likes
        })

        return new ResponseHandler(res, 201, true, 'UnLiked successfully', {
            noOfLikes
        })
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}
//get all likes of a post
exports.getAllLikes=async(req, res, next)=>{
    try {
        const {postId} = req.params
        const post = await Post.findOne({_id:postId}, {likes:1}).populate({
            path: 'likes._id', 
        })

        const userEngagement = await UserEngagement.findOne({user:req.user._id}, {following:1})

        const postLikes = post.likes.map((like)=>({
            _id:like._id._id,
            name:like._id.name,
            username:like._id.username,
            avatar:like._id.avatar,
            currUserFollowed: userEngagement
            ? userEngagement.following.some(
                (follow) => follow._id.toString() === like._id._id.toString()
              )
            : false,
        }))
        
        return new ResponseHandler(res, 200, true, '', postLikes)
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// get  all user posts
exports.getAllUserPosts = async(req, res, next)=>{
    try {
        const {userId} = req.params

        const userEngagement = await UserEngagement.findOne({user:req.user._id}, {bookMarkedPosts:1, hiddenPosts:1})

        let hiddenPosts = []

        userEngagement.hiddenPosts.forEach((curr)=>{
            hiddenPosts.push(curr._id.toString())
        })

        const apiFeature = new ApiFeatures(Post.find({createdBy:userId, _id:{$nin:hiddenPosts}}).populate(['createdBy', 'shoutoutRequestId', 'sharedPostId']).sort({ createdAt: -1 }), req.query).pagination(10)

        const posts = await apiFeature.query;

        let allPosts = [];

        posts.forEach((post)=>{
            const likedPost = post.likes.find(l => l._id.toString() === req.user._id.toString());

            const postBookmarked = userEngagement.bookMarkedPosts.find(b => b._id.toString() === post._id.toString())

           let currPost = post                

            postBookmarked ? currPost.postBookmarked = true : currPost.postBookmarked = false

            likedPost ? currPost.postLiked = true : currPost.postLiked = false

            allPosts.push(currPost)
        })

        return new ResponseHandler(res, 200, true, '', allPosts)
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

