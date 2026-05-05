import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import { fileURLToPath } from "url";



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


app.post("/test", (req, res) => {
    res.json({ message: "server is working" });
});


// routes
import userRouter from "./routes/user.route.js"

app.use("/api/v1/users", userRouter)

export { app };