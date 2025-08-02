"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Loader2, Send, Sparkles, ChevronDown, ChevronRight, Menu, X, ImageIcon, Phone } from "lucide-react"
import Image from "next/image"
import { useSupabase } from "@/providers/SupabaseProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
    const [isRecording, setIsRecording] = useState(false)
    const [showMediaPanel, setShowMediaPanel] = useState(false)

    const chatEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { supabase } = useSupabase()

    // Check screen size and set mobile state
    useEffect(() => {
        const checkScreen = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            if (!mobile) {
                setShowSidebar(true)
            } else {
                setShowSidebar(false)
            }
        }
        checkScreen()
        window.addEventListener("resize", checkScreen)
        return () => window.removeEventListener("resize", checkScreen)
    }, [])

    const fetchChatHistory = async () => {
        try {
            const { data: userData, error } = await supabase
                .from("ai_chat_logs")
                .select("question, answer, created_at")
                .order("created_at", { ascending: true })
                .limit(200)

            if (error) {
                console.error("Error fetch history:", error.message, error.details)
                return
            }

            const formatted: ChatEntry[] =
                userData?.flatMap((item: any) => [
                    { role: "user", message: item.question, timestamp: item.created_at },
                    { role: "ai", message: item.answer || "❌ Tidak ada jawaban", timestamp: item.created_at },
                ]) || []

            setChatHistory(formatted)
        } catch (error) {
            console.error("Error fetching chat history:", error)
        }
    }

    const fetchChatMedia = async () => {
        try {
            const { data: mediaData, error } = await supabase
                .from("chat_messages")
                .select("id, file_url, file_type, file_name, created_at")
                .not("file_url", "is", null)
                .order("created_at", { ascending: false })
                .limit(8)

            if (error) {
                console.error("Error fetch media:", error.message, error.details)
                return
            }

            setChatMedia(mediaData || [])
        } catch (error) {
            console.error("Error fetching chat media:", error)
        }
    }

    useEffect(() => {
        fetchChatHistory()
        fetchChatMedia()
    }, [])

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [chatHistory, loading])

    const askAI = async (q?: string) => {
        const ask = q || question
        if (!ask.trim()) return

        try {
            const { data: userData } = await supabase.auth.getUser()
            const user = userData.user

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

            const res = await fetch("/api/ai-assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: ask, userId: user.id }),
            })

            const response = await res.json()
            const answer = response.answer || "❌ Maaf, saya tidak bisa menjawab saat ini."

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
            console.error("Error asking AI:", err)
            setChatHistory((prev) => {
                const copy = [...prev]
                copy[copy.length - 1] = {
                    role: "ai",
                    message: "❌ Terjadi kesalahan. Silakan coba lagi.",
                    timestamp: new Date().toISOString(),
                }
                return copy
            })
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
            "rounded-lg border border-emerald-500/20 object-cover transition-all duration-300 hover:scale-105 cursor-pointer",
            isMobile ? "w-16 h-16" : "w-20 h-20",
        )

        switch (msg.file_type) {
            case "image":
                return (
                    <Image
                        src={msg.file_url || "/placeholder.svg"}
                        width={isMobile ? 64 : 80}
                        height={isMobile ? 64 : 80}
                        unoptimized
                        alt={msg.file_name || "image"}
                        className={baseClasses}
                    />
                )
            case "video":
                return <video src={msg.file_url} controls className={baseClasses} />
            case "audio":
                return (
                    <div className={cn("flex items-center justify-center bg-gray-800/50", baseClasses)}>
                        <Phone className={cn("text-emerald-400", isMobile ? "w-4 h-4" : "w-5 h-5")} />
                    </div>
                )
            case "location":
                return (
                    <div className={cn("flex items-center justify-center bg-gray-800/50", baseClasses)}>
                        <div className="text-center">
                            <div className={cn("text-emerald-400", isMobile ? "text-sm" : "text-base")}>📍</div>
                            <div className="text-xs text-gray-400">Lokasi</div>
                        </div>
                    </div>
                )
            default:
                return (
                    <div className={cn("flex items-center justify-center bg-gray-800/50", baseClasses)}>
                        <div className="text-center">
                            <div className={cn("text-emerald-400", isMobile ? "text-sm" : "text-base")}>📄</div>
                            <div className="text-xs text-gray-400">File</div>
                        </div>
                    </div>
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
        <div className="h-full w-full relative overflow-hidden">
            {/* Mobile Overlay */}
            {isMobile && (showSidebar || showMediaPanel) && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => {
                        setShowSidebar(false)
                        setShowMediaPanel(false)
                    }}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-gray-900/90 backdrop-blur-xl border-r border-emerald-500/20 transition-all duration-300 flex flex-col",
                    // Desktop behavior
                    !isMobile && "w-80 relative z-10",
                    // Mobile behavior
                    isMobile && (showSidebar ? "w-80 fixed left-0 top-0 bottom-0 shadow-2xl z-50" : "w-0 overflow-hidden"),
                )}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-3 md:p-4 border-b border-emerald-500/20 shrink-0">
                    <h2 className="text-base md:text-lg font-semibold text-emerald-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
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

                {/* Chat History */}
                <ScrollArea className="flex-1 p-3 md:p-4">
                    {Object.keys(groupedHistory).length === 0 ? (
                        <div className="text-center py-6 md:py-8">
                            <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
                            </div>
                            <p className="text-gray-400 text-sm">Belum ada percakapan.</p>
                        </div>
                    ) : (
                        <div className="space-y-2 md:space-y-3">
                            {Object.entries(groupedHistory).map(([date, chats]) => {
                                const isCollapsed = collapsed[date]
                                return (
                                    <Card key={date} className="border border-emerald-500/20 bg-gray-800/50">
                                        <CardHeader className="pb-2 p-3">
                                            <button
                                                onClick={() => setCollapsed((prev) => ({ ...prev, [date]: !isCollapsed }))}
                                                className="flex items-center justify-between w-full text-left hover:text-emerald-400 transition-colors"
                                            >
                                                <span className="font-medium text-white text-sm">{date}</span>
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                                                        {chats.length}
                                                    </Badge>
                                                    {isCollapsed ? (
                                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>
                                            </button>
                                        </CardHeader>
                                        {!isCollapsed && (
                                            <CardContent className="pt-0 p-3">
                                                <div className="space-y-2">
                                                    {chats.map((c, i) => (
                                                        <div
                                                            key={i}
                                                            className="text-xs p-2 rounded-md hover:bg-emerald-500/10 text-gray-300 cursor-pointer transition-colors border border-transparent hover:border-emerald-500/20"
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
                                                                    {c.message.slice(0, isMobile ? 50 : 60)}
                                                                    {c.message.length > (isMobile ? 50 : 60) && "..."}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>
            </aside>

            {/* Main Content */}
            <div className={cn("flex-1 flex flex-col min-w-0 relative", isMobile && showSidebar && "pointer-events-none")}>
                {/* Header */}
                <header className="border-b border-emerald-500/20 bg-gray-900/90 backdrop-blur-xl p-3 md:p-4 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3">
                            {isMobile && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowSidebar(true)}
                                    className="text-emerald-400 hover:bg-emerald-500/10 h-8 w-8"
                                >
                                    <Menu className="w-4 h-4" />
                                </Button>
                            )}
                            <div>
                                <h1 className="text-base md:text-xl font-bold text-emerald-400 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-emerald-400" />
                                    AI Assistant
                                </h1>
                                <p className="text-xs md:text-sm text-gray-400">Monitoring Anak Cerdas</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 md:mr-2 animate-pulse"></div>
                                Online
                            </Badge>
                            {chatMedia.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowMediaPanel(!showMediaPanel)}
                                    className="text-emerald-400 hover:bg-emerald-500/10 h-8 w-8"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Messages */}
                    <ScrollArea className="flex-1 p-3 md:p-4">
                        <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
                            {chatHistory.length === 0 ? (
                                <div className="text-center py-8 md:py-12">
                                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                        <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-emerald-400 animate-pulse" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                                        Selamat datang di AI Assistant! 👋
                                    </h3>
                                    <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base px-4">
                                        Tanyakan sesuatu tentang aktivitas dan keamanan anak Anda
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 max-w-2xl mx-auto px-4">
                                        {quickActions.map((action, index) => (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                onClick={() => askAI(action)}
                                                disabled={loading}
                                                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 bg-transparent text-left justify-start h-auto p-3 md:p-4"
                                            >
                                                <span className="text-emerald-400 mr-2 md:mr-3">💡</span>
                                                <span className="text-xs md:text-sm">{action}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                chatHistory.map((chat, i) => (
                                    <div key={i} className={cn("flex", chat.role === "user" ? "justify-end" : "justify-start")}>
                                        <div
                                            className={cn(
                                                "px-3 py-2 md:px-4 md:py-3 rounded-2xl whitespace-pre-wrap shadow-lg backdrop-blur-sm",
                                                "max-w-[90%] md:max-w-[75%]",
                                                chat.role === "user"
                                                    ? "bg-emerald-500/20 text-white border border-emerald-500/30 rounded-br-none"
                                                    : "bg-gray-800/80 text-gray-200 border border-gray-700/50 rounded-bl-none",
                                            )}
                                        >
                                            <div className="text-sm md:text-base">{chat.message}</div>
                                            {chat.message.startsWith("⏳") && (
                                                <Loader2 className="inline ml-2 w-4 h-4 animate-spin text-emerald-400" />
                                            )}
                                            <div className="text-xs opacity-60 mt-1 md:mt-2">
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
                    </ScrollArea>

                    {/* Quick Actions (when chat exists) */}
                    {chatHistory.length > 0 && (
                        <div className="border-t border-emerald-500/20 bg-gray-900/50 p-3 md:p-4 shrink-0">
                            <div className="max-w-4xl mx-auto">
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
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="border-t border-emerald-500/20 bg-gray-900/90 backdrop-blur-xl p-3 md:p-4 shrink-0">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex gap-2 md:gap-3 items-end">
                                {/* Text Input */}
                                <div className="flex-1 relative">
                                    <textarea
                                        ref={textareaRef}
                                        value={question}
                                        onChange={handleTextareaChange}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Tanyakan sesuatu tentang anak Anda..."
                                        className={cn(
                                            "w-full p-3 pr-12 md:pr-16 rounded-xl bg-gray-800/80 text-white border border-emerald-500/20 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 resize-none transition-all duration-200",
                                            "text-sm md:text-base min-h-[40px] md:min-h-[48px]",
                                        )}
                                        rows={1}
                                        disabled={loading}
                                        style={{ maxHeight: isMobile ? "100px" : "120px" }}
                                        maxLength={500}
                                    />
                                    {/* Character count */}
                                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">{question.length}/500</div>
                                </div>

                                {/* Send Button */}
                                <Button
                                    onClick={() => askAI()}
                                    disabled={loading || !question.trim()}
                                    className={cn(
                                        "shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-200 hover:scale-105",
                                        "h-10 w-10 md:h-12 md:w-12 p-0",
                                    )}
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Panel - Slide from right */}
            <div
                className={cn(
                    "border-l border-emerald-500/20 bg-gray-900/90 backdrop-blur-xl transition-all duration-300",
                    isMobile
                        ? showMediaPanel
                            ? "fixed right-0 top-0 bottom-0 w-72 shadow-2xl z-50"
                            : "hidden"
                        : showMediaPanel
                            ? "w-80 relative z-10"
                            : "hidden",
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-3 md:p-4 border-b border-emerald-500/20">
                        <h2 className="text-base md:text-lg font-semibold text-emerald-400 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                            Media Terbaru
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowMediaPanel(false)}
                            className="text-gray-400 hover:text-white h-8 w-8"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 p-3 md:p-4">
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            {chatMedia.map((msg) => (
                                <div key={msg.id} className="flex flex-col items-center">
                                    {renderMedia(msg)}
                                    <span className="text-xs text-gray-400 mt-2 text-center truncate w-full">
                                        {new Date(msg.created_at).toLocaleDateString("id-ID")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}
