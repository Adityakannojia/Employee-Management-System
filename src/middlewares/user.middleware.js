import { userSchema } from "../validations/user.validation.js";
import { ApiError } from "../utils/ApiError.js";


export const validateUser = (req, res, next) => {

    const { error } = userSchema.validate(req.body, {
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