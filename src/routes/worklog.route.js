import express from "express";
import { createWorkLog, getAllWork, getMyWork, updateWorklogStatus } from "../controllers/worklog.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { validateWorklog } from "../middlewares/worklog.middleware.js";
import { cacheMiddleware } from "../middlewares/cache.middleware.js";
import { CACHE_KEYS, CACHE_TTL } from "../constants/cache.keys.js";

const router = express.Router();

router.route("/:taskId").post(verifyJwt, validateWorklog, createWorkLog)

router.route("/my").get(
    verifyJwt,
    cacheMiddleware((req) => CACHE_KEYS.worklogsMy(req.user._id), CACHE_TTL.medium),
    getMyWork
)

router.route("/").get(
    verifyJwt,
    cacheMiddleware(CACHE_KEYS.worklogsAll, CACHE_TTL.default),
    getAllWork
)

router.route("/:workId/status").patch(verifyJwt, updateWorklogStatus)

export default router
