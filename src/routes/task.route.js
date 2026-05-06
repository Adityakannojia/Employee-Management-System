import express from "express";
const router = express.Router();
import { createTask } from "../controllers/task.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


router.route("/task").post(verifyJwt, createTask)