import { ApiError } from "../utils/ApiError.js";

export const isAdmin = (req, res, next) => {
    if(!req.user){
        throw new ApiError(403, "Unauthorized user")
    }

    if(req.user.role !== "admin"){
        throw new ApiError(403, "Only admin can access this action")
    }

    next();
}
