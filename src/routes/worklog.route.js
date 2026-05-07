import express, { Router } from "express";
import { createWorkLog, getAllWork, getMyWork } from "../controllers/worklog.controller.js";
const router = express.Router();


router.route("/:taskId").post(createWorkLog)

router.route("/my", getMyWork)

router.route("/", getAllWork)

export default router