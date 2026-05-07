import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { json } from "express";


const createTask = asyncHandler(async (req, res) => {
    if(!req.user?._id){
        throw new ApiError(401, "Unauthorized user")
    }

    if(req.user.role !== "admin"){
        throw new ApiError(403, "Only admin can create tasks")
    }

    const {title, description, assignedTo, startDate, dueDate} = req.body;

    if (!title || !description || !assignedTo || !startDate || !dueDate) {
        throw new ApiError(400, "All fields are required");
    }

    if (new Date(startDate) > new Date(dueDate)) {
        throw new ApiError(400, "Start date cannot be greater than due date");
    }

    const existsTask = await Task.findOne({
        title,
        assignedTo,
        startDate
    });  // already exists

    if(existsTask){
        throw new ApiError(400, "Task already exists")
    }

    const admin = await User.findById(req.user?._id)

    if(!admin){
        throw new ApiError(404, "User not found")
    }

    const createdTask = await Task.create({
        createdBy: admin?._id,
        title,
        description,
        assignedTo,
        startDate,
        dueDate,
        status: "pending"
    })

    return res
    .status(200)
    .json(new ApiResponse(201, createdTask, "Task assigned successfully"))
});

const getMyTasks = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized access");
    }

    const tasks = await Task.find({ assignedTo: userId })
        .select("-__v")
        .populate("assignedTo", "username email")
        .populate("createdBy", "username email")
        .sort({ createdAt: -1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                count: tasks.length,
                tasks,
            },
            tasks.length
                ? "Tasks fetched successfully"
                : "No tasks assigned yet"
        )
    );
});

const getAllTasks = asyncHandler(async (req, res) => {

    if (!req.user) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (req.user.role !== "admin") {
        throw new ApiError(403, "Only admin access");
    }

    const allTasks = await Task.find({})
        .select("-__v")
        .populate("createdBy", "username email")
        .populate("assignedTo", "username email")
        .sort({ createdAt: -1 })
        .lean();

    if (allTasks.length === 0) {
        throw new ApiError(404, "Task not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    count: allTasks.length,
                    tasks: allTasks
                },
                "All tasks fetched successfully"
            )
        );
});

const  updateTaskStatus = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(401, "Unauthorized user");
    }

    const {taskId} = req.params;

    if(!taskId){
        throw new ApiError(404, "Task Id not found")
    }

    const task = await Task.findById(taskId)

    if(!task){
        throw new ApiError(404, "Task not found")
    }

    if(req.user.role !== "admin" && task.assignedTo.toString() !== userId.toString()){
        throw new ApiError(403, "Not Allowed")
    }

    task.status = "completed"
    await task.save()

    return res
    .status(200)
    .json(new ApiResponse(200,
        task,
        "status updated successfully"
    ))
    
})

const deleteTask = asyncHandler(async(req, res) =>{
    if(!req.user?._id){
        throw new ApiError(401, "Unauthorized user")
    }

    if(req.user.role !== "admin"){
        throw new ApiError(403, "Only admin can perform this action")
    }

    const {taskId} = req.params

    if(!taskId){
        throw new ApiError(404, "Task id not found")
    }

    const deletedTask = await Task.findByIdAndDelete(taskId)

    if(!deletedTask){
        throw new ApiError(404, "Something wrong task not deleted")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, deletedTask, "Task deleted successfully"))
})

export {createTask, getMyTasks, getAllTasks, updateTaskStatus, deleteTask}