import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req, res) => {
   
    
    /*
    steps for user registration: 
    1. Taking user details from frontend as per user data model
    2. validation the data
    3. check if the user is already exist or not
    4. check for images as per data model(avatar, coverImage)
    5. upload on cloudinary
    6. Create user object and entry in the db
    7. Remove password and refresh token from response that will be sent to user
    8. Check for user creation 
    9. Return response
    */

    // Taking user details from frontend through postman
    const {username, email, fullName, password, } = req.body

    // Validating the user given fields if any field is empty or not?
    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    // checking if the user is already exist or not
    const isUserExit = await User.findOne({
        $or: [{ username }, { email}]
    })

    if(isUserExit){
        throw new ApiError(409, "Email or username already exist")
    }

    // Check for the images as per data model
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    // Uploading the images from local server to the cloudinary server
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // After uploading we will delete the files from our server.
    
    if(!avatar){
        throw new ApiError(400, "Uploading Avatar on cloudinary failed")
    }

    // Create User object
    const user = await User.create(
        {
            username: username.toLowerCase(),
            fullName,
            email,
            password,
            avatar: avatar.url,
            coverImage: coverImage?.url || ""
        }
    )

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user ")
    }

    // Returning thr response 

    return res.json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )


} )


export {
    registerUser,
}



