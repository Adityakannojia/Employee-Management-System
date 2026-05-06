import { User } from "../models/user.model.js";
import { asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt, { decode } from "jsonwebtoken"

const genrateAccessAndRefreshToken = async (userId) => {
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

const logoutUser = asyncHandler(async(req, res) => {
    const user = req.user



    await User.findByIdAndUpdate(user.id, {refreshToken: undefined}, {new: true, runValidators: true})  // cleare refreshToken in database
    res.clearCookie("refreshToken")
    res.clearCookie("accessToken")

    return res.
    status(200)
    .json(new ApiResponse(200, {}, "User logout successfully"))
})

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!(oldPassword && newPassword && confirmPassword)) {
        throw new ApiError(400, "Password is required");
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "Confirm password is incorrect");
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        throw new ApiError(401, "Unauthorized user");
    }

    const isVerify = await user.isPasswordCorrect(oldPassword);

    if (!isVerify) {
        throw new ApiError(400, "Old password is incorrect");
    }

    user.password = newPassword;

    await user.save(); //  important for hashing

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const changeUserProfile = asyncHandler(async(req, res) => {
    const {username, email} = req.body;

    console.log(req.body)

    if(!(username || email)){
        throw new ApiError(400, "username and email are required")
    }
    
    const user = await User.findById(req.user.id)

    if(!user){
        throw new ApiError(404, "User not found")
    }

    if(username){
        user.username = username.trim().toLowerCase()
    }

    if(email){
        const existsUser = await User.findOne({email})

        if(existsUser){
            throw new ApiError(400, "email already exists")
        }

        user.email = email.trim().toLowerCase()
    }

    await user.save();

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized user")
    }
    const updatedData = await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(200, updatedData, "User profile update successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(400, "Refresh Token required")
    }

    try{
    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESHTOKEN_SECRET)

    if(!decoded){
        throw new ApiError(401, "Invalid token")
    }

    const user = await User.findById(decoded.id)

    if(!user){
        throw new ApiError(404, "User not found")
    }

    if(user.refreshToken !== incomingRefreshToken){
        throw new ApiError(401, "Refresh token expired or reused");
    }

    const {accessToken, refreshToken} = await genrateAccessAndRefreshToken(user._id)

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(new ApiResponse(200, {accessToken, refreshToken}, "Access token refresh successfully"))
    }
    catch(err){
        throw new ApiError(401, err?.message || "Invalid Refresh Token")
    }
})


export {registerUser, loginUser, logoutUser, changePassword, changeUserProfile, refreshAccessToken}