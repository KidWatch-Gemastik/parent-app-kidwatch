"use client";

import { useState, useEffect, useRef } from "react";
import {
    Loader2,
    Send,
    Sparkles,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface ChatEntry {
    role: "user" | "ai";
    message: string;
    timestamp: string;
}

interface ChatMedia {
    id: string;
    file_url: string;
    file_type: "image" | "video" | "audio" | "location";
    file_name?: string;
    created_at: string;
}

export default function AIAssistant() {
    const supabase = createClientComponentClient();

    const [question, setQuestion] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
    const [chatMedia, setChatMedia] = useState<ChatMedia[]>([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [collapsed, setCollapsed] = useState<{ [date: string]: boolean }>({});

    const fetchChatHistory = async () => {
        const { data, error } = await supabase
            .from("ai_chat_logs")
            .select("question, answer, created_at")
            .order("created_at", { ascending: true })
            .limit(200);

        if (error) {
            console.error("Error fetch history:", error.message, error.details);
            return;
        }

        const formatted: ChatEntry[] =
            data?.flatMap((item: any) => [
                {
                    role: "user",
                    message: item.question,
                    timestamp: item.created_at,
                },
                {
                    role: "ai",
                    message: item.answer || "❌ Tidak ada jawaban",
                    timestamp: item.created_at,
                },
            ]) || [];

        setChatHistory(formatted);
    };

    const fetchChatMedia = async () => {
        const { data, error } = await supabase
            .from("chat_messages")
            .select("id, file_url, file_type, file_name, created_at")
            .not("file_url", "is", null)
            .order("created_at", { ascending: false })
            .limit(8);

        if (error) {
            console.error("Error fetch media:", error.message, error.details);
            return;
        }

        setChatMedia(data || []);
    };

    useEffect(() => {
        fetchChatHistory();
        fetchChatMedia();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, loading]);

    const askAI = async (q?: string) => {
        const ask = q || question;
        if (!ask.trim()) return;

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            console.error("User belum login");
            return;
        }

        const now = new Date().toISOString();
        const userChat: ChatEntry = { role: "user", message: ask, timestamp: now };
        const placeholder: ChatEntry = {
            role: "ai",
            message: "⏳ KiddyGoo sedang menganalisa...",
            timestamp: now,
        };

        setChatHistory((prev) => [...prev, userChat, placeholder]);
        setQuestion("");
        setLoading(true);

        try {
            const res = await fetch("/api/ai-assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: ask,
                    userId: user.id, // ✅ kirim userId
                }),
            });

            const data = await res.json();
            const answer = data.answer || "❌ Maaf, saya tidak bisa menjawab saat ini.";

            setChatHistory((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = {
                    role: "ai",
                    message: answer,
                    timestamp: now,
                };
                return copy;
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const quickActions = [
        "Bagaimana aktivitas anak hari ini?",
        "Ada panggilan mencurigakan?",
        "Tunjukkan lokasi terakhir anak",
        "Analisis media terbaru",
    ];

    const groupedHistory = chatHistory.reduce(
        (acc: Record<string, ChatEntry[]>, item) => {
            const date = new Date(item.timestamp).toLocaleDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(item);
            return acc;
        },
        {}
    );

    const renderMedia = (msg: ChatMedia) => {
        switch (msg.file_type) {
            case "image":
                return (
                    <Image
                        src={msg.file_url}
                        width={100}
                        height={100}
                        unoptimized
                        alt={msg.file_name || "image"}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-700"
                    />
                );
            case "video":
                return (
                    <video
                        src={msg.file_url}
                        controls
                        className="w-32 h-32 object-cover rounded-lg border border-gray-700"
                    />
                );
            case "audio":
                return <audio src={msg.file_url} controls className="w-32" />;
            case "location":
                return (
                    <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(
                            msg.file_name || ""
                        )}&z=15&output=embed`}
                        className="w-32 h-32 rounded-lg border border-gray-700"
                        loading="lazy"
                    />
                );
            default:
                return (
                    <a
                        href={msg.file_url}
                        target="_blank"
                        className="text-emerald-400 underline text-sm"
                    >
                        {msg.file_name || "Lihat File"}
                    </a>
                );
        }
    };

    return (
        <div className="flex max-w-7xl mx-auto gap-4">
            {/* Sidebar History */}
            <aside className="w-64 bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-y-auto h-[600px]">
                <h2 className="text-lg font-semibold text-emerald-400 mb-4">
                    Riwayat Chat AI
                </h2>
                {Object.keys(groupedHistory).length === 0 ? (
                    <p className="text-gray-500 text-sm">Belum ada percakapan.</p>
                ) : (
                    Object.entries(groupedHistory).map(([date, chats]) => {
                        const isCollapsed = collapsed[date];
                        return (
                            <div key={date} className="mb-2 border-b border-gray-800 pb-2">
                                <button
                                    onClick={() =>
                                        setCollapsed((prev) => ({ ...prev, [date]: !isCollapsed }))
                                    }
                                    className="flex items-center justify-between w-full text-left text-gray-300 hover:text-emerald-400 transition"
                                >
                                    <span className="font-medium">{date}</span>
                                    {isCollapsed ? (
                                        <ChevronRight size={16} />
                                    ) : (
                                        <ChevronDown size={16} />
                                    )}
                                </button>
                                {!isCollapsed && (
                                    <div className="mt-2 space-y-1">
                                        {chats.map((c, i) => (
                                            <div
                                                key={i}
                                                className="text-xs px-2 py-1 rounded-md hover:bg-gray-800 text-gray-400 truncate cursor-pointer"
                                                title={c.role === "user" ? `Anda: ${c.message}` : `AI: ${c.message}`}
                                            >
                                                {c.role === "user" ? "🧑 " : "🤖 "}
                                                {c.message.slice(0, 30)}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </aside>

            {/* Main Chat */}
            <div className="flex-1 space-y-8">
                <h1 className="text-2xl font-bold text-emerald-400 mb-4 text-center flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6 text-emerald-400" /> AI Assistant Monitoring Anak
                </h1>

                {/* Chat Box */}
                <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 h-[500px] overflow-y-auto space-y-4">
                    {chatHistory.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">
                            👋 Halo! Tanyakan sesuatu tentang aktivitas anak Anda.
                        </p>
                    ) : (
                        chatHistory.map((chat, i) => (
                            <div
                                key={i}
                                className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`px-4 py-2 rounded-lg max-w-[75%] whitespace-pre-wrap ${chat.role === "user"
                                        ? "bg-emerald-600 text-white"
                                        : "bg-gray-800 text-gray-200"
                                        }`}
                                >
                                    {chat.message}
                                    {chat.message.startsWith("⏳") && (
                                        <Loader2 className="inline ml-2 w-4 h-4 animate-spin text-emerald-400" />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Tanyakan sesuatu..."
                        className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-emerald-500"
                        rows={2}
                        disabled={loading}
                    />
                    <button
                        onClick={() => askAI()}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg flex items-center justify-center transition-colors ${loading
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white"
                            }`}
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                    {quickActions.map((q) => (
                        <button
                            key={q}
                            onClick={() => askAI(q)}
                            disabled={loading}
                            className={`px-3 py-1 rounded-lg text-sm transition ${loading
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-gray-800 hover:bg-gray-700 text-gray-200"
                                }`}
                        >
                            {q}
                        </button>
                    ))}
                </div>

                {/* Media Carousel */}
                <div>
                    <h2 className="text-xl font-semibold text-emerald-400 mb-4">Media Terbaru Anak</h2>
                    {chatMedia.length === 0 ? (
                        <p className="text-gray-500">Belum ada media terkirim dari anak.</p>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {chatMedia.map((msg) => (
                                <div key={msg.id} className="flex flex-col items-center">
                                    {renderMedia(msg)}
                                    <span className="text-xs text-gray-500 mt-1">
                                        {new Date(msg.created_at).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
