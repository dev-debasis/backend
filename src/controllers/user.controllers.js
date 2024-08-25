import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
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
  const { username, email, fullName, password } = req.body;

  // Validating the user given fields if any field is empty or not?
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // checking if the user is already exist or not
  const isUserExit = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExit) {
    throw new ApiError(409, "Email or username already exist");
  }

  // Check for the images as per data model
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  // console.log("Request: ",req);
  // console.log("\n\n\n\n\n\n\nRequest.files: ",req.files);
  // console.log("\n\n\n\n\n\n\nRequest.files.avatar: ",req.files.avatar);
  // console.log("\n\n\n\n\n\n\nRequest.files.avatar(0): ",req.files.avatar[0]);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Uploading the images from local server to the cloudinary server

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // After uploading we will delete the files from our server.

  if (!avatar) {
    throw new ApiError(400, "Uploading Avatar on cloudinary failed");
  }

  // Create User object
  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user ");
  }

  // Returning thr response

  return res.json(
    new ApiResponse(200, createdUser, "User Registered Successfully")
  );
});

const loginUser = asyncHandler(async (req, res) => {
  // Steps for user login
  // 1. req.body -> data
  // 2. username/email
  // 3. find the user
  // 4. check the password
  // 5. access and refresh token
  // 6. send cookie

  const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken }

    } catch (error) {
      throw new ApiError(500, "Failed to generate Access & Refresh token")
    }
  };

  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  // find the user

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  // check the password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password doesn't match");
  }

  const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id)

 const loggedUser = User.findById(user._id).select("-password -refreshToken")

 const options = {
  httpOnly: true, // Can Manage from server only
  secure: true
 }
 return res
 .status(200)
 .cookie("AccessToken",accessToken, options)
 .cookie("RefreshToken",refreshToken, options)
 .json(
  new ApiResponse(
   200,
   {
    loggedUser,accessToken,refreshToken
   },
   "User LoggedIn successfully"
  )
 )

});

const logoutUser = asyncHandler(async (req, res) => {
  // Now the challenge is how can we know which user we have to logout as will not gonna ask the user to provide credentials while logOut. For that we will create a middleware that will fetch the user by the accessToken and then add the particular user object to the cookie then we will access that user from the cookie in this logOut method that's how we can get the access to the particular user.

  const user = req.user
 await User.findByIdAndUpdate(user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )
  const options = {
    httpOnly: true, // Can Manage from server only
    secure: true
  }

  return res
  .status(200)
  .clearCookie("refreshToken", options)
  .clearCookie("accessToken", options)
  .json( new ApiResponse(200, {}, "User Logged Out Successfully") )
  
})

export {
  registerUser,
  loginUser,
  logoutUser 
};
