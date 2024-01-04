const Activity = require('../models/Activity');
const ApiFeatures = require('../utils/apiFeatures');
const ErrorHandler = require('../utils/errorHandler');
const ResponseHandler = require('../utils/resHandler');

exports.getAllActivities = async (req, res, next)=>{
    try {

        const apiFeature = new ApiFeatures(Activity.findOne({user:req.user._id}).populate('activities.userId'), req.query).pagination(10)

        const activity = await apiFeature.query;

        if(!activity){
            return next(new ErrorHandler("Activity not found", 401))
        }

        activity.activities.sort((a, b) => b.activityTime - a.activityTime);

        return new ResponseHandler(res, 200, true, '', activity)
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
}