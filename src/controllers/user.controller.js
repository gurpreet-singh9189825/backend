import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validations data not empty
  //check if user already exist: email to be checked
  //check for images check for avatar
  //upload them to cloudinary avatar
  //create user object create entry in db
  //db will send all fields in response
  //remove password and refresh token field from response
  //check for user creation
  //return response otherwise error

  //get userdata from frontend
  const { fullName, email, username, password } = req.body;
  console.log("username",username)
  //validation
  if (
    [fullName, email, username, password].some((field) => {
      return field?.trim === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }

  
  //User.findOne({email}) give me first user which email match
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user With email or userName already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImageLocalPath=req.files.coverImage[0].path
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatart file is required");
  }

const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
})

 const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"
 )

 if(!createdUser){
throw new ApiError(500, "something went wrong while registering user")
 }

 return res.status(201).json(
    new ApiResponse(200,createdUser,"user created Successfully")
 )

});

export { registerUser };
