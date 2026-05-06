import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";



 const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.headers?.authorization?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized user");
        }

        const decoded = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);

        const user = await User.findById(decoded.id)
            .select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorized user");
        }

        req.user = user;

        next();

    } catch (err) {
        throw new ApiError(401, err?.message || "Invalid token");
    }
});


export {verifyJwt}