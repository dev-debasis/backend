import mongoose, {Schema} from "mongoose";
import User from "./user.model.js"

const subscriptionSchema = new Schema({
    channel:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    subscriber:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})

export const subscription = mongoose.model("subscription",subscriptionSchema)