import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as leaveService from "../services/leave.service.js";

const applyLeave = asyncHandler(async (req, res) => {
    const createdLeave = await leaveService.applyLeave(req.user, req.body);

    return res
        .status(201)
        .json(new ApiResponse(201, createdLeave, "Leave created successfully"));
});

const getMyLeave = asyncHandler(async (req, res) => {
    const data = await leaveService.getMyLeaves(req.user._id);

    return res
        .status(200)
        .json(new ApiResponse(200, data, "My leaves fetched successfully"));
});

const getAllLeaves = asyncHandler(async (req, res) => {
    const data = await leaveService.getAllLeaves(req.user);

    return res
        .status(200)
        .json(new ApiResponse(200, data, "All leaves fetched successfully"));
});

const updateLeaveStatus = asyncHandler(async (req, res) => {
    const updatedLeave = await leaveService.updateLeaveStatus(
        req.user,
        req.params.leaveId,
        req.body.status
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedLeave, "Leave status updated successfully"));
});

export { applyLeave, getMyLeave, getAllLeaves, updateLeaveStatus };
