"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Loader2,
    PhoneIncoming,
    PhoneOutgoing,
    PhoneMissed,
    PhoneOff,
} from "lucide-react"
import DashboardSidebar from "@/components/layouts/dashboardSidebar"
import DashboardHeader from "@/components/layouts/DashboardHeader"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type CallLog = {
    id: string
    child_id: string
    phone_number: string
    type: "incoming" | "outgoing" | "missed"
    duration: number
    timestamp: string
    children?: { name: string, sex: 'Laki-laki' | 'Perempuan' }
}

export default function CallLogsPage() {
    const [logs, setLogs] = useState<CallLog[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedLog, setSelectedLog] = useState<CallLog | null>(null)

    const fetchLogs = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from("call_logs")
            .select("*, children(name, sex)")
            .order("timestamp", { ascending: false })

        if (!error && data) setLogs(data as unknown as CallLog[])
        setLoading(false)
    }

    useEffect(() => {
        fetchLogs()

        const channel = supabase
            .channel("call_logs_changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "call_logs" },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        setLogs((prev) => [payload.new as CallLog, ...prev])
                    } else if (payload.eventType === "DELETE") {
                        setLogs((prev) => prev.filter((log) => log.id !== payload.old.id))
                    } else if (payload.eventType === "UPDATE") {
                        setLogs((prev) =>
                            prev.map((log) =>
                                log.id === payload.new.id ? (payload.new as CallLog) : log
                            )
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "incoming":
                return <PhoneIncoming className="text-green-400 w-5 h-5" />
            case "outgoing":
                return <PhoneOutgoing className="text-blue-400 w-5 h-5" />
            case "missed":
                return <PhoneMissed className="text-red-400 w-5 h-5" />
            default:
                return <PhoneOff className="text-gray-400 w-5 h-5" />
        }
    }

    const formatDuration = (sec: number) => {
        if (!sec) return "0s"
        const m = Math.floor(sec / 60)
        const s = sec % 60
        return m > 0 ? `${m}m ${s}s` : `${s}s`
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

            <div className="relative z-10 flex">
                <DashboardSidebar />
                <main className="flex-1 p-6 space-y-8">
                    <DashboardHeader title="Log Panggilan" />

                    <section className="p-6 max-w-5xl mx-auto">
                        <h1 className="text-2xl font-bold text-emerald-400 mb-6">
                            Riwayat Panggilan
                        </h1>

                        {loading ? (
                            <div className="flex items-center justify-center py-20 text-gray-400">
                                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat log
                                panggilan...
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-gray-400 space-y-4">
                                <PhoneOff className="w-14 h-14 text-gray-600" />
                                <p className="text-lg font-medium">Belum ada riwayat panggilan</p>
                                <p className="text-sm text-gray-500 max-w-sm text-center">
                                    Semua riwayat panggilan anak Anda akan tampil di sini setelah
                                    aplikasi mulai merekam log panggilan.
                                </p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-6">
                                {logs.map((log) => (
                                    <Card
                                        key={log.id}
                                        onClick={() => setSelectedLog(log)}
                                        className="cursor-pointer bg-gray-900/70 border-gray-800 hover:bg-gray-900/90 transition-colors duration-300 rounded-xl shadow-lg"
                                    >
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <CardTitle className="flex items-center gap-3 text-white text-lg">
                                                {getTypeIcon(log.type)}
                                                <span className="truncate">{log.phone_number}</span>
                                            </CardTitle>
                                            <Badge
                                                variant="outline"
                                                className={`${log.type === "incoming"
                                                    ? "border-green-400 text-green-400"
                                                    : log.type === "outgoing"
                                                        ? "border-blue-400 text-blue-400"
                                                        : "border-red-400 text-red-400"
                                                    }`}
                                            >
                                                {log.type}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent className="text-gray-400 text-sm space-y-2">
                                            <div className="flex justify-between">
                                                <span>Anak:</span>
                                                <span className="text-white">
                                                    {log.children?.name || "Tidak diketahui"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Durasi:</span>
                                                <span>{formatDuration(log.duration)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Waktu:</span>
                                                <span>{new Date(log.timestamp).toLocaleString()}</span>
                                            </div>

                                            {/* Tombol Panggil Anak */}
                                            <a
                                                href={`tel:${log.phone_number}`}
                                                className="inline-flex items-center gap-2 px-3 py-2 mt-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <PhoneOutgoing className="w-4 h-4" /> Panggil Anak
                                            </a>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Sheet Detail Log */}
                    <Sheet
                        open={!!selectedLog}
                        onOpenChange={(open) => !open && setSelectedLog(null)}
                    >
                        <SheetContent side="right" className="w-[400px] sm:w-[500px]">
                            <SheetHeader>
                                <SheetTitle className="text-emerald-400">Detail Panggilan</SheetTitle>
                                <SheetDescription className="text-gray-400">
                                    {selectedLog?.phone_number || "-"}
                                </SheetDescription>
                            </SheetHeader>

                            {selectedLog && (
                                <div className="mt-6 space-y-4 text-gray-300">
                                    <Avatar className="w-16 h-16 ring-2 ring-emerald-500/30 group-hover:ring-emerald-500/50 transition-all duration-300">
                                        <AvatarImage
                                            src={
                                                selectedLog.children?.sex === "Laki-laki"
                                                    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedLog.children?.name ?? '-')}`
                                                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedLog.children?.name ?? '-')}`
                                            }
                                            alt={selectedLog.children?.name}
                                        />
                                        <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-bold text-lg">
                                            {selectedLog.children?.name?.[0] || "-"}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Tipe Panggilan:</span>
                                        <span className="capitalize">{selectedLog.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Anak:</span>
                                        <span>{selectedLog.children?.name || "Tidak diketahui"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Durasi:</span>
                                        <span>{formatDuration(selectedLog.duration)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Waktu:</span>
                                        <span>{new Date(selectedLog.timestamp).toLocaleString()}</span>
                                    </div>

                                    <a
                                        href={`tel:${selectedLog.phone_number}`}
                                        className="inline-flex items-center justify-center w-full px-4 py-2 mt-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                                    >
                                        <PhoneOutgoing className="w-5 h-5 mr-2" /> Panggil Anak
                                    </a>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </main>
            </div>
        </div>
    )
}
