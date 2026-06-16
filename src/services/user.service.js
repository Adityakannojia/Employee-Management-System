import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { hashToken } from "../utils/auth.util.js";
import { deleteCache } from "../utils/cache.util.js";
import { CACHE_KEYS } from "../constants/cache.keys.js";

const generateAccessAndRefreshToken = async (userId) => {
    if (!userId) {
        throw new ApiError(400, "User Id not found");
    }

    const user = await User.findById(userId).select("+refreshToken");

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    if (user.is_active === false) {
        throw new ApiError(403, "Account has been deactivated");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

export const registerUser = async ({ username, email, password }) => {
    const existsUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existsUser) {
        throw new ApiError(400, "user already exists");
    }

    const user = await User.create({
        username,
        email,
        password,
        role: "employee",
    });

    await deleteCache(CACHE_KEYS.employeesAll);

    return User.findById(user._id).select("-password -refreshToken");
};

export const loginUser = async ({ username, email, password }) => {
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, "Invalid credentials");
    }

    if (user.is_active === false) {
        throw new ApiError(403, "Account has been deactivated");
    }

    const tokens = await generateAccessAndRefreshToken(user._id);
    const userData = await User.findById(user._id).select("-password -refreshToken");

    return { ...tokens, user: userData };
};

export const logoutUser = async (userId) => {
    await User.findByIdAndUpdate(
        userId,
        { $unset: { refreshToken: 1 } },
        { new: true, runValidators: false }
    );
};

export const changePassword = async (userId, { oldPassword, newPassword, confirmPassword }) => {
    if (!(oldPassword && newPassword && confirmPassword)) {
        throw new ApiError(400, "Password is required");
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "Confirm password is incorrect");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(401, "Unauthorized user");
    }

    const isVerify = await user.isPasswordCorrect(oldPassword);

    if (!isVerify) {
        throw new ApiError(400, "Old password is incorrect");
    }

    user.password = newPassword;
    user.refreshToken = undefined;
    await user.save();
};

export const changeUserProfile = async (userId, { username, email }) => {
    if (!(username || email)) {
        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (username) {
        user.username = username.trim().toLowerCase();
    }

    if (email) {
        const existsUser = await User.findOne({
            email,
            _id: { $ne: user._id },
        });

        if (existsUser) {
            throw new ApiError(400, "email already exists");
        }

        user.email = email.trim().toLowerCase();
    }

    await user.save();

    await deleteCache(CACHE_KEYS.employeesAll);
    await deleteCache(CACHE_KEYS.employeeMe(userId));

    return User.findById(user._id).select("-password -refreshToken");
};

export const refreshAccessToken = async (incomingRefreshToken) => {
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token required");
    }

    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESHTOKEN_SECRET);

        const user = await User.findById(decoded.id).select("+refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorized");
        }

        if (user.is_active === false) {
            throw new ApiError(403, "Account has been deactivated");
        }

        const incomingHash = hashToken(incomingRefreshToken);

        if (!user.refreshToken || user.refreshToken !== incomingHash) {
            throw new ApiError(401, "Refresh token expired or reused");
        }

        return generateAccessAndRefreshToken(user._id);
    } catch (err) {
        if (err instanceof ApiError) {
            throw err;
        }
        throw new ApiError(401, "Invalid or expired refresh token");
    }
};

export const getCurrentEmployee = async (userId) => {
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    if (user.role !== "employee") {
        throw new ApiError(403, "Forbidden: Employees only");
    }

    return user;
};

export const getAllEmployees = async () => {
    const employees = await User.find({ role: "employee", is_active: { $ne: false } })
        .select("-password -refreshToken");

    return { employees };
};
