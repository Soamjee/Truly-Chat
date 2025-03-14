import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
        maxLength: 50
    },
    profilePic: {
        type: String,
        default: ""
    }
}, {timestamps : true}
)

export const User = mongoose.model('Users', userSchema)