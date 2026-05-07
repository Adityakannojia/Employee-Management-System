import mongoose from "mongoose";
const {Schema} = mongoose;

const workLogSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    hoursWorked:{
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["pending", "reviewed", "approved"],
        default: "pending"
    }
}, {timestamps: true})



export const Worklog = mongoose.model("Worklog", workLogSchema)