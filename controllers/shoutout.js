const ShoutoutRequest = require('../models/ShoutoutRequest');
const UserEngagement = require('../models/UserEngagement');
const Wallet = require('../models/Wallet');
const ApiFeatures = require('../utils/apiFeatures');
const ErrorHandler = require('../utils/errorHandler');
const ResponseHandler = require('../utils/resHandler');

// request shoutout
exports.requestShoutout = async(req, res, next)=>{
    try {
        const {toUser, shoutoutFor, name, gender, wishFrom, wishFromGender, occasion, occasionDate, payment} = req.body

        const shoutout = await ShoutoutRequest.create({
            fromUser:req.user._id,
            toUser,
            shoutoutFor,
            name,
            gender,
            wishFrom,
            wishFromGender,
            occasion,
            occasionDate,
            payment
        })

       

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// update request status
exports.updateRequestStatus = async (req, res, next)=>{
    try {
        const {requestStatus, id} = req.body

        const shoutoutRequest = await ShoutoutRequest.findByIdAndUpdate(id, {
            requestStatus
        })
        if(!shoutoutRequest){
            return next(new ErrorHandler("Shoutout request not updated", 500))
        }

        return new ResponseHandler(res, 200, true, 'Shoutout request updated successfully')

    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// update shoutout status of user
exports.updateShoutoutStatus = async (req, res, next)=>{
    try {
        const {shoutoutStatus} = req.body;
        const userEngagement = await UserEngagement.findOneAndUpdate({user:req.user._id}, {shoutoutStatus})

        return new ResponseHandler(res, 200, true, 'Shoutout status updated successfully')
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// update shoutout price
exports.updateShoutoutPrice = async(req, res, next)=>{
    try {
        const {shoutoutPrice, shoutoutDeliveryDays} = req.body

        const userEngagement = await UserEngagement.findOneAndUpdate({user:req.user._id}, {shoutoutPrice,shoutoutDeliveryDays})

        return new ResponseHandler(res, 200, true, 'Shoutout price updated successfully')
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}

// get all shoutout requests of user
exports.getAllRequestedShoutout = async(req, res, next)=>{
    try {

        const apiFeature = new ApiFeatures(ShoutoutRequest.find({toUser:req.user._id}).populate('fromUser'), req.query).pagination(10);

        const shoutoutRequests = await apiFeature.query;

        return new ResponseHandler(res, 200, true, '', shoutoutRequests)
     } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}