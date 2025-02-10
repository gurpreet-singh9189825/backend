import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validations data not empty
  //check if user already exist:username email to be checked
  //check for images check for avatar
  //upload them to cloudinary avatar
  //create user object create entry in db
  //db will send all fields in response
  //remove password and refresh token field from response
  //check for user creation
  //return response otherwise error

  //get userdata from frontend
  const { fullName, email, userName, password } = req.body;
  //validation
  if (
    [fullName, email, userName, password].some((field) => {
      return field?.trim === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  //User.findOne({email}) give me first user which email match
  const existedUser = User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedError) {
    throw new ApiError(409, "userWith email or username already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

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
    userName:userName.toLowerCase()
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
