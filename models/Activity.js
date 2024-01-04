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

// ActivitySchema.pre('findOne', function (next) {
//     this.populate({
//         path: 'activities.userId',
//         options: { sort: { 'activityTime': -1 } } // Sort in descending order based on activityTime
//     });
//     next();
// });


module.exports = mongoose.model('Activity', ActivitySchema)