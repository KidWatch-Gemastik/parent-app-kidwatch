"use client";

import { useEffect, useState, useMemo } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { useChatOverview } from "@/hooks/useChatOverview";
import ChatWindow from "./components/ChatWindow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    MessageCircle,
    X,
} from "lucide-react";
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
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        const checkScreen = () => {
            const mobile = window.innerWidth < 800;
            setIsMobile(mobile);
            setShowSidebar(!mobile);
        };
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
    const selectedChildData = list.find((c) => c.child_id === selectedChild);

    const filteredList = useMemo(() => {
        return list.filter((child) =>
            child.child_name.toLowerCase().includes(search.toLowerCase())
        );
    }, [list, search]);

    const handleChildSelect = (childId: string) => {
        setSelectedChild(childId);
        if (isMobile) setShowSidebar(false);
    };

    const handleBackToSidebar = () => {
        if (isMobile) setShowSidebar(true);
        setSelectedChild(null);
    };

    return (
        <div className="flex h-[calc(100vh-2rem)] rounded-lg overflow-hidden bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative">
            {/* Overlay Mobile */}
            {isMobile && showSidebar && (
                <div
                    className="absolute inset-0 bg-black/50 z-10 md:hidden"
                    onClick={() => setShowSidebar(false)}
                />
            )}

            {/* Sidebar / Chat List */}
            <div
                className={cn(
                    "border-r border-emerald-500/20 flex flex-col backdrop-blur-xl bg-black/30 transition-all duration-300 relative z-20",
                    !isMobile && (collapsed ? "w-20" : "w-80"),
                    isMobile &&
                    (showSidebar
                        ? "w-4/5 sm:w-2/3 max-w-sm"
                        : "w-0 overflow-hidden"),
                    isMobile && "absolute left-0 top-0 bottom-0 h-full shadow-2xl"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-emerald-500/20 bg-black/30 min-h-[60px]">
                    <div className="flex items-center gap-2">
                        {!collapsed && <MessageCircle className="w-5 h-5 text-emerald-400" />}
                        {!collapsed && <h2 className="font-semibold text-emerald-400">Chat</h2>}
                    </div>
                    <div className={`flex items-center gap-1`}>
                        {isMobile && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowSidebar(false)}
                                className="h-8 w-8 hover:text-red-400"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                        <Link href="/dashboard">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0 hover:text-emerald-400 h-8 w-8"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                            </Button>
                        </Link>
                        {!isMobile && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setCollapsed(!collapsed)}
                                className="shrink-0 hover:text-emerald-400 h-8 w-8"
                            >
                                {collapsed ? (
                                    <ChevronRight className="w-4 h-4" />
                                ) : (
                                    <ChevronLeft className="w-4 h-4" />
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Search */}
                {!collapsed && (
                    <div className="p-3 border-b border-emerald-500/20 bg-black/20">
                        <Input
                            placeholder="Cari anak..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="rounded-full bg-slate-900/40 border-emerald-500/20 focus-visible:ring-emerald-500/30 h-9"
                        />
                    </div>
                )}

                {/* List Anak */}
                <ScrollArea className="flex-1 relative">
                    {loading && (
                        <div className="p-4">
                            <div className="flex flex-col gap-3">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 animate-pulse"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 shrink-0" />
                                        {!collapsed && (
                                            <div className="flex-1 min-w-0">
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
                        <div className="flex items-center justify-center h-full p-4">
                            <div className="flex flex-col items-center text-center opacity-60">
                                <Image
                                    src="/source/chatting-33.svg"
                                    alt="No Child"
                                    width={120}
                                    height={120}
                                    className="mb-4 opacity-80"
                                />
                                {!collapsed && (
                                    <p className="text-sm text-gray-400">
                                        {search ? "Tidak ada hasil" : "Anak Belum di Hubungkan"}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {!loading && filteredList.length > 0 && (
                        <div className="flex flex-col">
                            {filteredList.map((child) => (
                                <div
                                    key={child.child_id}
                                    onClick={() => handleChildSelect(child.child_id)}
                                    className={cn(
                                        "flex items-center gap-3 cursor-pointer border-b border-emerald-500/10 transition-all px-4 py-3 hover:bg-emerald-500/5 active:bg-emerald-500/10",
                                        selectedChild === child.child_id && "bg-emerald-500/10"
                                    )}
                                >
                                    <Avatar className="w-12 h-12 ring-2 ring-emerald-500/30 transition-all duration-300 shrink-0">
                                        <AvatarImage
                                            src={
                                                child.sex === "Laki-laki"
                                                    ? `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(
                                                        child.child_name
                                                    )}`
                                                    : `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(
                                                        child.child_name
                                                    )}`
                                            }
                                            alt={child.child_name}
                                        />
                                        <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-bold">
                                            {child.child_name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    {!collapsed && (
                                        <div className="flex-1 overflow-hidden min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium text-white truncate">
                                                    {child.child_name}
                                                </span>
                                                {child.last_time && (
                                                    <span className="text-xs opacity-60 text-gray-400 shrink-0 ml-2">
                                                        {new Date(child.last_time).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm opacity-60 text-gray-300 truncate block">
                                                {child.last_message || "Belum ada pesan"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Chat Panel */}
            <div
                className={cn(
                    "flex-1 flex flex-col",
                    isMobile && showSidebar && "hidden"
                )}
            >
                {selectedChild ? (
                    <ChatWindow
                        childId={selectedChild}
                        childName={selectedChildData?.child_name}
                        isOnline={selectedChildData?.isOnline}
                        avatarUrl={
                            selectedChildData?.sex === "Laki-laki"
                                ? `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(
                                    selectedChildData?.child_name ?? "-"
                                )}`
                                : `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(
                                    selectedChildData?.child_name ?? "-"
                                )}`
                        }
                        onBack={isMobile ? handleBackToSidebar : undefined}
                        isMobile={isMobile}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center opacity-70 p-4">
                        <div className="flex flex-col items-center gap-6 text-center">
                            <Image
                                src="/source/Chatting-bro.svg"
                                alt="Chatting Illustration"
                                width={isMobile ? 280 : 420}
                                height={isMobile ? 120 : 180}
                                className="opacity-90"
                            />
                            <h6
                                className={cn(
                                    "font-semibold text-emerald-200",
                                    isMobile ? "text-lg" : "text-xl"
                                )}
                            >
                                Pilih anak untuk memulai chat
                            </h6>
                            {isMobile && (
                                <Button
                                    onClick={() => setShowSidebar(true)}
                                    className="bg-emerald-600 hover:bg-emerald-500 transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Lihat Daftar Chat
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
