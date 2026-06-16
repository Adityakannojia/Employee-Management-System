import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as taskService from "../services/task.service.js";

const createTask = asyncHandler(async (req, res) => {
    const createdTask = await taskService.createTask(req.user, req.body);

    return res
        .status(201)
        .json(new ApiResponse(201, createdTask, "Task assigned successfully"));
});

const getMyTasks = asyncHandler(async (req, res) => {
    const data = await taskService.getMyTasks(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            data,
            data.count ? "Tasks fetched successfully" : "No tasks assigned yet"
        )
    );
});

const getAllTasks = asyncHandler(async (req, res) => {
    const data = await taskService.getAllTasks(req.user);

    return res
        .status(200)
        .json(new ApiResponse(200, data, "All tasks fetched successfully"));
});

const updateTaskStatus = asyncHandler(async (req, res) => {
    const task = await taskService.updateTaskStatus(req.user, req.params.taskId);

    return res
        .status(200)
        .json(new ApiResponse(200, task, "status updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
    const deletedTask = await taskService.deleteTask(req.user, req.params.taskId);

    return res
        .status(200)
        .json(new ApiResponse(200, deletedTask, "Task deleted successfully"));
});

export { createTask, getMyTasks, getAllTasks, updateTaskStatus, deleteTask };
