import { Leave } from "../models/leave.model.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteCache } from "../utils/cache.util.js";
import { CACHE_KEYS } from "../constants/cache.keys.js";

const ALLOWED_STATUSES = ["pending", "approved", "rejected"];

export const applyLeave = async (user, { reason, startDate, endDate, leaveType }) => {
    if (!user?._id) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (user.role !== "employee") {
        throw new ApiError(403, "only access employee this action");
    }

    if (!reason?.trim() || !startDate || !endDate || !leaveType?.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    const createdLeave = await Leave.create({
        employee: user._id,
        reason: reason.trim(),
        startDate,
        endDate,
        leaveType,
    });

    await deleteCache(CACHE_KEYS.leavesAll);
    await deleteCache(CACHE_KEYS.leavesMy(user._id));

    return createdLeave;
};

export const getMyLeaves = async (userId) => {
    if (!userId) {
        throw new ApiError(401, "Unauthorized user");
    }

    const myLeave = await Leave.find({ employee: userId })
        .select("-__v")
        .populate("employee", "username email")
        .sort({ createdAt: -1 });

    return {
        count: myLeave.length,
        leave: myLeave,
    };
};

export const getAllLeaves = async (user) => {
    if (!user?._id) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (user.role !== "admin") {
        throw new ApiError(403, "Only admin can access this resource");
    }

    const allLeave = await Leave.find({})
        .select("-__v")
        .populate("employee", "username email")
        .sort({ createdAt: -1 });

    return {
        count: allLeave.length,
        leaves: allLeave,
    };
};

export const updateLeaveStatus = async (user, leaveId, status) => {
    if (!user?._id) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (user.role !== "admin") {
        throw new ApiError(403, "Only admin can access this action");
    }

    if (!leaveId) {
        throw new ApiError(400, "Leave id not found");
    }

    if (!status) {
        throw new ApiError(400, "Status is required");
    }

    if (!ALLOWED_STATUSES.includes(status)) {
        throw new ApiError(400, "Invalid status value");
    }

    const leave = await Leave.findById(leaveId);

    if (!leave) {
        throw new ApiError(404, "Leave not found");
    }

    leave.status = status;
    const updatedLeave = await leave.save();

    await deleteCache(CACHE_KEYS.leavesAll);
    await deleteCache(CACHE_KEYS.leavesMy(leave.employee));

    return updatedLeave;
};
