import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:  process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary =async (localFilePath)=>{
try {
    if(!localFilePath){
        return null
    }
    //upload file on cloudinary
const uploadResponse=await cloudinary.uploader.upload(localFilePath,{
    resource_type:"auto"
})

// file uploaded successfully
console.log("file uploaded successfully ",uploadResponse.url)
fs.unlinkSync(localFilePath)
return uploadResponse
} catch (error) {
    fs.unlinkSync(localFilePath)//remove the locally save temp file as
    //ipload operation got failed
    return null
}



} 


export {uploadOnCloudinary}



//  await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);