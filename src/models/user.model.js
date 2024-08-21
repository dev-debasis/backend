import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Mongoose schema for the User model.
 * This schema defines the structure and behavior of user documents in the database.
 */
const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,  
            unique: true,  
            lowercase: true,
            trim: true,
            
            
        },
        email: {
            type: String,
            required: true,  
            unique: true,  
            lowercase: true,  
            trim: true,  
        },
        fullName: {
            type: String,
            required: true,  
            trim: true,  
            index: true 
        },
        avatar: {
            type: String,  
            required: true
        },
        coverImage: {
            type: String, 
        },
        password: {
            type: String,
            required: [true, 'Password is required']  // Password is required with a custom error message.
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"  // Reference to the Video model, storing user's watch history.
            }
        ],
        refreshToken: {
            type: String  // Refresh token for maintaining session across requests.
        }
    },
    {
        timestamps: true  // Automatically manage `createdAt` and `updatedAt` fields.
    }
);

/**
 * Pre-save middleware to hash the user's password before saving it to the database.
 * This only runs if the password field is modified.
 */
UserSchema.pre("save", async function (next) {
    if (!this.isModified(password)) return next();  // If password is not modified, skip hashing.
    this.password = bcrypt.hash(this.password, 10);  // Hash the password with a salt factor of 10.
    next();  // Proceed to save the document.
});

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

/**
 * Method to generate a JWT access token for the user.
 * The token includes the user's ID, username, email, and full name.
*/
UserSchema.methods.generateAccessToken = function () {
   return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,  // Secret key for signing the access token.
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY  // Token expiry time.
        }
    );
};

/**
 * Method to generate a JWT refresh token for the user.
 * The token includes only the user's ID.
*/
UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,  // Secret key for signing the refresh token.
        {
            expiresIn: process.env.EXPIRY  // Token expiry time.
        }
    );
};

export const User = mongoose.model("User", UserSchema);
