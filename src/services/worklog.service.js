import { Worklog } from "../models/worklog.model.js";
import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteCache } from "../utils/cache.util.js";
import { CACHE_KEYS } from "../constants/cache.keys.js";

const ALLOWED_STATUSES = ["pending", "approved", "reviewed"];

const invalidateWorklogCache = async (employeeId) => {
    await deleteCache(CACHE_KEYS.worklogsAll);
    if (employeeId) {
        await deleteCache(CACHE_KEYS.worklogsMy(employeeId));
    }
};

export const createWorkLog = async (user, taskId, { title, description, hoursWorked }) => {
    if (!user?._id) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (!title?.trim() || !description?.trim() || typeof hoursWorked !== "number") {
        throw new ApiError(400, "All fields are required");
    }

    if (hoursWorked <= 0) {
        throw new ApiError(400, "Hours worked must be greater than 0");
    }

    if (!taskId) {
        throw new ApiError(400, "Task Id is required");
    }

    const taskExists = await Task.findById(taskId);

    if (!taskExists) {
        throw new ApiError(404, "Task not found");
    }

    if (taskExists.assignedTo.toString() !== user._id.toString()) {
        throw new ApiError(403, "You can only log work on tasks assigned to you");
    }

    const work = await Worklog.create({
        title: title.trim(),
        description: description.trim(),
        hoursWorked,
        task: taskId,
        employee: user._id,
        status: "pending",
    });

    await invalidateWorklogCache(user._id);

    return work;
};

export const getMyWork = async (userId) => {
    if (!userId) {
        throw new ApiError(401, "Unauthorized user");
    }

    const myWork = await Worklog.find({ employee: userId })
        .select("-__v")
        .populate("employee", "username email")
        .sort({ createdAt: -1 });

    return {
        count: myWork.length,
        worklogs: myWork,
    };
};

export const getAllWork = async (user) => {
    if (!user?._id) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (user.role !== "admin") {
        throw new ApiError(403, "Only admin can access this action");
    }

    const worklogs = await Worklog.find({})
        .select("-__v")
        .populate("employee", "username email")
        .sort({ createdAt: -1 });

    return {
        count: worklogs.length,
        worklogs,
    };
};

export const updateWorklogStatus = async (user, workId, status) => {
    if (!user?._id) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (user.role !== "admin") {
        throw new ApiError(403, "Only admin can access this action");
    }

    if (!workId) {
        throw new ApiError(404, "Work Id not found");
    }

    if (!ALLOWED_STATUSES.includes(status)) {
        throw new ApiError(400, "Invalid status value");
    }

    const workLog = await Worklog.findById(workId).populate("employee", "username email");

    if (!workLog) {
        throw new ApiError(404, "Work log not found");
    }

    workLog.status = status;
    const updatedWorkLog = await workLog.save();

    await invalidateWorklogCache(workLog.employee._id || workLog.employee);

    return updatedWorkLog;
};
