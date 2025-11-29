import { v2 as cloudinary } from 'cloudinary'
import fs from "node:fs"
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

const uploadOnCoudinary = async (filePath : string)=>{
    try {
       const response = await cloudinary.uploader.upload(filePath,{
            resource_type:"auto"
        })

        fs.unlinkSync(filePath)
        console.log(`File uploaded on the cloudinary file url is ${response.secure_url} `);
        return response.secure_url;
    } catch (error) {
        console.error("Error to upload file on cloudinary ",error);
        fs.unlinkSync(filePath)
    }
}

export default uploadOnCoudinary;