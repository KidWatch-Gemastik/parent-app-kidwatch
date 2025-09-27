"use client";

import { useState, useMemo } from "react";
import NotificationItem from "./NotificationItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { useNotifications } from "@/context/NotificationContext";

export default function NotificationList() {
    const { state, fetchNextPage } = useNotifications();
    const { notifications, loading, hasMore } = state;

    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(false); // false = newest first

    // Filter & sort notifications
    const filteredNotifications = useMemo(() => {
        const filtered = notifications.filter(
            (n) =>
                n.title.toLowerCase().includes(search.toLowerCase()) ||
                n.body.toLowerCase().includes(search.toLowerCase())
        );

        filtered.sort((a, b) => {
            const timeA = new Date(a.created_at).getTime();
            const timeB = new Date(b.created_at).getTime();
            return sortAsc ? timeA - timeB : timeB - timeA;
        });

        return filtered;
    }, [notifications, search, sortAsc]);

    // Group per tanggal
    const grouped: Record<string, typeof filteredNotifications> = {};
    filteredNotifications.forEach((n) => {
        const date = new Date(n.created_at).toLocaleDateString();
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(n);
    });

    return (
        <div className="space-y-4">
            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <Input
                    placeholder="Cari notifikasi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={() => setSortAsc(!sortAsc)} className="sm:ml-2">
                    Sort: {sortAsc ? "Terlama" : "Terbaru"}
                </Button>
            </div>

            {/* Notification List */}
            <div className="space-y-4">
                {Object.entries(grouped).map(([date, notifs]) => (
                    <div key={date}>
                        <h4 className="text-gray-400 text-sm mb-2">{date}</h4>
                        <div className="space-y-2">
                            {notifs.map((n) => (
                                <NotificationItem key={n.id} notification={n} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Load more */}
            {loading && <p className="text-gray-400 text-center">Memuat notifikasi...</p>}

            {hasMore && !loading && (
                <div className="flex justify-center mt-4">
                    <Button onClick={fetchNextPage}>Muat Lebih Banyak</Button>
                </div>
            )}
        </div>
    );
}
