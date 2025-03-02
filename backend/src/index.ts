import express from 'express'
import authRoute from './routes/auth.route'
import chatRoute from './routes/chat.route'
import dotenv from 'dotenv'
import { connectDB } from './lib/db'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { app, server } from './lib/socket'

import path from "path"

dotenv.config()
const PORT = process.env.PORT
const __dirname = path.resolve()

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser())

// http://localhost:5173/ -> will give cors error 
// The error occurs because the Access-Control-Allow-Origin header from your backend (http://localhost:3000) does not match the exact origin (http://localhost:5173).
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/api/auth', authRoute)
app.use('/api/chats', chatRoute)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res)=>{
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

server.listen(PORT, ()=>{
    console.log(`Listening to ${PORT}`)
    connectDB()
})