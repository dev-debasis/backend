import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadOnCloudinary = async function(localFilePath) {
    try {
        if(!localFilePath){
            console.log("Can't fetch the local file path")
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        console.log("file uploaded successfully")
        // console.log(`Response of uploading images on cloudinary: ${response}`);
        // console.log(`Response url: ${response.url}`);
        fs.unlinkSync(localFilePath)
        return response;

    }catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

export { uploadOnCloudinary }