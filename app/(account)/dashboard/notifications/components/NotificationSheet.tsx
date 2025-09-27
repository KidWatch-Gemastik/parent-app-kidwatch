"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNotifications } from "@/context/NotificationContext";
import { useEffect } from "react";

interface NotificationSheetProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    notification: any;
}

export default function NotificationSheet({ open, setOpen, notification }: NotificationSheetProps) {
    const { markAsRead } = useNotifications();

    useEffect(() => {
        if (open && !notification.is_read) markAsRead(notification.id);
    }, [open]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent
                className="fixed top-0 right-0 h-full z-[999] shadow-xl bg-slate-900"
            >
                <SheetHeader>
                    <SheetTitle>{notification.title}</SheetTitle>
                    <p className="text-gray-400 mt-2">{notification.body}</p>
                    <p className="text-gray-500 mt-4 text-sm">
                        {new Date(notification.created_at).toLocaleString()}
                    </p>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
