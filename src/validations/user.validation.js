import Joi from "joi";

export const userSchema = Joi.object({

    username: Joi.string()
        .trim()
        .min(3)
        .max(30)
        .required()
        .messages({
            "string.empty": "Username is required",
            "string.min": "Username must be at least 3 characters",
            "string.max": "Username cannot exceed 30 characters"
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format"
        }),

    password: Joi.string()
        .min(6)
        .max(20)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password cannot exceed 20 characters"
        }),
});

export const loginSchema = Joi.object({
    username: Joi.string()
        .trim()
        .lowercase()
        .optional(),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .optional()
        .messages({
            "string.email": "Invalid email format"
        }),

    password: Joi.string()
        .required()
        .messages({
            "string.empty": "Password is required"
        }),
})
    .or("username", "email")
    .messages({
        "object.missing": "Username or email is required"
    });
