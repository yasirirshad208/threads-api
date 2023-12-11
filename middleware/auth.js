const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/User');

exports.isAuthenticatedUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;

        

        if (!token) {
            return next(new ErrorHandler("Unauthorized", 401));
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedData) => {
            if (err) {
                return next(new ErrorHandler("Unauthorized", 401));
            }

            req.user = await User.findById(decodedData.id);

            if (!req.user || !req.user._id) {
                return next(new ErrorHandler("Unauthorized: User not found", 401));
            }

            next();
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};