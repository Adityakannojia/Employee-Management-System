import { Leave } from "../models/leave.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const applyLeave = asyncHandler(async (req, res) => {

    // auth check first
    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized user");
    }

    if(req.user.role !== "employee"){
        throw new ApiError(403, "only access employee this action")
    }

    const { reason, startDate, endDate, leaveType } = req.body;

    // validation
    if (
        !reason?.trim() ||
        !startDate ||
        !endDate ||
        !leaveType?.trim()
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const createdLeave = await Leave.create({
        employee: req.user._id,
        reason: reason.trim(),
        startDate,
        endDate,
        leaveType
    });

    if (!createdLeave) {
        throw new ApiError(500, "Leave not created");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdLeave,
                "Leave created successfully"
            )
        );
});

const getMyLeave = asyncHandler(async (req, res) => {

    if(!req.user?._id){
        throw new ApiError(401, "Unauthorized user")
    }

    const userId = req.user._id

    const myLeave = await Leave.find({employee: userId})
    .select("-__v")
    .populate("employee", "username email")
    .sort({createdAt: -1})

    if(myLeave.length === 0){
        throw new ApiError(404, "Leave not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, 
        {
            count: myLeave.length,
            leave: myLeave
        },
        "My leaves fetched successfully"
    ))
})

const getAllLeaves = asyncHandler(async (req, res) => {

    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (req.user.role !== "admin") {
        throw new ApiError(403, "Only admin can access this resource");
    }

    const allLeave = await Leave.find({})
        .select("-__v")
        .populate("employee", "username email")
        .sort({ createdAt: -1 });

    if (allLeave.length === 0) {
        throw new ApiError(404, "No leaves found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    count: allLeave.length,
                    leaves: allLeave
                },
                "All leaves fetched successfully"
            )
        );
});

const updateLeaveStatus = asyncHandler(async (req, res) => {

    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized user");
    }

    if (req.user.role !== "admin") {
        throw new ApiError(403, "Only admin can access this action");
    }

    const { leaveId } = req.params;
    const { status } = req.body;

    if (!leaveId) {
        throw new ApiError(400, "Leave id not found");
    }

    if (!status) {
        throw new ApiError(400, "Status is required");
    }

    const allowStatus = ["pending", "approved", "rejected"];

    if (!allowStatus.includes(status)) {
        throw new ApiError(400, "Invalid status value");
    }

    const leave = await Leave.findById(leaveId);

    if (!leave) {
        throw new ApiError(404, "Leave not found");
    }

    leave.status = status;

    const updatedLeave = await leave.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedLeave,
                "Leave status updated successfully"
            )
        );
});


export {applyLeave, getMyLeave, getAllLeaves, updateLeaveStatus}