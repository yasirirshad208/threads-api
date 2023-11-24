const mongoose = require('mongoose');

const ReReplySchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.ObjectId,
            ref:'User'
        },
        postId:{
            type:mongoose.Schema.ObjectId,
            ref:'Post'
        },
        repId:{
            type:mongoose.Schema.ObjectId,
            ref:'Reply'
        },
        message:{
            type:String
        },
        likes:[
            {
                userId:{
                    type:mongoose.Schema.ObjectId,
                    ref:'User'
                }
            }
        ]
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model('ReReply', ReReplySchema)