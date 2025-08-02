"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Loader2, Send, Sparkles, ChevronDown, ChevronRight, Menu, X, ImageIcon } from "lucide-react"
import Image from "next/image"
import { useSupabase } from "@/providers/SupabaseProvider"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ChatEntry {
    role: "user" | "ai"
    message: string
    timestamp: string
}

interface ChatMedia {
    id: string
    file_url: string
    file_type: "image" | "video" | "audio" | "location"
    file_name?: string
    created_at: string
}

export default function AIAssistant() {
    const [question, setQuestion] = useState("")
    const [chatHistory, setChatHistory] = useState<ChatEntry[]>([])
    const [chatMedia, setChatMedia] = useState<ChatMedia[]>([])
    const [loading, setLoading] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)
    const [collapsed, setCollapsed] = useState<{ [date: string]: boolean }>({})

    const chatEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { supabase } = useSupabase()

    // Check if mobile
    useEffect(() => {
        const checkScreen = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            if (!mobile) {
                setShowSidebar(true)
            }
        }
        checkScreen()
        window.addEventListener("resize", checkScreen)
        return () => window.removeEventListener("resize", checkScreen)
    }, [])

    const fetchChatHistory = async () => {
        const { data, error } = await supabase
            .from("ai_chat_logs")
            .select("question, answer, created_at")
            .order("created_at", { ascending: true })
            .limit(200)

        if (error) {
            console.error("Error fetch history:", error.message, error.details)
            return
        }

        const formatted: ChatEntry[] =
            data?.flatMap((item: any) => [
                { role: "user", message: item.question, timestamp: item.created_at },
                { role: "ai", message: item.answer || "❌ Tidak ada jawaban", timestamp: item.created_at },
            ]) || []

        setChatHistory(formatted)
    }

    const fetchChatMedia = async () => {
        const { data, error } = await supabase
            .from("chat_messages")
            .select("id, file_url, file_type, file_name, created_at")
            .not("file_url", "is", null)
            .order("created_at", { ascending: false })
            .limit(8)

        if (error) {
            console.error("Error fetch media:", error.message, error.details)
            return
        }

        setChatMedia(data || [])
    }

    useEffect(() => {
        fetchChatHistory()
        fetchChatMedia()
    }, [])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chatHistory, loading])

    const askAI = async (q?: string) => {
        const ask = q || question
        if (!ask.trim()) return

        const { data } = await supabase.auth.getUser()
        const user = data.user

        if (!user) {
            console.error("User belum login")
            return
        }

        const now = new Date().toISOString()
        const userChat: ChatEntry = { role: "user", message: ask, timestamp: now }
        const placeholder: ChatEntry = {
            role: "ai",
            message: "⏳ KiddyGoo sedang menganalisa...",
            timestamp: now,
        }

        setChatHistory((prev) => [...prev, userChat, placeholder])
        setQuestion("")
        setLoading(true)

        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
        }

        try {
            const res = await fetch("/api/ai-assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: ask, userId: user.id }),
            })

            const data = await res.json()
            const answer = data.answer || "❌ Maaf, saya tidak bisa menjawab saat ini."

            setChatHistory((prev) => {
                const copy = [...prev]
                copy[copy.length - 1] = {
                    role: "ai",
                    message: answer,
                    timestamp: now,
                }
                return copy
            })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const quickActions = [
        "Bagaimana aktivitas anak hari ini?",
        "Ada panggilan mencurigakan?",
        "Tunjukkan lokasi terakhir anak",
        "Analisis media terbaru",
    ]

    const groupedHistory = chatHistory.reduce((acc: Record<string, ChatEntry[]>, item) => {
        const date = new Date(item.timestamp).toLocaleDateString("id-ID")
        if (!acc[date]) acc[date] = []
        acc[date].push(item)
        return acc
    }, {})

    const renderMedia = (msg: ChatMedia) => {
        const baseClasses = cn(
            "rounded-lg border border-emerald-500/20 object-cover transition-all duration-300 hover:scale-105",
            isMobile ? "w-20 h-20" : "w-32 h-32",
        )

        switch (msg.file_type) {
            case "image":
                return (
                    <Image
                        src={msg.file_url || "/placeholder.svg"}
                        width={isMobile ? 80 : 128}
                        height={isMobile ? 80 : 128}
                        unoptimized
                        alt={msg.file_name || "image"}
                        className={baseClasses}
                    />
                )
            case "video":
                return <video src={msg.file_url} controls className={baseClasses} />
            case "audio":
                return <audio src={msg.file_url} controls className={cn("w-full", isMobile ? "max-w-20" : "max-w-32")} />
            case "location":
                return (
                    <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(msg.file_name || "")}&z=15&output=embed`}
                        className={baseClasses}
                        loading="lazy"
                    />
                )
            default:
                return (
                    <a href={msg.file_url} target="_blank" className="text-emerald-400 underline text-sm" rel="noreferrer">
                        {msg.file_name || "Lihat File"}
                    </a>
                )
        }
    }

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuestion(e.target.value)

        // Auto-resize textarea
        const textarea = e.target
        textarea.style.height = "auto"
        textarea.style.height = Math.min(textarea.scrollHeight, isMobile ? 100 : 120) + "px"
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            askAI()
        }
    }

    return (
        <div className="h-full w-full relative">
            {/* Mobile Overlay */}
            {isMobile && showSidebar && (
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowSidebar(false)} />
            )}

            <div className="flex h-full max-w-7xl mx-auto gap-4 p-4">
                {/* Sidebar History */}
                <aside
                    className={cn(
                        "bg-gray-900/80 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-4 transition-all duration-300",
                        // Desktop
                        !isMobile && "w-80",
                        // Mobile
                        isMobile && (showSidebar ? "fixed left-4 top-20 bottom-4 w-80 z-50 shadow-2xl" : "hidden"),
                    )}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Riwayat Chat
                        </h2>
                        {isMobile && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowSidebar(false)}
                                className="text-gray-400 hover:text-white h-8 w-8"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    <ScrollArea className="h-[calc(100%-60px)]">
                        {Object.keys(groupedHistory).length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-emerald-400" />
                                </div>
                                <p className="text-gray-400 text-sm">Belum ada percakapan.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {Object.entries(groupedHistory).map(([date, chats]) => {
                                    const isCollapsed = collapsed[date]
                                    return (
                                        <div key={date} className="border-b border-emerald-500/20 pb-3">
                                            <button
                                                onClick={() => setCollapsed((prev) => ({ ...prev, [date]: !isCollapsed }))}
                                                className="flex items-center justify-between w-full text-left text-gray-300 hover:text-emerald-400 transition-colors p-2 rounded-lg hover:bg-emerald-500/10"
                                            >
                                                <span className="font-medium text-sm">{date}</span>
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                                                        {chats.length}
                                                    </Badge>
                                                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </div>
                                            </button>
                                            {!isCollapsed && (
                                                <div className="mt-2 space-y-1">
                                                    {chats.map((c, i) => (
                                                        <div
                                                            key={i}
                                                            className="text-xs p-2 rounded-md hover:bg-emerald-500/10 text-gray-400 cursor-pointer transition-colors border border-transparent hover:border-emerald-500/20"
                                                            title={c.role === "user" ? `Anda: ${c.message}` : `AI: ${c.message}`}
                                                            onClick={() => {
                                                                if (c.role === "user") {
                                                                    setQuestion(c.message)
                                                                    if (isMobile) setShowSidebar(false)
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex items-start gap-2">
                                                                <span className="text-emerald-400 shrink-0">{c.role === "user" ? "🧑" : "🤖"}</span>
                                                                <span className="line-clamp-2 leading-relaxed">
                                                                    {c.message.slice(0, isMobile ? 40 : 50)}
                                                                    {c.message.length > (isMobile ? 40 : 50) && "..."}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </aside>

                {/* Main Chat */}
                <div className="flex-1 flex flex-col space-y-4 min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className={cn("font-bold text-emerald-400 flex items-center gap-2", isMobile ? "text-lg" : "text-2xl")}>
                            <Sparkles className={cn("text-emerald-400", isMobile ? "w-5 h-5" : "w-6 h-6")} />
                            AI Assistant
                            {isMobile && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowSidebar(true)}
                                    className="ml-auto text-emerald-400 hover:bg-emerald-500/10 h-8 w-8"
                                >
                                    <Menu className="w-4 h-4" />
                                </Button>
                            )}
                        </h1>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                            Online
                        </Badge>
                    </div>

                    {/* Chat Box */}
                    <div
                        className={cn(
                            "bg-gray-900/70 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-4 overflow-y-auto space-y-4",
                            isMobile ? "h-[300px]" : "h-[400px]",
                        )}
                    >
                        {chatHistory.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Selamat datang di AI Assistant! 👋</h3>
                                <p className="text-gray-400 mb-6 text-sm px-4">
                                    Tanyakan sesuatu tentang aktivitas dan keamanan anak Anda
                                </p>
                            </div>
                        ) : (
                            chatHistory.map((chat, i) => (
                                <div key={i} className={cn("flex", chat.role === "user" ? "justify-end" : "justify-start")}>
                                    <div
                                        className={cn(
                                            "px-4 py-3 rounded-2xl whitespace-pre-wrap shadow-lg backdrop-blur-sm",
                                            isMobile ? "max-w-[85%]" : "max-w-[75%]",
                                            chat.role === "user"
                                                ? "bg-emerald-500/20 text-white border border-emerald-500/30 rounded-br-none"
                                                : "bg-gray-800/80 text-gray-200 border border-gray-700/50 rounded-bl-none",
                                        )}
                                    >
                                        <div className={cn("text-sm", !isMobile && "text-base")}>{chat.message}</div>
                                        {chat.message.startsWith("⏳") && (
                                            <Loader2 className="inline ml-2 w-4 h-4 animate-spin text-emerald-400" />
                                        )}
                                        <div className="text-xs opacity-60 mt-2">
                                            {new Date(chat.timestamp).toLocaleTimeString("id-ID", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                value={question}
                                onChange={handleTextareaChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Tanyakan sesuatu tentang anak Anda..."
                                className={cn(
                                    "w-full p-3 rounded-xl bg-gray-800/80 text-white border border-emerald-500/20 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 resize-none transition-all duration-200",
                                    isMobile ? "text-sm min-h-[40px]" : "text-base min-h-[48px]",
                                )}
                                rows={1}
                                disabled={loading}
                                style={{ maxHeight: isMobile ? "100px" : "120px" }}
                                maxLength={500}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-500">{question.length}/500</div>
                        </div>
                        <Button
                            onClick={() => askAI()}
                            disabled={loading || !question.trim()}
                            className={cn(
                                "shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-200 hover:scale-105",
                                isMobile ? "h-10 w-10 p-0" : "h-12 w-12 p-0",
                            )}
                        >
                            {loading ? (
                                <Loader2 className={cn("animate-spin", isMobile ? "w-4 h-4" : "w-5 h-5")} />
                            ) : (
                                <Send className={cn(isMobile ? "w-4 h-4" : "w-5 h-5")} />
                            )}
                        </Button>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2">
                        {quickActions.map((q, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => askAI(q)}
                                disabled={loading}
                                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 bg-transparent text-xs"
                            >
                                {isMobile ? q.slice(0, 20) + "..." : q}
                            </Button>
                        ))}
                    </div>

                    {/* Media Carousel */}
                    <div>
                        <h2
                            className={cn(
                                "font-semibold text-emerald-400 mb-4 flex items-center gap-2",
                                isMobile ? "text-lg" : "text-xl",
                            )}
                        >
                            <ImageIcon className={cn(isMobile ? "w-4 h-4" : "w-5 h-5")} />
                            Media Terbaru Anak
                        </h2>
                        {chatMedia.length === 0 ? (
                            <div className="text-center py-6 bg-gray-900/50 rounded-xl border border-emerald-500/20">
                                <div className="w-12 h-12 mx-auto mb-3 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                    <ImageIcon className="w-6 h-6 text-emerald-400" />
                                </div>
                                <p className="text-gray-400 text-sm">Belum ada media terkirim dari anak.</p>
                            </div>
                        ) : (
                            <ScrollArea className="w-full">
                                <div className="flex gap-4 pb-2">
                                    {chatMedia.map((msg) => (
                                        <div key={msg.id} className="flex flex-col items-center shrink-0">
                                            {renderMedia(msg)}
                                            <span className="text-xs text-gray-400 mt-2 text-center max-w-24 truncate">
                                                {new Date(msg.created_at).toLocaleDateString("id-ID")}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
