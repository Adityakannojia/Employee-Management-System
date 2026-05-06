import { User } from "../models/user.model.js";
import { asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const genrateAccessAndRefreshToken = async (userId) => {
    try{
        if(!userId){
        throw new ApiError(400, "User Id not found")
    }

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(400, "User not found")
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false })

    return {accessToken, refreshToken}
    }
    catch(err){
        throw new ApiError(500, error?.message || "Token generation failed");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password, role} = req.body;
    
    if([username, email, password, role].some((filed) => filed.trim() === "")){ // check empty
        throw new ApiError(400, "All filed required")
    }

    const existsUser = await User.findOne({$or: [{username}, {email}]}); // check !already exists

    if(existsUser){
        throw new ApiError(400, "user already exists")
    }

    const user = await User.create({
        username,
        email,
        password,
        role: role || "employee"
    })

    if(!user){
        throw new ApiError(401, "User not creatred")
    }


    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"))
})

const loginUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;

    if(!(username || email) || !password){
        throw new ApiError(400, "Username/email and password are required")
    }

    const user = await User.findOne({$or: [{username}, {email}]})

    if(!user){
        throw new ApiError(401, "Invalid credentials")
    }

    const isVerify = await user.isPasswordCorrect(password);

    if(!isVerify){
        throw new ApiError(401, "Invalid credentials")
    }

   const {accessToken, refreshToken} = await genrateAccessAndRefreshToken(user._id)

   const existsUser = await User.findById(user._id).select("-password -refreshToken")

   const option = {
    httpOnly: true,
    secure: true
   }

   return res
   .status(200)
   .cookie("accessToken", accessToken, option)
   .cookie("refreshToken", refreshToken, option)
   .json(new ApiResponse(200, {
    user: existsUser,
    refreshToken, 
    accessToken
   }))
})


export {registerUser}