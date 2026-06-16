import logger from "../utils/logger.js";

export const errorMiddleware = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    logger.error({
        message: err.message,
        statusCode,
        stack: err.stack,
    });

    const message =
        statusCode >= 500 && process.env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message || "Internal server error";

    return res.status(statusCode).json({
        success: false,
        message,
    });

};