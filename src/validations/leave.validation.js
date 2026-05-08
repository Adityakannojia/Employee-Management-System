import Joi from "joi";

export const leaveValidationSchema = Joi.object({

    reason: Joi.string()
        .trim()
        .min(6)
        .max(50)
        .required()
        .messages({
            "string.empty": "Reason is required",
            "string.min": "Reason must be at least 6 characters",
            "string.max": "Reason cannot exceed 50 characters"
        }),

    leaveType: Joi.string()
        .valid("paid", "unpaid", "sick", "casual")
        .required(),

    startDate: Joi.date()
        .required(),

    endDate: Joi.date()
        .greater(Joi.ref("startDate"))
        .required()
        .messages({
            "date.greater": "End date must be greater than start date"
        }),

    status: Joi.string()
        .valid("pending", "reject", "approved")
        .optional()
});