import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOncloudinary = async (localFilePath) => {
    try {
        // Check if the file exists before uploading if not return null 
        if (!localFilePath) return null
        //uploder.upload() method is used to upload the file to cloudinary
        // and it takes the file path as an argument
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        })
        //message to be displayed if the file is uploaded successfully
        // and it returns the url of the file
        console.log('File uploaded successfully', response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        //it remove the file from local storage if the upload fails
        fs.unlinkSync(localFilePath)
        return null
    }
}

export { uploadOncloudinary };