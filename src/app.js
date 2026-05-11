import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import { fileURLToPath } from "url";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { errorMiddleware } from "./middlewares/error.middleware.js";


const app = express();

// fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({ extended: true , limit: "16kb"}));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(apiLimiter);
app.use(helmet())
app.use(mongoSanitize())




// routes
import userRouter from "./routes/user.route.js"
import taskRouter from "./routes/task.route.js"
import leaveRouter from "./routes/leave.route.js"
import worklogRouter from "./routes/worklog.route.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/tasks", taskRouter)
app.use("/api/leave", leaveRouter)
app.use("/api/v1/worklog", worklogRouter)



app.use(errorMiddleware)

export { app };