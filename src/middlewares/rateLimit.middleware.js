import rateLimit from "express-rate-limit";


export const apiLimiter = rateLimit({

    windowMs: 60 * 1000,
    max: 5,

    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res) => {

        console.log("Rate limit reached");

        return res.status(429).json({
            success: false,
            message: "Too many requests. Try again after 1 minute"
        });
    }

});