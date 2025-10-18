"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, User, Bot, FileText, ImageIcon, Video, Download, Clock } from "lucide-react"
import dynamic from "next/dynamic";

const DynamicMapPicker = dynamic(() => import("@/components/map-picker-ui").then(mod => mod.MapPicker), {
    ssr: false,
});

interface ChatMessage {
    id: string
    sender_role: string
    message: string
    created_at: string
    is_read: boolean
    file_url?: string
    file_type?: string
    file_name?: string
}

interface CommunicationMonitorProps {
    messages: ChatMessage[]
}

export function CommunicationMonitor({ messages }: CommunicationMonitorProps) {
    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
    }

    const getFileIcon = (fileType?: string) => {
        if (!fileType) return <FileText className="h-4 w-4" />

        if (fileType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
        if (fileType.startsWith("video/")) return <Video className="h-4 w-4" />
        return <FileText className="h-4 w-4" />
    }

    const getSenderIcon = (role: string) => {
        return role === "parent" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />
    }

    const unreadCount = messages.filter((msg) => !msg.is_read && msg.sender_role === "child").length
    const todayMessages = messages.filter(
        (msg) => new Date(msg.created_at).toDateString() === new Date().toDateString(),
    ).length

    if (messages.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center">No messages found</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {/* Message Statistics */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-8 w-8 text-blue-500" />
                            <div>
                                <p className="text-2xl font-bold">{messages.length}</p>
                                <p className="text-sm text-muted-foreground">Total Messages</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <Clock className="h-8 w-8 text-green-500" />
                            <div>
                                <p className="text-2xl font-bold">{todayMessages}</p>
                                <p className="text-sm text-muted-foreground">Today</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                                {unreadCount}
                            </Badge>
                            <div>
                                <p className="text-2xl font-bold">{unreadCount}</p>
                                <p className="text-sm text-muted-foreground">Unread</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Message History */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {messages.map((message) => {
                            // Cek apakah message.message adalah koordinat JSON
                            let location: { lat: number; lng: number } | null = null;
                            try {
                                const parsed = JSON.parse(message.message);
                                if (parsed.lat !== undefined && parsed.lng !== undefined) {
                                    location = parsed;
                                }
                            } catch (e) {
                                location = null;
                            }

                            return (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 p-3 rounded-lg ${message.sender_role === "parent"
                                        ? "bg-blue-50 dark:bg-blue-950/20 ml-8"
                                        : "bg-gray-50 dark:bg-gray-950/20 mr-8"
                                        }`}
                                >
                                    <div className="flex-shrink-0">
                                        <div
                                            className={`h-8 w-8 rounded-full flex items-center justify-center ${message.sender_role === "parent" ? "bg-blue-500" : "bg-gray-500"
                                                }`}
                                        >
                                            {getSenderIcon(message.sender_role)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium capitalize">{message.sender_role}</span>
                                            <span className="text-xs text-muted-foreground">{formatTime(message.created_at)}</span>
                                            {!message.is_read && message.sender_role === "child" && (
                                                <Badge variant="destructive" className="text-xs">
                                                    New
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Render map jika message adalah lokasi */}
                                        {location ? (
                                            <div className="h-40 w-full rounded-lg overflow-hidden mb-2">
                                                <DynamicMapPicker
                                                    initialLatitude={location.lat}
                                                    initialLongitude={location.lng}
                                                    initialRadius={50}
                                                    onSelectLocation={() => { }} // read-only
                                                />

                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-900 dark:text-gray-100 break-words">{message.message}</p>
                                        )}

                                        {/* File Attachment */}
                                        {message.file_url && (
                                            <div className="mt-2 flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded border">
                                                {getFileIcon(message.file_type)}
                                                <span className="text-sm flex-1 truncate">{message.file_name || "Attachment"}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => window.open(message.file_url, "_blank")}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <Download className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
