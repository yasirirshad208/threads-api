const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        text:{
            type: String,
        },
        media:[
            {
                url:{
                    type:String
                }
            }
        ],
        likes:[
            {
                userId:{
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
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model('Post', PostSchema)