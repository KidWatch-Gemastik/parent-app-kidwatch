"use client";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import NotificationSheet from "./NotificationSheet";

interface NotificationItemProps {
    notification: any;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
    const [open, setOpen] = useState(false);
    const { markAsRead } = useNotifications();

    const handleOpen = () => {
        setOpen(true);
        if (!notification.is_read) markAsRead(notification.id);
    };

    return (
        <>
            <div
                className="p-4 rounded-lg border border-gray-700 flex justify-between items-start cursor-pointer hover:bg-gray-800 transition"
                onClick={handleOpen}
            >
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{notification.title}</h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {notification.body}
                    </p>
                    <Badge
                        variant={notification.is_read ? "secondary" : "destructive"}
                        className="mt-1"
                    >
                        {notification.is_read ? "Dibaca" : "Baru"}
                    </Badge>
                </div>
                <span className="text-gray-500 text-xs ml-2 flex-shrink-0">
                    {new Date(notification.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>

            <NotificationSheet open={open} setOpen={setOpen} notification={notification} />
        </>
    );
}
