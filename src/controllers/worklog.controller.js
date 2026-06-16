import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as worklogService from "../services/worklog.service.js";

const createWorkLog = asyncHandler(async (req, res) => {
    const work = await worklogService.createWorkLog(
        req.user,
        req.params.taskId,
        req.body
    );

    return res
        .status(201)
        .json(new ApiResponse(201, work, "Worklog created successfully"));
});

const getMyWork = asyncHandler(async (req, res) => {
    const data = await worklogService.getMyWork(req.user._id);

    return res
        .status(200)
        .json(new ApiResponse(200, data, "My work fetched successfully"));
});

const getAllWork = asyncHandler(async (req, res) => {
    const data = await worklogService.getAllWork(req.user);

    return res
        .status(200)
        .json(new ApiResponse(200, data, "All work fetched successfully"));
});

const updateWorklogStatus = asyncHandler(async (req, res) => {
    const updatedWorkLog = await worklogService.updateWorklogStatus(
        req.user,
        req.params.workId,
        req.body.status
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedWorkLog, "Status updated successfully"));
});

export { createWorkLog, getMyWork, getAllWork, updateWorklogStatus };
