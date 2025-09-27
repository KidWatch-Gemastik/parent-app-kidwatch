"use client";

import DashboardSidebar from "@/components/layouts/dashboardSidebar";
import DashboardHeader from "@/components/layouts/DashboardHeader";
import { useSupabase } from "@/providers/SupabaseProvider";
import { NotificationProvider } from "@/context/NotificationContext";
import NotificationList from "./components/NotificationList";

export default function NotificationsPage() {
    const { session } = useSupabase();

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                Memuat notifikasi, mohon tunggu...
            </div>
        );
    }

    const parentId = session.user.id;

    return (
        <NotificationProvider parentId={parentId}>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="relative z-10 flex">
                    <DashboardSidebar />

                    <main className="flex-1 p-6 space-y-8">
                        <DashboardHeader
                            title="Notifikasi"
                            description="Pantau aktivitas digital dan lokasi anak secara real-time."
                        />
                        <NotificationList />
                    </main>

                </div>
            </div>
        </NotificationProvider >
    );
}
