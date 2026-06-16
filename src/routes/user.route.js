import express from "express";
const router = express.Router();
import { loginUser, logoutUser, registerUser, changePassword, changeUserProfile, refreshAccessToken, getCurrentEmployee, getAllEmployee} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { validateUser, validateLogin } from "../middlewares/user.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";
import { cacheMiddleware } from "../middlewares/cache.middleware.js";
import { CACHE_KEYS, CACHE_TTL } from "../constants/cache.keys.js";


router.route("/signup").post(authLimiter, validateUser, registerUser)

router.route("/login").post(authLimiter, validateLogin, loginUser)

router.route("/logout").post(verifyJwt, logoutUser)

router.route("/change-password").patch(verifyJwt, changePassword);

router.route("/profile").patch(verifyJwt, changeUserProfile)

router.route("/refresh-token").post(authLimiter, refreshAccessToken)

router.route("/employee/me").get(
    verifyJwt,
    cacheMiddleware((req) => CACHE_KEYS.employeeMe(req.user._id), CACHE_TTL.short),
    getCurrentEmployee
)

router.route("/employee").get(
    verifyJwt,
    isAdmin,
    cacheMiddleware(CACHE_KEYS.employeesAll, CACHE_TTL.long),
    getAllEmployee
)


export default router
