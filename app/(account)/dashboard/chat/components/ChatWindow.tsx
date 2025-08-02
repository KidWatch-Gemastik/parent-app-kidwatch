"use client"

import { useEffect, useRef, useState } from "react"
import { useChatMessages } from "@/hooks/useChatMessages"
import { useSupabase } from "@/providers/SupabaseProvider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Mic, Video, ImageIcon, MapPin, ArrowLeft, Send, MoreVertical, Phone } from "lucide-react"
import LocationPreview from "./LocationPreview"

type ChatWindowProps = {
    childId: string
    childName?: string
    avatarUrl?: string
    isOnline?: boolean
    onBack?: () => void
    isMobile?: boolean
}

export default function ChatWindow({ childId, childName, avatarUrl, isOnline, onBack, isMobile }: ChatWindowProps) {
    const [newMessage, setNewMessage] = useState("")
    const [parentId, setParentId] = useState<string | null>(null)
    const { messages, loading, sendMessage } = useChatMessages(childId)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isRecording, setIsRecording] = useState(false)
    const [showActions, setShowActions] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<BlobPart[]>([])
    const inputRef = useRef<HTMLInputElement>(null)

    // ✅ Ambil session & client dari provider
    const { supabase, session } = useSupabase()

    useEffect(() => {
        if (session?.user) {
            setParentId(session.user.id)
        } else {
            // fallback check user jika session belum ready
            supabase.auth.getUser().then(({ data }) => {
                setParentId(data.user?.id ?? null)
            })
        }
    }, [session, supabase])

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        })
    }, [messages])

    const handleSend = async () => {
        if (!newMessage.trim() || !parentId) return
        await sendMessage(newMessage, "parent", parentId)
        setNewMessage("")
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    // ✅ Upload File ke Supabase Storage
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
                file_name: file.name,
            })
        }
        setShowActions(false)
    }

    const handleRecordAudio = async () => {
        if (isRecording) return
        try {
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
                stream.getTracks().forEach((track) => track.stop())
            }

            mediaRecorder.start()
            setIsRecording(true)
            setShowActions(false)
        } catch (error) {
            console.error("Error accessing microphone:", error)
        }
    }

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
        }
    }

    // Rekam Video
    const handleRecordVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            const chunks: BlobPart[] = []

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: "video/webm" })
                const file = new File([blob], "video-message.webm", { type: "video/webm" })
                await handleFileUpload(file)
                stream.getTracks().forEach((track) => track.stop())
            }

            mediaRecorder.start()
            setTimeout(() => mediaRecorder.stop(), 5000)
            setShowActions(false)
        } catch (error) {
            console.error("Error accessing camera:", error)
        }
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
                file_type: "location",
            })
            setShowActions(false)
        })
    }

    return (
        <div className="flex flex-col h-full max-h-screen rounded-lg overflow-hidden bg-gradient-to-b from-slate-950/80 via-gray-950/60 to-emerald-950/40">
            {/* Header Chat */}
            <div className="flex items-center gap-3 p-3 border-b border-emerald-500/20 bg-black/20 backdrop-blur-sm min-h-[60px]">
                {isMobile && onBack && (
                    <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 hover:text-emerald-400 h-8 w-8">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                )}

                <Avatar className="w-10 h-10 ring-2 ring-emerald-500/30 shrink-0">
                    {avatarUrl && <AvatarImage src={avatarUrl || "/placeholder.svg"} />}
                    <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-bold">
                        {childName?.[0] ?? "A"}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-white truncate">{childName ?? "Chat Anak"}</span>
                    <span className={cn("text-xs", isOnline ? "text-emerald-400" : "text-gray-400")}>
                        {isOnline ? "Online" : "Offline"}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="shrink-0 hover:text-emerald-400 h-8 w-8">
                        <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="shrink-0 hover:text-emerald-400 h-8 w-8">
                        <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="shrink-0 hover:text-emerald-400 h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3 relative" ref={scrollRef}>
                <div className="flex flex-col gap-2">
                    {loading && (
                        <>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className={cn("flex", i % 2 === 0 ? "justify-start" : "justify-end")}>
                                    <div
                                        className={cn(
                                            "h-8 rounded-2xl animate-pulse",
                                            isMobile ? "w-32" : "w-40",
                                            i % 2 === 0
                                                ? "bg-mint-500/10 border border-mint-500/20 rounded-bl-none"
                                                : "bg-emerald-500/20 border border-emerald-500/30 rounded-br-none",
                                        )}
                                    />
                                </div>
                            ))}
                        </>
                    )}

                    {!loading && messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center mt-10 opacity-70 px-4">
                            <Image
                                src="/source/Conversation-bro.svg"
                                alt="Mulai Chat"
                                width={isMobile ? 280 : 400}
                                height={isMobile ? 120 : 180}
                                className="mb-4"
                            />
                            <p className="text-emerald-300 text-center">Mulai chat dengan {childName ?? "anak"}!</p>
                        </div>
                    )}

                    {!loading &&
                        messages.map((msg) => (
                            <div key={msg.id} className={cn("flex", msg.sender_role === "parent" ? "justify-end" : "justify-start")}>
                                <div
                                    className={cn(
                                        "px-3 py-2 rounded-2xl text-sm backdrop-blur-sm shadow",
                                        isMobile ? "max-w-[280px]" : "max-w-xs",
                                        msg.sender_role === "parent"
                                            ? "bg-emerald-500/20 border border-emerald-500/30 rounded-br-none"
                                            : "bg-mint-500/10 border border-mint-500/20 rounded-bl-none",
                                    )}
                                >
                                    {msg.file_type === "location" ? (
                                        <div
                                            className={cn(
                                                "rounded-lg overflow-hidden border border-emerald-500/30",
                                                isMobile ? "w-40 h-24" : "w-48 h-32",
                                            )}
                                        >
                                            <LocationPreview data={msg.message} />
                                        </div>
                                    ) : msg.file_url ? (
                                        msg.file_type === "image" ? (
                                            <Image
                                                src={msg.file_url || "/placeholder.svg"}
                                                alt={msg.file_name || "image"}
                                                width={isMobile ? 120 : 150}
                                                height={isMobile ? 120 : 150}
                                                unoptimized
                                                className="rounded-lg"
                                            />
                                        ) : msg.file_type === "video" ? (
                                            <video
                                                src={msg.file_url}
                                                controls
                                                className={cn("rounded-lg", isMobile ? "max-w-[120px]" : "max-w-[150px]")}
                                            />
                                        ) : msg.file_type === "audio" ? (
                                            <audio src={msg.file_url} controls className="w-full" />
                                        ) : (
                                            <a
                                                href={msg.file_url}
                                                target="_blank"
                                                className="underline text-emerald-300 break-all"
                                                rel="noreferrer"
                                            >
                                                {msg.file_name || "Lihat File"}
                                            </a>
                                        )
                                    ) : (
                                        <span className="break-words">{msg.message}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </ScrollArea>

            {/* Action Menu */}
            {showActions && (
                <div className="p-3 border-t border-emerald-500/20 bg-black/20 backdrop-blur-sm">
                    <div className="flex gap-2 justify-center">
                        <label className="cursor-pointer">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30"
                            >
                                <ImageIcon className="w-5 h-5 text-emerald-400" />
                            </Button>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*,video/*,audio/*"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                            />
                        </label>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRecordAudio}
                            className="h-10 w-10 rounded-full bg-blue-500/20 hover:bg-blue-500/30"
                        >
                            <Mic className="w-5 h-5 text-blue-400" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRecordVideo}
                            className="h-10 w-10 rounded-full bg-purple-500/20 hover:bg-purple-500/30"
                        >
                            <Video className="w-5 h-5 text-purple-400" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSendLocation}
                            className="h-10 w-10 rounded-full bg-orange-500/20 hover:bg-orange-500/30"
                        >
                            <MapPin className="w-5 h-5 text-orange-400" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Input Chat */}
            <div className="p-3 border-t border-emerald-500/20 bg-black/20 backdrop-blur-sm">
                <div className="flex gap-2 items-end">
                    {/* Toggle Actions Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowActions(!showActions)}
                        className={cn(
                            "shrink-0 h-9 w-9 rounded-full transition-all duration-200",
                            showActions
                                ? "bg-emerald-500/30 text-emerald-300"
                                : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30",
                        )}
                    >
                        <span className="text-lg">+</span>
                    </Button>

                    {/* Voice Recording Button */}
                    {!isRecording ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onMouseDown={handleRecordAudio}
                            className="shrink-0 h-9 w-9 rounded-full bg-blue-500/20 hover:bg-blue-500/30"
                        >
                            <Mic className="w-4 h-4 text-blue-400" />
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleStopRecording}
                            className="shrink-0 h-9 w-9 rounded-full bg-red-500/20 hover:bg-red-500/30 animate-pulse"
                        >
                            <span className="text-red-400">⏹</span>
                        </Button>
                    )}

                    {/* Input Text */}
                    <div className="flex-1 flex gap-2">
                        <Input
                            ref={inputRef}
                            placeholder="Tulis pesan..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSend()
                                }
                            }}
                            className="bg-slate-900/40 border-emerald-500/20 focus-visible:ring-emerald-500/30 rounded-full h-9 text-sm"
                            disabled={isRecording}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!newMessage.trim() || isRecording}
                            className="bg-emerald-600 hover:bg-emerald-500 transition-colors h-9 w-9 rounded-full p-0 shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
