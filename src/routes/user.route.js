import express from "express";
const router = express.Router();
import { registerUser } from "../controllers/user.controller.js";

router.route("/signup").post(registerUser)


export default router