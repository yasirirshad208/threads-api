const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.ObjectId,
            ref:'User'
        },
        balance:{
            type: Number,
            default:2000,
        },
        transactionHistory:[
            {
                transactionType:{
                    type:String
                },
                amount:{
                    type: Number
                },
                createdAt:{
                    type:Date,
                    default:Date.now
                }
            }
        ]
    },
    {
        timestamps:true
    }
)

module.exports = mongoose.model('Wallet', WalletSchema)