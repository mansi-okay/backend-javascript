import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadFileOnCloudinary = async (localFilePath) => {

    try {
        if (!localFilePath) return null;

        //uplaoding the file
        const response = await cloudinary.uploader.upload(localFilePath, 
            {
            resource_type: "auto"    // auto detect the type of file uploaded
            }
        )
        console.log("File uploaded successfully and url: ", response.url);
        
        //delete the local file if successfully uploaded
        fs.unlinkSync(localFilePath)

        return response    

    } catch (error) {

        // if file upload failed then remove temporary file saved locally so that currupt files won't stay on server
        fs.unlinkSync(localFilePath)
        console.log("File upload failed: ", error);
        
    }

}