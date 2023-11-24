const mongoose = require('mongoose');

const ShoutoutRequestSchema = new mongoose.Schema(
    {
        fromUser:{
            type: mongoose.Schema.ObjectId,
            ref:"User"
        },
        toUser:{
            type: mongoose.Schema.ObjectId,
            ref:"User"
        },
        shoutoutFor:{
            type:String,
            required:true,
            enum:['me', 'someone']
        },
        name:{
            type:String,
            required:true
        },
        gender:{
            type:String,
            enum:['male', 'female']
        },
        wishFrom:{
            type:String,
        },
        wishFromGender:{
            type:String,
            enum:['male', 'female']
        },
        occasion:{
            type:String,
            required:true
        },
        occasionDate:{
            type:Date,
        },
        payment:{
            paymentMethod:{
                type:String
            },
            amount:{
                type:String
            },
            paymentStatus:{
                type:String
            }
        },
        requestStatus:{
            type:String,
            enum:['pending', 'rejected', 'accepted', 'completed'],
            default: 'pending'
        }
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model("ShoutoutRequest", ShoutoutRequestSchema);