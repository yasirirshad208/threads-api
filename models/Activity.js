const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User"
        },
        activities:[
            {
                userId:{
                    type:mongoose.Schema.ObjectId,
                    ref:"User"
                },
                activity:{
                    type:String,
                    enum:['postLike', 'replyLike', 'follow', 'reply', 'reReply', 'share']
                },
                activityTime:{
                    type:Date,
                    default:Date.now()
                }
            }
        ]
    }
)

module.exports = mongoose.model('Activity', ActivitySchema)