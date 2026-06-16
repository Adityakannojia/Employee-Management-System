import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteCache, deleteCacheByPattern } from "../utils/cache.util.js";
import { CACHE_KEYS } from "../constants/cache.keys.js";

const invalidateTaskCache = async (assignedTo) => {
    await deleteCache(CACHE_KEYS.tasksAll);
    await deleteCacheByPattern("tasks:my:*");
    if (assignedTo) {
        await deleteCache(CACHE_KEYS.tasksMy(assignedTo));
    }
};

export const createTask = async (user, { title, description, assignedTo, startDate, dueDate }) => {
    if (!user?._id) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (user.role !== "admin") {
        throw new ApiError(403, "Only admin can create tasks");
    }

    if (!title || !description || !assignedTo || !startDate || !dueDate) {
        throw new ApiError(400, "All fields are required");
    }

    if (new Date(startDate) > new Date(dueDate)) {
        throw new ApiError(400, "Start date cannot be greater than due date");
    }

    const existsTask = await Task.findOne({ title, assignedTo, startDate });

    if (existsTask) {
        throw new ApiError(400, "Task already exists");
    }

    const admin = await User.findById(user._id);

    if (!admin) {
        throw new ApiError(404, "User not found");
    }

    const createdTask = await Task.create({
        createdBy: admin._id,
        title,
        description,
        assignedTo,
        startDate,
        dueDate,
        status: "pending",
    });

    await invalidateTaskCache(assignedTo);

    return createdTask;
};

export const getMyTasks = async (userId) => {
    if (!userId) {
        throw new ApiError(401, "Unauthorized access");
    }

    const tasks = await Task.find({ assignedTo: userId })
        .select("-__v")
        .populate("assignedTo", "username email")
        .populate("createdBy", "username email")
        .sort({ createdAt: -1 })
        .lean();

    return {
        count: tasks.length,
        tasks,
    };
};

export const getAllTasks = async (user) => {
    if (!user) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (user.role !== "admin") {
        throw new ApiError(403, "Only admin access");
    }

    const allTasks = await Task.find({})
        .select("-__v")
        .populate("createdBy", "username email")
        .populate("assignedTo", "username email")
        .sort({ createdAt: -1 })
        .lean();

    return {
        count: allTasks.length,
        tasks: allTasks,
    };
};

export const updateTaskStatus = async (user, taskId) => {
    const userId = user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (!taskId) {
        throw new ApiError(404, "Task Id not found");
    }

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    if (user.role !== "admin" && task.assignedTo.toString() !== userId.toString()) {
        throw new ApiError(403, "Not Allowed");
    }

    task.status = "completed";
    await task.save();

    await invalidateTaskCache(task.assignedTo);

    return task;
};

export const deleteTask = async (user, taskId) => {
    if (!user?._id) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (user.role !== "admin") {
        throw new ApiError(403, "Only admin can perform this action");
    }

    if (!taskId) {
        throw new ApiError(404, "Task id not found");
    }

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
        throw new ApiError(404, "Task not found");
    }

    await invalidateTaskCache(deletedTask.assignedTo);

    return deletedTask;
};
