import mongoose from "mongoose";
const {Schema} = mongoose;


const leaveSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    leaveType: {
        type: String,
        enum: ["paid", "unpaid", "sick", "casual"],
        default: "casual"
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "rejected", "approved"],
        default: "pending"
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true})


export const Leave = mongoose.model("Leave", leaveSchema)