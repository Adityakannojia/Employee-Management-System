import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isBearerAuthMode, setAuthCookies, clearAuthCookies } from "../utils/auth.util.js";
import * as userService from "../services/user.service.js";

const buildAuthResponse = (user, accessToken, refreshToken, req) => {
    const payload = { user };

    if (isBearerAuthMode(req)) {
        payload.accessToken = accessToken;
        payload.refreshToken = refreshToken;
    }

    return payload;
};

const registerUser = asyncHandler(async (req, res) => {
    const createdUser = await userService.registerUser(req.body);

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { accessToken, refreshToken, user } = await userService.loginUser(req.body);

    setAuthCookies(res, accessToken, refreshToken);

    return res
        .status(200)
        .json(new ApiResponse(200, buildAuthResponse(user, accessToken, refreshToken, req), "Login successful"));
});

const logoutUser = asyncHandler(async (req, res) => {
    await userService.logoutUser(req.user._id);
    clearAuthCookies(res);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User logout successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
    await userService.changePassword(req.user._id, req.body);
    clearAuthCookies(res);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully. Please login again."));
});

const changeUserProfile = asyncHandler(async (req, res) => {
    const updatedData = await userService.changeUserProfile(req.user._id, req.body);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedData, "User profile update successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const { accessToken, refreshToken } = await userService.refreshAccessToken(incomingRefreshToken);

    setAuthCookies(res, accessToken, refreshToken);

    const payload = isBearerAuthMode(req)
        ? { accessToken, refreshToken }
        : {};

    return res
        .status(200)
        .json(new ApiResponse(200, payload, "Access token refreshed successfully"));
});

const getCurrentEmployee = asyncHandler(async (req, res) => {
    const user = await userService.getCurrentEmployee(req.user._id);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Employee profile fetch successfully"));
});

const getAllEmployee = asyncHandler(async (req, res) => {
    const data = await userService.getAllEmployees();

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Employees fetched successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    changeUserProfile,
    refreshAccessToken,
    getCurrentEmployee,
    getAllEmployee,
};
