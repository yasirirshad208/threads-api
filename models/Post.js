const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        text:{
            type: String,
        },
        media:{
            type:String
        },
        likes:[
            {
                _id:{
                    type:mongoose.Schema.ObjectId,
                    ref:"User"
                },
                createdAt:{
                    type:Date,
                    default:Date.now
                }
            }
        ],
        createdBy:{
            type:mongoose.Schema.ObjectId,
            ref:"User"
        },
        sharedPostId:{
            type:mongoose.Schema.ObjectId,
            ref:'Post'
        },
        postType:{
            type:String,
            enum:['post', 'shoutout']
        },
        shoutoutRequestId:{
            type:mongoose.Schema.ObjectId,
            ref:'ShoutoutRequest'
        },
        postBookmarked:{
            type:Boolean,
            default:false
        },
        postLiked:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model('Post', PostSchema)