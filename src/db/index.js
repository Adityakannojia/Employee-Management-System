import mongoose from "mongoose";


export const connectDb = async() => {
    try{
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
       console.log(`Connection successfully ${connectionInstance.connection.host}`)
    }
    catch(err){
        console.log("Connection Failed", err.message)
        process.exit(1)
    }
}