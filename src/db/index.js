import mongoose from "mongoose";


export const connectDb = async () => {
    const connectionInstance = await mongoose.connect(
        `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    );
    console.log(`Connection successfully ${connectionInstance.connection.host}`);
};
