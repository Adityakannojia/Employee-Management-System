import express from "express";
const router = express.Router();
import { loginUser, logoutUser, registerUser, changePassword, changeUserProfile, refreshAccessToken, getCurrentEmployee, getAllEmployee} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { validateUser } from "../middlewares/user.middleware.js";


router.route("/signup").post(validateUser, registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJwt, logoutUser)

router.route("/change-password").patch(verifyJwt, changePassword);

router.route("/profile").patch(verifyJwt, changeUserProfile)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/employee/me").post(verifyJwt, getCurrentEmployee)

router.route("/employee").post(verifyJwt, getAllEmployee)


export default router