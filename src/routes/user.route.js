import express from "express";
const router = express.Router();
import { loginUser, logoutUser, registerUser, changePassword, changeUserProfile, refreshAccessToken} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

router.route("/signup").post(registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJwt, logoutUser)

router.route("/change-password").patch(verifyJwt, changePassword);

router.route("/profile").patch(verifyJwt, changeUserProfile)

router.route("/refresh-token").post(refreshAccessToken)

export default router