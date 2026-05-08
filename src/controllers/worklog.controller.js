import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Worklog } from "../models/worklog.model.js";
import { Task } from "../models/task.model.js";


const createWorkLog = asyncHandler(async (req, res) => {

    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized user");
    }

    const { title, description, hoursWorked } = req.body;
    const { taskId } = req.params;

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

    const work = await Worklog.create({
        title: title.trim(),
        description: description.trim(),
        hoursWorked,
        task: taskId,
        employee: req.user._id,
        status: "pending"
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                work,
                "Worklog created successfully"
            )
        );
});

const getMyWork = asyncHandler(async (req, res) => {

    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized user");
    }

    const employeeId = req.user._id;

    const myWork = await Worklog.find({ employee: employeeId })
        .select("-__v")
        .populate("employee", "username email")
        .sort({ createdAt: -1 });

    if (myWork.length === 0) {
        throw new ApiError(404, "Worklogs not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    count: myWork.length,
                    worklogs: myWork
                },
                "My work fetched successfully"
            )
        );
});

const getAllWork = asyncHandler(async (req, res) => {

    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (req.user.role !== "admin") {
        throw new ApiError(403, "Only admin can access this action");
    }

    const worklogs = await Worklog.find({})
        .select("-__v")
        .populate("employee", "username email")
        .sort({ createdAt: -1 });

    if (worklogs.length === 0) {
        throw new ApiError(404, "No worklogs found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    count: worklogs.length,
                    worklogs
                },
                "All work fetched successfully"
            )
        );
});

const updateWorklogStatus = asyncHandler(async (req, res) => {
    if(!req.user?._id){
        throw new ApiError(401, "Unauthorized user")
    }

    if(req.user.role !== "admin"){
        throw new ApiError(403, "Only admin can access this action")
    }

    const {workId} = req.params;
    const {status} = req.body

    if(!workId){
        throw new ApiError(404, "Work Id not found")
    }

    const allowStatus = ["pending", "approved", "reviewed"]

    if(!allowStatus.includes(status)){
        throw new ApiError(400, "Invalid status value")
    }

    const workLog = await Worklog.findById(workId)
    .populate("employee", "username email")

    if(!workLog){
        throw new ApiError(404, "Work log not found")
    }

    workLog.status = status
    const updatedWorkLog = await workLog.save()

    return res
    .status(200)
    .json(new ApiResponse(200, updatedWorkLog, "Status updated successfully"))
    
})

export {createWorkLog, getMyWork, getAllWork, updateWorklogStatus}