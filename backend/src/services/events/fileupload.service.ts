import cloudinary from "../../config/cloudinary";
import  fs  from "node:fs";
const uploadOnCloudinary = async (filePath: string):Promise<string> => {
    console.log("File path", filePath );
    
  const response = await cloudinary.uploader.upload(filePath,{
        folder:"eventify/banners",
        resource_type:"auto"
    });

    fs.unlinkSync(filePath)
    return response.secure_url;

};

export default uploadOnCloudinary;