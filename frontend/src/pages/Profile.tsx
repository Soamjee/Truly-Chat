import { Camera } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore"

export const Profile = () => {
    const { imageAuth, isUpdatingProfile, email, memberSince, fullName, profileState} = useAuthStore()

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if(!file) return;

        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = () => {
             if (typeof reader.result === "string") {
                try{
                    // conversion to base64
                    isUpdatingProfile({new_profile_pic : reader.result});

                }
                catch(err){
                    console.log(err)
                }
                
             }
        }
    }
    return (
        <div className="h-screen pt-20">
            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-base-300 rounded-xl p-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">
                            Profile
                        </h1>
                        <p className="mt-2">
                            Your profile information
                        </p>
                    </div>

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img src={imageAuth || "/avatar.png"} alt="Profile" className="size-32 rounded-full object-cover border-4" />

                            <label htmlFor="avatar-upload" className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${profileState ? "animate-pulse pointer-events-none" : ""}`}>

                                <Camera className="w-5 h-5 text-base-200" />
                                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={profileState} />
                            </label>
                        </div>
                        <p className="text-sm text-zinc-400">
                            {profileState ? "Uploading...." : "Click the camera icon to update your dp"}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                                </svg>
                                Full name
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                                {fullName}
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                                </svg>
                                Email 
                            </div>
                            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                                {email}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 bg-base-300 rounded-xl p-6">
                        <h2 className="text-lg font-medium mb-4">
                            Account Information
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                                <span>Member Since</span>
                                <span>{memberSince?.split("T")[0]}</span>
                            </div>
                            
                            <div className="flex items-center justify-between py-2">
                                <span>Account Status</span>
                                <span className="text-green-500">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}