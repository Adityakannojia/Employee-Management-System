import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse";


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
})


export {createTask}