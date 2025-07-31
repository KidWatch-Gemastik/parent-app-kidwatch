"use client"

import { useEffect, useRef, useState } from "react"
import { useChatMessages } from "@/hooks/useChatMessages"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Mic, Video, ImageIcon, MapPin } from "lucide-react"
import LocationPreview from "./LocationPreview"

type ChatWindowProps = {
    childId: string
    childName?: string
    avatarUrl?: string
    isOnline?: boolean
}

export default function ChatWindow({ childId, childName, avatarUrl, isOnline }: ChatWindowProps) {
    const [newMessage, setNewMessage] = useState("")
    const [parentId, setParentId] = useState<string | null>(null)
    const { messages, loading, sendMessage } = useChatMessages(childId)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isRecording, setIsRecording] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<BlobPart[]>([])

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setParentId(data.user?.id ?? null)
        })
    }, [])

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    }, [messages])

    const handleSend = async () => {
        if (!newMessage.trim() || !parentId) return
        await sendMessage(newMessage, "parent", parentId)
        setNewMessage("")
    }

    // Upload File ke Supabase Storage
    const handleFileUpload = async (file: File) => {
        if (!parentId) return

        const fileExt = file.name.split(".").pop()
        const filePath = `chat/${parentId}/${Date.now()}-${Math.random()}.${fileExt}`

        const { error } = await supabase.storage.from("chat-files").upload(filePath, file)
        if (error) {
            console.error("Upload error", error.message)
            return
        }

        const { data } = supabase.storage.from("chat-files").getPublicUrl(filePath)

        console.log(data.publicUrl);
        if (data.publicUrl) {
            const type = file.type.startsWith("image")
                ? "image"
                : file.type.startsWith("video")
                    ? "video"
                    : file.type.startsWith("audio")
                        ? "audio"
                        : "document"

            await supabase.from("chat_messages").insert({
                child_id: childId,
                parent_id: parentId,
                sender_role: "parent",
                message: "",
                file_url: data.publicUrl,
                file_type: type,
                file_name: file.name
            })

        }
    }

    const handleRecordAudio = async () => {
        if (isRecording) return
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        chunksRef.current = []

        mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data)
        mediaRecorder.onstop = async () => {
            const blob = new Blob(chunksRef.current, { type: "audio/webm" })
            const file = new File([blob], "voice-message.webm", { type: "audio/webm" })
            await handleFileUpload(file)
            setIsRecording(false)
        }

        mediaRecorder.start()
        setIsRecording(true)
    }

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
        }
    }


    // Rekam Video
    const handleRecordVideo = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        const chunks: BlobPart[] = []

        mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
        mediaRecorder.onstop = async () => {
            const blob = new Blob(chunks, { type: "video/webm" })
            const file = new File([blob], "video-message.webm", { type: "video/webm" })
            await handleFileUpload(file)
        }

        mediaRecorder.start()
        setTimeout(() => mediaRecorder.stop(), 5000)
    }

    const handleSendLocation = () => {
        if (!parentId) return
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords
            const locationMessage = JSON.stringify({ lat: latitude, lng: longitude })

            await supabase.from("chat_messages").insert({
                child_id: childId,
                parent_id: parentId,
                sender_role: "parent",
                message: locationMessage,
                file_type: "location"
            })
        })
    }


    return (
        <div className="flex flex-col h-full max-h-screen rounded-lg overflow-hidden bg-gradient-to-b from-slate-950/80 via-gray-950/60 to-emerald-950/40">
            {/* Header Chat */}
            <div className="flex items-center gap-3 p-4 border-b border-emerald-500/20 bg-black/20 backdrop-blur-sm">
                <Avatar className="w-10 h-10 ring-2 ring-emerald-500/30">
                    {avatarUrl && <AvatarImage src={avatarUrl} />}
                    <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-bold">
                        {childName?.[0] ?? "A"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold">{childName ?? "Chat Anak"}</span>
                    <span className={cn("text-xs", isOnline ? "text-emerald-400" : "text-gray-400")}>
                        {isOnline ? "Online" : "Offline"}
                    </span>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 relative" ref={scrollRef}>
                <div className="flex flex-col gap-3">
                    {loading && (
                        <>
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className={cn("flex", i % 2 === 0 ? "justify-start" : "justify-end")}
                                >
                                    <div
                                        className={cn(
                                            "h-8 w-40 rounded-2xl animate-pulse",
                                            i % 2 === 0
                                                ? "bg-mint-500/10 border border-mint-500/20 rounded-bl-none"
                                                : "bg-emerald-500/20 border border-emerald-500/30 rounded-br-none"
                                        )}
                                    />
                                </div>
                            ))}
                        </>
                    )}

                    {!loading && messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center mt-10 opacity-70">
                            <Image
                                src="/source/Conversation-bro.svg"
                                alt="Mulai Chat"
                                width={400}
                                height={180}
                                className="mb-4"
                            />
                            <p className="text-emerald-300">Mulai chat dengan {childName ?? "anak"}!</p>
                        </div>
                    )}

                    {!loading &&
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn("flex", msg.sender_role === "parent" ? "justify-end" : "justify-start")}
                            >
                                <div
                                    className={cn(
                                        "max-w-xs px-4 py-2 rounded-2xl text-sm backdrop-blur-sm shadow",
                                        msg.sender_role === "parent"
                                            ? "bg-emerald-500/20 border border-emerald-500/30 rounded-br-none"
                                            : "bg-mint-500/10 border border-mint-500/20 rounded-bl-none"
                                    )}
                                >
                                    {msg.file_type === "location" ? (
                                        <div className="w-48 h-32 rounded-lg overflow-hidden border border-emerald-500/30">
                                            <LocationPreview data={msg.message} />
                                        </div>
                                    ) : msg.file_url ? (
                                        msg.file_type === "image" ? (
                                            <Image
                                                src={msg.file_url}
                                                alt={msg.file_name || "image"}
                                                width={150}
                                                height={150}
                                                unoptimized
                                                className="rounded-lg"
                                            />
                                        ) : msg.file_type === "video" ? (
                                            <video src={msg.file_url} controls className="rounded-lg max-w-[150px]" />
                                        ) : msg.file_type === "audio" ? (
                                            <audio src={msg.file_url} controls />
                                        ) : (
                                            <a
                                                href={msg.file_url}
                                                target="_blank"
                                                className="underline text-emerald-300"
                                            >
                                                {msg.file_name || "Lihat File"}
                                            </a>
                                        )
                                    ) : (
                                        msg.message
                                    )}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </ScrollArea>

            {/* Input Chat */}
            <div className="p-4 border-t border-emerald-500/20 bg-black/20 backdrop-blur-sm flex gap-2 items-center">
                {/* File Upload */}
                <label className="cursor-pointer text-emerald-400 hover:text-emerald-300">
                    <ImageIcon className="w-6 h-6" />
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*,video/*,audio/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    />
                </label>

                {!isRecording ? (
                    <Button variant="ghost" size="icon" onClick={handleRecordAudio}>
                        <Mic className="w-5 h-5 text-emerald-400" />
                    </Button>
                ) : (
                    <Button variant="destructive" size="icon" onClick={handleStopRecording}>
                        ⏹
                    </Button>
                )}
                {/* Record Video */}
                <Button variant="ghost" size="icon" onClick={handleRecordVideo}>
                    <Video className="w-5 h-5" />
                </Button>

                {/* Send Location */}
                <Button variant="ghost" size="icon" onClick={handleSendLocation}>
                    <MapPin className="w-5 h-5" />
                </Button>

                {/* Input Text */}
                <Input
                    placeholder="Tulis pesan..."
                    value={newMessage}
                    required
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="bg-slate-900/40 border-emerald-500/20 focus-visible:ring-emerald-500/30"
                />

                <Button
                    onClick={handleSend}
                    className="bg-emerald-600 hover:bg-emerald-500 transition-colors"
                >
                    Kirim
                </Button>
            </div>
        </div>
    )
}
