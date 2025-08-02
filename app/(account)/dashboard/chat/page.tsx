"use client";

import { useEffect, useState, useMemo } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useChatOverview } from "@/hooks/useChatOverview";
import ChatWindow from "./components/ChatWindow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function ChatPage() {
    const { supabase } = useSupabase();
    const [parentId, setParentId] = useState<string | null>(null);
    const [selectedChild, setSelectedChild] = useState<string | null>(null);
    const [collapsed, setCollapsed] = useState(false);
    const [search, setSearch] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 768);
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setParentId(data.user?.id ?? null);
        };
        fetchUser();
    }, [supabase]);

    const { list, loading } = useChatOverview(parentId || "");
    const showSidebar = !selectedChild || !isMobile;
    const selectedChildData = list.find((c) => c.child_id === selectedChild);

    const filteredList = useMemo(() => {
        return list.filter((child) =>
            child.child_name.toLowerCase().includes(search.toLowerCase())
        );
    }, [list, search]);

    return (
        <div className="flex h-[calc(100vh-2rem)] rounded-lg overflow-hidden bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative">
            {/* Sidebar */}
            {showSidebar && (
                <div
                    className={cn(
                        "border-r border-emerald-500/20 flex flex-col backdrop-blur-xl bg-black/30 transition-all duration-300 relative z-20",
                        collapsed ? "w-20" : "w-full md:w-80",
                        isMobile && "absolute left-0 top-0 bottom-0 h-full w-3/4 max-w-xs shadow-lg"
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b border-emerald-500/20 bg-black/30">
                        {!collapsed && <h2 className="font-semibold text-emerald-400">Chating</h2>}
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="icon" className="shrink-0 hover:text-emerald-400">
                                    <LayoutDashboard className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setCollapsed(!collapsed)}
                                className="shrink-0 hover:text-emerald-400"
                            >
                                {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>

                    {/* Search */}
                    {!collapsed && (
                        <div className="p-3 border-b border-emerald-500/20 bg-black/20">
                            <Input
                                placeholder="Cari anak..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="rounded-full bg-slate-900/40 border-emerald-500/20 focus-visible:ring-emerald-500/30"
                            />
                        </div>
                    )}

                    {/* List Anak */}
                    <ScrollArea className="flex-1 relative">
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Skeleton Loading */}
                                <div className="flex flex-col gap-4 w-4/5">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex items-center gap-3 animate-pulse">
                                            <div className="w-12 h-12 rounded-full bg-emerald-500/20" />
                                            {!collapsed && (
                                                <div className="flex-1">
                                                    <div className="h-4 w-2/3 mb-2 rounded bg-emerald-500/20"></div>
                                                    <div className="h-3 w-1/3 rounded bg-emerald-500/10"></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!loading && filteredList.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex flex-col items-center text-center opacity-60">
                                    <Image
                                        src="/source/chatting-33.svg"
                                        alt="No Child"
                                        width={140}
                                        height={140}
                                        className="mb-4 opacity-80"
                                    />
                                    {!collapsed && <p>{search ? "Tidak ada hasil" : "Anak Belum di Hubungkan"}</p>}
                                </div>
                            </div>
                        )}

                        {!loading && filteredList.length > 0 && (
                            <div className="flex flex-col">
                                {filteredList.map((child) => (
                                    <div
                                        key={child.child_id}
                                        onClick={() => {
                                            setSelectedChild(child.child_id);
                                            if (isMobile) setCollapsed(true); // ✅ auto collapse sidebar on mobile
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 cursor-pointer border-b border-emerald-500/10 transition-all px-4 py-3 hover:bg-emerald-500/5",
                                            selectedChild === child.child_id && "bg-emerald-500/10"
                                        )}
                                    >
                                        <Avatar className="w-14 h-14 ring-2 ring-emerald-500/30 transition-all duration-300">
                                            <AvatarImage
                                                src={
                                                    child.sex === "Laki-laki"
                                                        ? `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(child.child_name)}`
                                                        : `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(child.child_name)}`
                                                }
                                                alt={child.child_name}
                                            />
                                            <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-bold text-lg">
                                                {child.child_name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        {!collapsed && (
                                            <div className="flex-1 overflow-hidden">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{child.child_name}</span>
                                                    {child.last_time && (
                                                        <span className="text-xs opacity-60">
                                                            {new Date(child.last_time).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-sm opacity-60 truncate">{child.last_message}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            )}

            {/* Chat Panel */}
            {selectedChild ? (
                <div className="w-full h-full">
                    <ChatWindow
                        childId={selectedChild}
                        childName={selectedChildData?.child_name}
                        isOnline={selectedChildData?.isOnline}
                        avatarUrl={
                            selectedChildData?.sex === "Laki-laki"
                                ? `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(selectedChildData?.child_name ?? '-')}`
                                : `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(selectedChildData?.child_name ?? '-')}`
                        }
                    />
                </div>
            ) : (
                <div className="flex-1 hidden md:flex items-center justify-center opacity-70">
                    <div className="flex flex-col items-center gap-6">
                        <Image
                            src="/source/Chatting-bro.svg"
                            alt="Chatting Illustration"
                            width={420}
                            height={180}
                            className="opacity-90"
                        />
                        <h6 className="text-xl font-semibold text-emerald-200">
                            Pilih anak untuk memulai chat
                        </h6>
                    </div>
                </div>
            )}
        </div>
    );
}
