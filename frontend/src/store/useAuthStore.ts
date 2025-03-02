import { create } from 'zustand'
import { axiosInstance } from '../lib/axiosInstance'
import toast from 'react-hot-toast'
import {io, Socket} from 'socket.io-client'

const BASE_URL = import.meta.env.MODE === "development" ? 'http://localhost:3000' : "/"

interface UpdateProfilePic{
    new_profile_pic: string;

}
interface CheckState {
    userAuth: null | JSON
    id: null | string
    firstLetter: null | string
    imageAuth: null | string
    fullName: null | string
    email: null | string
    memberSince: null | string
    isCheck : () => void
    isChecking : boolean
    signUpState : boolean
    logInState : boolean
    profileState: boolean
    isSignUpingState : (
        data: { fullName: string; email: string; password: string }) => void
    isLogIningState : (
        data: {email: string, password: string }) => void
    isUpdatingProfile: (data: UpdateProfilePic | null) => void
    isLoggedOutState: () => void
    onlineUser : string[] | undefined
    connectWebSocket : () => void
    disconnectWebSocket : () => void
    chatSocket : () => void
    SocketState : Socket | null
}

export const useAuthStore = create<CheckState>((set, get)=> ({
    userAuth: null,
    imageAuth: null,
    firstLetter: null,
    fullName: null,
    email: null,
    id: null,
    memberSince: null,
    onlineUser : [],
    signUpState: false,
    logInState: false,
    profileState: false,
    isChecking: true,
    SocketState : null,


    isCheck: async () => {
        try{
            const result = await axiosInstance.get('/auth/check')
            set({
                userAuth: result.data,
                firstLetter: result.data.user.fullName[0],
                fullName: result.data.user.fullName,
                email: result.data.user.email,
                memberSince: result.data.user.createdAt,
                imageAuth: result.data.user.profilePic,
                id: result.data.user._id
            })
            get().connectWebSocket()
        }catch(err){
            console.log("Error", err)
        }finally{
            set({
                isChecking: false
            })
        }
    },

    isSignUpingState: async(data) => {
        set({
            signUpState: true
        })
        try{
            const res = await axiosInstance.post('/auth/signup', data)
            toast.success("Account created successfully")
            get().connectWebSocket()

            set({
                userAuth: res.data,
                firstLetter: res.data.details.createdUser.fullName[0],
                id: res.data.details.createdUser._id
            })
            
        }catch(err){
            console.log('Error', err)
            toast.error("Sign up failed")
        }finally{
            set({
                signUpState: false
            })
        }
    },

    isLogIningState: async(data) => {
        set({
            logInState: true
        })
        try{
            const res = await axiosInstance.post('auth/login', data)
            toast.success("Login Successful")
            get().connectWebSocket()
            set({
                userAuth: res.data,
                firstLetter: res.data.details.loggedUser.fullName[0],
                id: res.data.details.loggedUser._id
            })
        }catch(err){
            console.log('err', err)
            toast.error("Login failed")
        }finally{
            set({
                logInState: false
            })
        }
    },

    isLoggedOutState: async () =>{
        try{
            await axiosInstance.post('auth/logout')
            toast.success("Logged Out")
            set({
                userAuth: null,
                firstLetter: null
            })
            get().disconnectWebSocket()
        }catch(err){
            console.log("err: ", err)
            toast.error("Logout failed")
        }
    },

    isUpdatingProfile: async(data) => {
        set({
            profileState: true
        })
        try{
            
            const profileImg = await axiosInstance.put('auth/update-profile', data)
            console.log(profileImg)
            set({
                imageAuth: profileImg.data.profilePicUpdate.profilePic
            })
            toast.success('Dp updated successfully')
        }catch(err){
            console.log(err)
            toast.error('Failed to update your dp')
        }finally{
            set({
                profileState: false
            })
        }
    },

    connectWebSocket: () => {
        const {id, userAuth} = get()

        if(!userAuth || get().SocketState?.connected) return;

        const socket = io(BASE_URL, {
            query:{
                userId: id
            }
        })
        socket.connect()
        set({
            SocketState: socket
        })

        socket.on("getOnlineUsers", (onlineUserId)=>{
            set({
                onlineUser : onlineUserId
            })
        })
        
    },

    chatSocket : () => {

    },

    disconnectWebSocket: () => {
       if(get().SocketState?.connected) get().SocketState?.disconnect()

    }

}))