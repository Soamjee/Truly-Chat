import { useEffect, useRef } from "react"
import { useChatStore } from "../store/useChatStore"
import { ChatHeader } from "./ChatHeader"
import { MessageInput } from "./MessageInput"
import { MessageSkeleton } from "./skeletons/MessageSkeleton"
import { useAuthStore } from "../store/useAuthStore"
import { formatMessageTime } from "../lib/utilis"

export const ChatContainer = () => {
    const {messages, getAllChats, isMessageLoading, selectedUser, chatting, notChatting} = useChatStore()

    const {id, imageAuth} = useAuthStore()

    const msgRef = useRef<HTMLDivElement | null>(null)

    useEffect(()=>{
        getAllChats(selectedUser?._id)

        chatting()

        return () => notChatting()
    }, [selectedUser?._id])

    useEffect(()=>{
        if(messages && msgRef.current){
            msgRef.current.scrollIntoView({behavior: "smooth"})
        }
    }, [messages])

    if(isMessageLoading){
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader/>
                <MessageSkeleton/>
                <MessageInput/>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader/>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i)=>(
                <div key={i} className={`chat ${msg.senderId === id ? 'chat-end' : 'chat-start'}`} ref={msgRef}>
                    <div className="chat-image avatar">
                        <div className="size-10 rounded-full border">
                            <img src={msg.senderId === id ? imageAuth || '/avatar.png' : selectedUser?.profilePic || '/avatar.png'} alt='profile_pic'/>
                        </div>
                    </div>
                    <div className="chat-header mb-1">
                        <time className="text-xs opacity-50 ml-1">
                            {formatMessageTime(msg.createdAt)}
                        </time>
                    </div>
                    <div className="chat-bubble flex flex-col">
                        {msg.image && (
                            <img src={msg.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2"/>
                        )}
                            {msg.text && <p>{msg.text}</p>}
                        </div>


                </div>
            ))}

            </div>
            <MessageInput/>
        </div>
    )
}