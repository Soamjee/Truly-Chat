import { useEffect, useState } from "react"
import { useChatStore } from "../store/useChatStore"
import { SideBarSkeleton } from "./skeletons/SideBarSkeleton"
import { useAuthStore } from "../store/useAuthStore"

export const Sidebar = () => {
    const { users, getAllUsers, isUserLoading, selectedUser, setSelectedUser } = useChatStore()

    const {onlineUser} = useAuthStore()

    const [showOnline, setShowOnline] = useState(false)

    useEffect(() => {
        getAllUsers()
    }, [getAllUsers])

    if (isUserLoading) {
        return <SideBarSkeleton />
    }

    const filteredOnlineUser = showOnline ? users.filter((users) => onlineUser?.includes(users._id)) : users

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                    </svg>

                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
                {/* Online Filter */}
                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input type="checkbox" checked={showOnline} onChange={(e)=> setShowOnline(e.target.checked)} className="checkbox checkbox-sm"/>
                        <span className="text-sm">Show Online</span>
                    </label>
                    <span className="text-xs text-zinc-500">({(onlineUser?.length ?? 1 ) - 1} online)</span>

                </div>

            </div>
            <div className="overflow-y-auto w-full py-3">
                {filteredOnlineUser.map((user, i)=> (
                    <button key={i} className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer ${selectedUser?._id === user._id ? "bg-base-300  ring-1 ring-base-300" : ""}`} onClick={()=>{
                        setSelectedUser(user)
                    }}>
                        
                        <div className="relative mx-auto lg:mx-0">
                           
                            <img src={user.profilePic || "/avatar.png"} alt={user.fullName} className="size-12 object-cover rounded-full"/>
                            {onlineUser?.includes(user._id) && (
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"/>
                            )}
                        </div>

                        {/* User info - only visible on larger screens */}
                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">
                                {user.fullName}
                            </div>
                            <div className="text-sm text-zinc-400">
                                {onlineUser?.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}
                
                {filteredOnlineUser.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">
                        Noone is Online 😔
                    </div>

                )}
            </div>

        </aside>
    )
}