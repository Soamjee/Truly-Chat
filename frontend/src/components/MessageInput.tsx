import { Image, Send, X } from "lucide-react"
import { useRef, useState } from "react"
import toast from "react-hot-toast"
import { useChatStore } from "../store/useChatStore"

export const MessageInput = () => {
    const [text, setText] = useState('')
    const [ImagePreview, setImgPreview] = useState<string | null>('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const {sendMsg} = useChatStore()

    const handleSendMsg = async(e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!text.trim() && !ImagePreview) return;
        try{
            sendMsg({
                text: text.trim(),
                image: ImagePreview
            })

            // clear form
            setText("")
            setImgPreview(null)

            if(fileInputRef.current){
                fileInputRef.current.value = ""
            }
        }catch(err){
            console.log(err)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file?.type.startsWith('image/')) {
            toast.error("Please select an image file")
            return;
        }
        
        const reader = new FileReader()
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setImgPreview(reader.result)
            }
        }
        reader.readAsDataURL(file)
        
    }
    const removeImage = () => {
        setImgPreview(null)
        if(fileInputRef.current){
            fileInputRef.current.value = ""
        }
     }

    return (
        <div className="p-4 w-full">
            {ImagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img src={ImagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-zinc-700" />

                        <button className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center cursor-pointer" type="button" onClick={removeImage}>
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}
            <form className="flex items-center gap-2" onSubmit={handleSendMsg}>
                <div className="flex-1 flex gap-2">
                    <input type="text" className="w-full input input-bordered rounded-lg input-sm sn:input-md" placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} />

                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

                    <button type="button" className={`hidden sm:flex btn btn-circle ${ImagePreview ? "text-emerald-500" : "text-zinc-400"}`} onClick={() => fileInputRef.current?.click()}>
                        <Image size={20} />
                    </button>
                </div>

                <button type="submit" className="btn btn-sm btn-circle" disabled={!text.trim() && !ImagePreview}>
                    <Send size={22} />
                </button>
            </form>

        </div>
    )
}