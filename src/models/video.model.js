import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

/**
 * Mongoose schema for the Video model.
 * This schema defines the structure and behavior of video documents in the database.
 */
const videoSchema = new mongoose.Schema(
    {
        videoFile: {
            type: String,
            required: true  // Video file path or URL is required.
        },
        thumbnail: {
            type: String,
            required: true  // Thumbnail image URL is required (typically stored on Cloudinary).
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"  // Reference to the User model, indicating the owner of the video.
        },
        title: {
            type: String,
            required: true  
        },
        description: {
            type: String,
            required: true  
        },
        duration: {
            type: Number,
            required: true  
        },
        views: {
            type: Number,
            default: 0  
        },
        isPublished: {
            type: Boolean,
            default: true  
        }
    },
    {
        timestamps: true  
    }
);

/**
 * Plugin to add pagination capability to aggregation queries.
 * This plugin allows for easy pagination of results when using Mongoose aggregation.
*/
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);  // Export the Video model based on the videoSchema.
