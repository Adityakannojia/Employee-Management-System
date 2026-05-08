import { leaveValidationSchema } from "../validations/leave.validation.js";
import { ApiError } from "../utils/ApiError.js";


export const leaveValidate = (req, res, next) => {

    const { error } = leaveValidationSchema.validate(req.body, {
        abortEarly: false
    });

    if (error) {

        const errMsg = error.details
            .map((el) => el.message)
            .join(", ");

        throw new ApiError(400, errMsg);
    }

    next();
};