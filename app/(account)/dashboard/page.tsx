"use client"

import { useState, useEffect } from "react"
import { useRouter, redirect } from "next/navigation"
import {
    MapPin,
    PhoneCall,
    ShieldCheck,
    CalendarDays,
    BarChart3,
    Bell,
    Clock,
    Smartphone,
    AlertTriangle,
    CheckCircle,
    Eye,
    Sparkles,
    Plus,
    Shield,
} from "lucide-react"
import DashboardSidebar from "@/components/layouts/dashboardSidebar"
import DashboardHeader from "@/components/layouts/DashboardHeader"
import DashboardCard from "@/components/layouts/DashboardCard" // Import the new DashboardCard component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
// import { useSupabaseAuthSession } from "@/hooks/useSupabaseAuthSession"
import { useChildren } from "@/hooks/useChildren"
import type { Child } from "@/types"
import { cn } from "@/lib/utils"
import { getAgeFromDate } from "@/lib/function"
import { useSupabase } from "@/providers/SupabaseProvider"

export default function DashboardPage() {
    const router = useRouter();
    const { session } = useSupabase();
    const user = session?.user ?? null;

    const { children: fetchedChildren, isLoading: loadingChildren } = useChildren(user?.id || null);
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);

    // Redirect ke login jika tidak ada user
    useEffect(() => {
        if (!user && !loadingChildren) {
            router.replace("/login");
        }
    }, [user, loadingChildren, router]);

    // Set default child setelah data anak di-load
    useEffect(() => {
        if (!loadingChildren && fetchedChildren.length > 0 && !selectedChild) {
            setSelectedChild(fetchedChildren[0]);
        }
    }, [fetchedChildren, loadingChildren, selectedChild]);

    // Loading UI
    if (!user || loadingChildren) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-emerald-400 font-medium">Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    const currentChild = selectedChild || fetchedChildren[0];

    // Placeholder data for recent activities and alerts
    const recentActivities = [
        {
            time: "2:30 PM",
            activity: "Opened YouTube",
            duration: "15 minutes",
            status: "allowed",
        },
        {
            time: "1:45 PM",
            activity: "Tried to access Instagram",
            duration: "0 minutes",
            status: "blocked",
        },
        {
            time: "12:30 PM",
            activity: "Used Educational App",
            duration: "30 minutes",
            status: "allowed",
        },
        {
            time: "11:15 AM",
            activity: "Location: Arrived at School",
            duration: "-",
            status: "safe",
        },
    ]

    const alerts = [
        {
            type: "warning",
            message: `${currentChild?.name || "Anak"} exceeded screen time limit yesterday`,
            time: "1 hour ago",
        },
        {
            type: "info",
            message: `${currentChild?.name || "Anak"} arrived safely at school`,
            time: "3 hours ago",
        },
    ]

    const featureCards = [
        {
            title: "Location Tracking",
            description: "Monitor your child's real-time location and history.",
            action: "View Map",
            icon: <MapPin className="h-4 w-4 text-white" />,
            href: "/location",
        },
        {
            title: "Call & Message Logs",
            description: "View calls and messages sent and received from the watch.",
            action: "View Logs",
            icon: <PhoneCall className="h-4 w-4 text-white" />,
            href: "/logs",
        },
        {
            title: "Safe Zones",
            description: "Define and manage safe zones with geofencing.",
            action: "Manage Zones",
            icon: <ShieldCheck className="h-4 w-4 text-white" />,
            href: "/safe-zones",
        },
        {
            title: "Daily Schedule",
            description: "Manage your child's daily learning and activity schedule.",
            action: "View Schedule",
            icon: <CalendarDays className="h-4 w-4 text-white" />,
            href: "/schedule",
        },
        {
            title: "Usage Stats",
            description: "Check screen time, battery level, and more.",
            action: "View Report",
            icon: <BarChart3 className="h-4 w-4 text-white" />,
            href: "/stats",
        },
        {
            title: "Notifications",
            description: "Receive alerts for leaving zones or low battery.",
            action: "See Alerts",
            icon: <Bell className="h-4 w-4 text-white" />,
            href: "/notifications",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-mint-900/20 via-transparent to-transparent"></div>

                {/* Floating Orbs */}
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-mint-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            <div className="relative z-10 flex">
                <DashboardSidebar />
                <main className="flex-1 p-6 space-y-8">
                    <DashboardHeader title="Dashboard" description="Ringkasan aktivitas dan kontrol anak Anda" />

                    {/* Enhanced Child Selector */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                            Pilih Anak
                        </h2>
                        {fetchedChildren.length > 0 ? (
                            <div className="flex space-x-4 overflow-x-auto pb-2">
                                {fetchedChildren.map((child) => (
                                    <Card
                                        key={child.id}
                                        className={cn(
                                            "flex-shrink-0 cursor-pointer transition-all duration-300 border-2 bg-gray-900/80 backdrop-blur-xl hover:scale-105",
                                            selectedChild?.id === child.id
                                                ? "ring-2 ring-emerald-500 bg-emerald-950/50 border-emerald-500/50"
                                                : "border-gray-700/50 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10",
                                        )}
                                        onClick={() => setSelectedChild(child)}
                                    >
                                        <CardContent className="p-5">
                                            <div className="flex items-center space-x-4">
                                                <Avatar className="ring-2 ring-emerald-500/30">
                                                    <AvatarImage
                                                        src={child.avatar || `/placeholder.svg?height=40&width=40&text=${child.name[0]}`}
                                                    />
                                                    <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-bold">
                                                        {child.name[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-bold text-white">{child.name}</h3>
                                                    <p className="text-sm text-gray-400">Usia {getAgeFromDate(child.date_of_birth)} tahun</p>
                                                    <div className="flex items-center space-x-2 mt-2">
                                                        <div
                                                            className={cn(
                                                                "h-2 w-2 rounded-full",
                                                                child.status === "online" ? "bg-emerald-500" : "bg-gray-500",
                                                            )}
                                                        />
                                                        <span className="text-xs text-gray-400 capitalize">{child.status || "offline"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400">Tidak ada anak terdaftar. Silakan tambahkan anak terlebih dahulu.</p>
                                <Button
                                    onClick={() => router.replace("/children")}
                                    className="mt-4 bg-gradient-to-r from-emerald-500 to-mint-500 text-white hover:from-emerald-600 hover:to-mint-600 rounded-xl shadow-lg hover:shadow-emerald-500/25 px-6 py-3 font-semibold"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Tambah Anak
                                </Button>
                            </div>
                        )}
                    </div>

                    {currentChild && (
                        <>
                            {/* Enhanced Alerts */}
                            {alerts.length > 0 && (
                                <div className="mb-8">
                                    <div className="space-y-3">
                                        {alerts.map((alert, index) => (
                                            <Card
                                                key={index}
                                                className="border-l-4 border-l-amber-500 bg-amber-950/30 backdrop-blur-xl border-amber-500/50 shadow-lg"
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <AlertTriangle className="h-5 w-5 text-amber-400" />
                                                            <span className="text-sm text-amber-100 font-medium">{alert.message}</span>
                                                        </div>
                                                        <span className="text-xs text-amber-300">{alert.time}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <Card className="bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 shadow-xl">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                        <CardTitle className="text-sm font-semibold text-gray-300">Screen Time Today</CardTitle>
                                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-lg flex items-center justify-center">
                                            <Clock className="h-4 w-4 text-white" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-white mb-2">{"2h 15m"}</div> {/* Placeholder */}
                                        <div className="mt-3">
                                            <Progress value={56} className="h-3 bg-gray-800" /> {/* Placeholder */}
                                            <p className="text-xs text-gray-400 mt-2">of {"4h"} limit</p> {/* Placeholder */}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 shadow-xl">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                        <CardTitle className="text-sm font-semibold text-gray-300">Current Location</CardTitle>
                                        <div className="w-8 h-8 bg-gradient-to-r from-mint-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <MapPin className="h-4 w-4 text-white" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-white mb-2">
                                            {currentChild.location || "Tidak diketahui"}
                                        </div>
                                        <div className="flex items-center mt-3">
                                            <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                                            <p className="text-xs text-gray-400">{currentChild.safeZoneStatus || "Zona aman"}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 shadow-xl">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                        <CardTitle className="text-sm font-semibold text-gray-300">Apps Blocked</CardTitle>
                                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-mint-400 rounded-lg flex items-center justify-center">
                                            <Shield className="h-4 w-4 text-white" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-white mb-2">3</div> {/* Placeholder */}
                                        <p className="text-xs text-gray-400">Today</p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 shadow-xl">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                        <CardTitle className="text-sm font-semibold text-gray-300">Device Status</CardTitle>
                                        <div className="w-8 h-8 bg-gradient-to-r from-mint-400 to-emerald-600 rounded-lg flex items-center justify-center">
                                            <Smartphone className="h-4 w-4 text-white" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-white mb-2">{currentChild.status || "Offline"}</div>
                                        <p className="text-xs text-gray-400">Last seen: {currentChild.lastSeen || "5 min ago"}</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Enhanced Main Content */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Enhanced Activity Feed */}
                                <div className="lg:col-span-2">
                                    <Card className="bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 shadow-xl">
                                        <CardHeader>
                                            <CardTitle className="flex items-center space-x-3 text-white">
                                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-lg flex items-center justify-center">
                                                    <Eye className="h-4 w-4 text-white" />
                                                </div>
                                                <span>Recent Activity</span>
                                            </CardTitle>
                                            <CardDescription className="text-gray-400">
                                                {currentChild.name}&apos;s device activity today
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {recentActivities.map((activity, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-4 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300"
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <div className="text-sm font-bold text-emerald-400">{activity.time}</div>
                                                            <div className="text-sm text-gray-300">{activity.activity}</div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <span className="text-xs text-gray-400">{activity.duration}</span>
                                                            <Badge
                                                                variant={
                                                                    activity.status === "allowed"
                                                                        ? "default"
                                                                        : activity.status === "blocked"
                                                                            ? "destructive"
                                                                            : "secondary"
                                                                }
                                                                className={cn(
                                                                    activity.status === "allowed" &&
                                                                    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                                                                    activity.status === "safe" && "bg-mint-500/20 text-mint-400 border-mint-500/30",
                                                                )}
                                                            >
                                                                {activity.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Enhanced Quick Controls */}
                                <div className="space-y-6">
                                    <Card className="bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 shadow-xl">
                                        <CardHeader>
                                            <CardTitle className="text-white">Quick Controls</CardTitle>
                                            <CardDescription className="text-gray-400">Manage {currentChild.name}&apos;s device</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <Button
                                                className="w-full bg-gray-800/60 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-300 rounded-xl"
                                                variant="outline"
                                            >
                                                <Shield className="h-4 w-4 mr-2" />
                                                Pause Internet
                                            </Button>
                                            <Button
                                                className="w-full bg-gray-800/60 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-300 rounded-xl"
                                                variant="outline"
                                            >
                                                <MapPin className="h-4 w-4 mr-2" />
                                                Request Location
                                            </Button>
                                            <Button
                                                className="w-full bg-gray-800/60 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-300 rounded-xl"
                                                variant="outline"
                                            >
                                                <Clock className="h-4 w-4 mr-2" />
                                                Extend Screen Time
                                            </Button>
                                            <Button
                                                className="w-full bg-gray-800/60 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-300 rounded-xl"
                                                variant="outline"
                                            >
                                                <Bell className="h-4 w-4 mr-2" />
                                                Send Message
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 shadow-xl">
                                        <CardHeader>
                                            <CardTitle className="text-white">Location</CardTitle>
                                            <CardDescription className="text-gray-400">
                                                Current location of {currentChild.name}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="aspect-square bg-gray-800/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-gray-700/50">
                                                <div className="text-center">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                        <MapPin className="h-6 w-6 text-white" />
                                                    </div>
                                                    <p className="text-sm text-gray-300 font-medium">Map View</p>
                                                    <p className="text-xs text-emerald-400 mt-1">{currentChild.location || "Tidak diketahui"}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between text-sm bg-gray-800/40 rounded-lg p-3">
                                                <span className="text-gray-400">Last updated:</span>
                                                <span className="text-emerald-400 font-medium">{currentChild.lastSeen || "2 minutes ago"}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Main Feature Cards */}
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featureCards.map((card) => (
                            <DashboardCard key={card.title} {...card} />
                        ))}
                    </section>
                </main>
            </div>
        </div>
    )
}
