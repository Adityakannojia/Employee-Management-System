import { workLogValidationSchema } from "../validations/worklog.validation.js";
import { ApiError } from "../utils/ApiError.js";


export const validateWorklog = (req, res, next) => {
    const {error} = workLogValidationSchema.validate(req.body, {
        abortEarly: false
    })

    if(error){
        const errMsg = error.details.map((el) => el.message)
        throw new ApiError(400, errMsg)
    }else{
        next()
    }
}