import express from "express";
const router = express.Router();
import { createTask, deleteTask, getAllTasks, getMyTasks, updateTaskStatus } from "../controllers/task.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validateTask } from "../middlewares/task.middleware.js";
import { cacheMiddleware } from "../middlewares/cache.middleware.js";
import { CACHE_KEYS, CACHE_TTL } from "../constants/cache.keys.js";

router.route("/create-task").post(verifyJwt, validateTask, createTask)

router.route("/my-task").get(
    verifyJwt,
    cacheMiddleware((req) => CACHE_KEYS.tasksMy(req.user._id), CACHE_TTL.medium),
    getMyTasks
)

router.route("/tasks").get(
    verifyJwt,
    cacheMiddleware((req) => CACHE_KEYS.tasksMy(req.user._id), CACHE_TTL.medium),
    getMyTasks
)

router.route("/all-tasks").get(
    verifyJwt,
    cacheMiddleware(CACHE_KEYS.tasksAll, CACHE_TTL.default),
    getAllTasks
)

router.route("/:taskId/status").patch(verifyJwt, updateTaskStatus)

router.route("/:taskId").delete(verifyJwt, deleteTask)

export default router
