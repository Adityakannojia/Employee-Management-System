import logger from "../utils/logger.js";

export const errorMiddleware = (err, req, res, next) => {

    logger.error(err.message)
    
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });

};