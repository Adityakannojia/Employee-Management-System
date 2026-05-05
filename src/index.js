import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})

// NOW import the rest
import { connectDb } from "./db/index.js";
import { app } from "./app.js";

connectDb()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log(err.message)
})