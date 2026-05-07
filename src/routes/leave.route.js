import express, { Router } from "express";
import { applyLeave, getAllLeaves, getMyLeave, updateLeaveStatus } from "../controllers/leave.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = express.Router();


router.route("/").post(verifyJwt, applyLeave)

router.route("/my").get(verifyJwt, getMyLeave)

router.route("/").get(verifyJwt, getAllLeaves)

router.route("/:leaveId/status").patch(verifyJwt, updateLeaveStatus)

export default router