import { create } from "zustand"
import { axiosInstance } from "../lib/axiosInstance"
import toast from "react-hot-toast"
import { useAuthStore } from "./useAuthStore"

interface User {
    _id: string,
    email: string,
    profilePic: string,
    fullName: string,
    createdAt: string,
    updatedAt: string,
}

interface Message{
    senderId: string,
    receiverId: string,
    text: string,
    image: string,
    createdAt: string,
    updatedAt: string,
}

interface Send {
    text: string,
    image: string | null
}

interface Chats {
    users: User[],
    messages: Message[],
    selectedUser: null | User,
    isUserLoading: boolean,
    isMessageLoading: boolean,
    getAllUsers: () => void,
    getAllChats: (id: string | undefined) => void,
    setSelectedUser: (user : User | null) => void,
    sendMsg : (data: Send | null) => void,
    chatting : () => void,
    notChatting : () => void

}

export const useChatStore = create<Chats>((set, get) => ({
    users: [],
    messages: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,

    getAllUsers: async () => {
        set({
            isUserLoading: true
        })
        try {
            const res = await axiosInstance.get('/chats/users')
            toast.success("Lets Chat")
            set({
                users: res.data.allUser
            })
        }catch(err){
            console.log(err)
            toast.error("SERVER DOWN")
        }finally{
            set({
                isUserLoading: false
            })
        }
    },

    getAllChats: async(id) => {
        set({
            isMessageLoading: true
        })
        try{
            const res = await axiosInstance.get(`/chats/${id}`)
            toast.success("All Chats")
            set({
                messages: res.data
            })
        }catch(err){
            console.log(err)
            toast.error("SERVER_DOWN")
        }finally{
            set({
                isMessageLoading: false
            })
        }
    },

    sendMsg : async(data) => {
        const {selectedUser, messages} = get()
        const send = await axiosInstance.post(`/chats/send/${selectedUser?._id}`, data)
        set({messages: [...messages, send.data]})
    },

    chatting : () => {
        const {selectedUser} = get()
        if(!selectedUser) return;

        const socket = useAuthStore.getState().SocketState
        socket?.on("newMessage", (chatting)=> {
            if(chatting.senderId !== selectedUser._id) return ;
            set({
                messages: [...get().messages, chatting]
            })
        })
    },

    notChatting : () => {
        const socket = useAuthStore.getState().SocketState
        socket?.off("newMessage")
    },

    setSelectedUser: (user) => {
        set({
            selectedUser : user
        })
    }

}))