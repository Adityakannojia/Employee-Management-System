import Joi from "joi";

export const workLogValidationSchema = Joi.object({

    title: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Title is required",
            "string.min": "Title must be at least 3 characters",
            "string.max": "Title cannot exceed 100 characters"
        }),

    description: Joi.string()
        .trim()
        .min(10)
        .max(500)
        .required()
        .messages({
            "string.empty": "Description is required",
            "string.min": "Description must be at least 10 characters",
            "string.max": "Description cannot exceed 500 characters"
        }),

    hoursWorked: Joi.number()
        .positive()
        .required()
        .messages({
            "number.base": "Hours worked must be a number",
            "number.positive": "Hours worked must be greater than 0",
            "any.required": "Hours worked is required"
        }),

    date: Joi.date()
        .optional(),

    status: Joi.string()
        .valid("pending", "reviewed", "approved")
        .optional(),

    employee: Joi.string()
        .optional(),

    task: Joi.string()
        .optional()
});