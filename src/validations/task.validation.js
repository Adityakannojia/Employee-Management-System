import Joi from "joi";

export const taskValidationSchema = Joi.object({

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
        .min(5)
        .max(500)
        .optional()
        .messages({
            "string.min": "Description must be at least 5 characters",
            "string.max": "Description cannot exceed 500 characters"
        }),

    assignedTo: Joi.string()
        .required()
        .messages({
            "string.empty": "Assigned user is required"
        }),

    createdBy: Joi.string()
        .optional(),

    startDate: Joi.date()
        .required()
        .messages({
            "date.base": "Start date must be a valid date"
        }),

    dueDate: Joi.date()
        .greater(Joi.ref("startDate"))
        .required()
        .messages({
            "date.greater": "Due date must be greater than start date"
        }),

    status: Joi.string()
        .valid("pending", "in-progress", "completed")
        .optional()
});