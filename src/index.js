import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})

import { validateEnv } from "./config/env.js";
import { connectDb } from "./db/index.js";
import { app } from "./app.js";
import redis from "./config/redis.config.js";

validateEnv();

const startServer = async () => {
    try {
        await connectDb();

        try {
            await redis.connect();
            await redis.ping();
            console.log("Redis ping OK");
        } catch (err) {
            console.warn("Redis unavailable — running without cache:", err.message);
        }

        app.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}`)
        });
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

startServer();
