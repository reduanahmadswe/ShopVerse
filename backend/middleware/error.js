import HandleError from '../utils/handleError.js';

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // CastError
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new HandleError(message, 400);
    }
    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new HandleError(message, 400);
    }
    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(value => value.message).join(', ');
        err = new HandleError(message, 400);
    }

    // JsonWebTokenError
    if (err.name === 'JsonWebTokenError') {
        const message = 'Json Web Token is invalid, try again';
        err = new HandleError(message, 400);
    }
    // TokenExpiredError
    if (err.name === 'TokenExpiredError') {
        const message = 'Json Web Token is expired, try again';
        err = new HandleError(message, 400);
    }

    //duplicate key error
    if (err.code === 11000) {
        const message = `This ${Object.keys(err.keyValue)} already registered. Please login to continue.`;
        err = new HandleError(message, 400);
    }
    

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        
    });
}
