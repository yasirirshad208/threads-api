const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema(
    {
        postId:{
            type:mongoose.Schema.ObjectId,
            ref:'Post'
        },
        userId:{
            type:mongoose.Schema.ObjectId,
            ref:'User'
        },
        message:{
            type:String,
            required:[true, 'Reply message is required']
        },
        likes:[
            {
                userId:{
                    type:mongoose.Schema.ObjectId,
                    ref:'User'
                }
            }
        ],
        replyLiked:{
            type:Boolean,
            default:false,
        }

    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model('Reply', ReplySchema)