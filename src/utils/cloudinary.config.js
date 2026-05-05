import {v2 as cloudianry} from "cloudinary"; 
import fs from "fs"

cloudianry.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


export const fileUploadOnCloudinary = async (filePath) => {
    try{
        if(!filePath) throw null

        const response = await cloudianry.uploader.upload(filePath, {
            resource_type: "auto"
        })

        console.log("File upload on cloudinary succeffully", response.url)
        fs.unlinkSync(filePath)
        return response
    }
    catch(err){
        fs.unlinkSync(filePath)
        console.log("File upload filed", err.message)
        return null
    }
}