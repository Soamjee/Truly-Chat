import { Request, Response } from "express"
import { User } from "../models/user.model.js"
import { DecodeValue } from "../middleware/auth.middleware.js"
import { Chat } from "../models/chat.model.js"
import cloudinary from "../lib/cloudinary.js"
import mongoose from "mongoose"
import { getReceiverSocketId, io } from "../lib/socket.js"

export const GetAllUsers = async (req: Request, res: Response) => {
    try {
        const id = (req as DecodeValue).decodedValue
        const allUser = await User.find({
            _id: {
                $ne: id
            }
        }).select('-password')
        res.status(200).json({
            allUser
        })
    } catch (err) {
        res.status(500).json({
            message: "INTERNAL_SERVER_ERROR"
        })
    }
}

export const GetAllChats = async (req: Request, res: Response) => {
    try {
        const myId = (req as DecodeValue).decodedValue
        const friendId = req.params.id

        const allChats = await Chat.find({
            $or: [
                { senderId: myId, receiverId: friendId },
                { senderId: friendId, receiverId: myId }
            ]
        })

        if (!allChats) {
            res.status(200).json("No messages were found")
        }

        res.status(200).json(allChats)
    } catch (err) {
        res.status(500).json({
            message: "INTERNAL_SERVER_ERROR"
        })
    }

}

export const SendMessage = async (req: Request, res: Response) => {
    try {
        const myId = (req as DecodeValue).decodedValue
        const friendId = req.params.id
        
        const sender = new mongoose.Types.ObjectId(myId)
        const receiver = new mongoose.Types.ObjectId(friendId)
        const { text, image } = req.body

        let imageUrl;
        if(image){
            const uploadedImg = await cloudinary.uploader.upload(image)
            imageUrl = uploadedImg.secure_url
        }

        const chatting = new Chat({
                senderId: sender, 
                receiverId: receiver, 
                text: text, 
                image: imageUrl 
        })
        await chatting.save()
        res.status(201).json(chatting)

        // websocket logic
        const receiverSocketId = getReceiverSocketId(friendId)

        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', chatting)
        }


    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "INTERNAL_SERVER_ERROR"
        })
    }
    



}