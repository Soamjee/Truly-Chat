import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    text: {
        type: String
    },
    image: {
        type: String,
        default: ""
    }
}, { timestamps: true })


export const Chat = mongoose.model('Chats', chatSchema)