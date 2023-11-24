const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/User');
exports.isAuthenticatedUser = async(req, res, next)=>{
    try {
        const token =  req.cookies.token;
        if(!token){
            return next(new ErrorHandler("Please login to access this resource", 401));
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);

        next();
    } catch (error) {
        return next(new ErrorHandler(error, 500))
    }
};