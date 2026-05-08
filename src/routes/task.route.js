import express from "express";
const router = express.Router();
import { createTask, deleteTask, getAllTasks, getMyTasks, updateTaskStatus } from "../controllers/task.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validateTask } from "../middlewares/task.middleware.js";




router.route("/create-task").post(verifyJwt, validateTask, createTask)

router.route("/my-task").get(verifyJwt, getMyTasks)

router.route("/tasks").get(verifyJwt, getMyTasks)

router.route("/all-tasks").get(verifyJwt, getAllTasks)

router.route("/:taskId/status").patch(verifyJwt, updateTaskStatus)

router.route("/:taskId").delete(verifyJwt, deleteTask)

export default router