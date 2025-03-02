import http from 'http'
import { Server } from 'socket.io'
import express from 'express'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173']
    }
})

const onlineUsers: Record<string, string> = {}

const getReceiverSocketId = (userId : string) => {
    return onlineUsers[userId]
}

io.on('connection', (socket)=>{
    console.log("A user connected", socket.id)

    const userId = socket.handshake.query.userId as string 

    if(userId) onlineUsers[userId] = socket.id
    
    io.emit('getOnlineUsers', Object.keys(onlineUsers))
    

    socket.on("disconnect", ()=>{
        console.log("A user disconnect", socket.id)
        delete onlineUsers[userId]
        io.emit("getOnlineUsers", Object.keys(onlineUsers))
    })
})

export {app, server, getReceiverSocketId, io}