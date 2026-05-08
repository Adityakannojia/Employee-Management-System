import { taskValidationSchema } from "../validations/task.validation.js";
import { ApiError } from "../utils/ApiError.js";


export const validateTask = (req, res, next) => {
    const {error} = taskValidationSchema.validate(req.body, {
        abortEarly: false
    });

    if(error){
       const errMsg =  error.details.map((el) => el.message)
       throw new ApiError(400, errMsg)
    }else{
        next()
    }
}