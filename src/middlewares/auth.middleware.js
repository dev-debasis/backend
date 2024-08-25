import { JsonWebTokenError } from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { ApiError } from "../utils/ApiError"
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401, "Unauthorized access")
        }
    
        const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = User.findById(decodedTokenInfo._id)
    
        if(!user){
            throw new ApiError(401, "Invalid access token")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token")
    }
}) 

