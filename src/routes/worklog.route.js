import express, { Router } from "express";
import { createWorkLog, getAllWork, getMyWork, updateWorklogStatus } from "../controllers/worklog.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = express.Router();
import { validateWorklog } from "../middlewares/worklog.middleware.js";


router.route("/:taskId").post(verifyJwt, validateWorklog, createWorkLog)

router.route("/my").get(verifyJwt, getMyWork)

router.route("/").get(verifyJwt, getAllWork)

router.route("/:workId/status").patch(verifyJwt, updateWorklogStatus)

export default router