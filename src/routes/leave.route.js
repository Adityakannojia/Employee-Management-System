import express from "express";
import { applyLeave, getAllLeaves, getMyLeave, updateLeaveStatus } from "../controllers/leave.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { leaveValidate } from "../middlewares/leave.middleware.js";
import { cacheMiddleware } from "../middlewares/cache.middleware.js";
import { CACHE_KEYS, CACHE_TTL } from "../constants/cache.keys.js";

const router = express.Router();

router.route("/").post(verifyJwt, leaveValidate, applyLeave)

router.route("/my").get(
    verifyJwt,
    cacheMiddleware((req) => CACHE_KEYS.leavesMy(req.user._id), CACHE_TTL.medium),
    getMyLeave
)

router.route("/").get(
    verifyJwt,
    cacheMiddleware(CACHE_KEYS.leavesAll, CACHE_TTL.default),
    getAllLeaves
)

router.route("/:leaveId/status").patch(verifyJwt, updateLeaveStatus)

export default router
