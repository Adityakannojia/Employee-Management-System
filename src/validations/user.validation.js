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

    role: Joi.string()
        .valid("admin", "employee")
        .optional()
});

