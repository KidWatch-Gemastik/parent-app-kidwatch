"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRealtimeNotifications, Notification } from "@/hooks/useRealtimeNotifications";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "../ui/button";

const MAX_NOTIFICATIONS = 10;
const MAX_TEXT_LENGTH = 50; // batas karakter sebelum "Read more"

export function NotificationBell() {
    const { notifications, loading } = useRealtimeNotifications();
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    const handleClickNotification = async (notif: Notification) => {
        if (notif.is_read) return;

        try {
            await supabase.from("notifications").update({ is_read: true }).eq("id", notif.id);
            notif.is_read = true;
            toast.success("Berhasil tandai notifikasi terbaca");
        } catch (err) {
            toast.error("Gagal tandai notifikasi terbaca");
            console.error(err);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const truncateText = (text: string) => {
        if (text.length <= MAX_TEXT_LENGTH) return text;
        return text.slice(0, MAX_TEXT_LENGTH) + "...";
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="relative">
                <Bell className="w-6 h-6 text-emerald-400 cursor-pointer" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 text-xs text-white bg-red-500 rounded-full px-1">
                        {unreadCount}
                    </span>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-80 bg-gray-900 border border-emerald-500/20 p-2">
                <DropdownMenuLabel className="text-gray-300">Notifikasi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {loading ? (
                    <DropdownMenuItem className="text-gray-400 cursor-default">
                        Memuat...
                    </DropdownMenuItem>
                ) : notifications.length === 0 ? (
                    <DropdownMenuItem className="text-gray-400 cursor-default">
                        Belum ada notifikasi
                    </DropdownMenuItem>
                ) : (
                    notifications.slice(0, MAX_NOTIFICATIONS).map((notif, index) => {
                        const isExpanded = expandedIds.includes(notif.id);
                        const displayText = isExpanded
                            ? notif.body || "Tidak ada pesan"
                            : truncateText(notif.body || "Tidak ada pesan");

                        return (
                            <DropdownMenuItem
                                key={`${notif.id}-${index}`}
                                className={`flex flex-col gap-1 cursor-pointer hover:bg-emerald-500/10 ${notif.is_read ? "opacity-50" : "font-semibold"}`}
                                onClick={() => handleClickNotification(notif)}
                            >
                                <span className="font-medium text-white">
                                    {notif.title || "Tidak ada judul"}
                                </span>
                                <span className="text-gray-400 text-sm">
                                    {displayText}{" "}
                                    {notif.body && notif.body.length > MAX_TEXT_LENGTH && (
                                        <button
                                            className="text-emerald-400 underline text-xs ml-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleExpand(notif.id);
                                            }}
                                        >
                                            {isExpanded ? "Show less" : "Read more"}
                                        </button>
                                    )}
                                </span>
                            </DropdownMenuItem>
                        );
                    })
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
