const Activity = require('../models/Activity');
const ApiFeatures = require('../utils/apiFeatures');
const ErrorHandler = require('../utils/errorHandler');
const ResponseHandler = require('../utils/resHandler');

exports.getAllActivities = async (req, res, next)=>{
    try {

        const apiFeature = new ApiFeatures(Activity.findById(req.params.id), req.query).pagination(10)

        const activity = await apiFeature.query;

        if(!activity){
            return next(new ErrorHandler("Activity not found", 401))
        }

        return new ResponseHandler(res, 200, true, '', activity)
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}