"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Bell,
    ChevronDown,
    Clock,
    MapPin,
    Shield,
    Smartphone,
    AlertTriangle,
    CheckCircle,
    Eye,
    Settings,
    BarChart3,
    Home,
    User,
    LogOut,
    Sparkles,
} from "lucide-react"
import { useSupabaseAuthSession } from "@/hooks/useSupabaseAuthSession"
import { redirect } from "next/navigation"
import { cn } from "@/lib/utils"

export default function ParentDashboard() {
    const [selectedChild, setSelectedChild] = useState("emma")
    const { user, loading } = useSupabaseAuthSession()

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-emerald-400 font-medium">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return redirect("/login")
    }

    const children = [
        {
            id: "emma",
            name: "Emma",
            age: 12,
            avatar: "/placeholder.svg?height=40&width=40&text=E",
            status: "online",
            location: "Home",
            screenTime: "2h 15m",
            screenTimeLimit: "4h",
            screenTimePercentage: 56,
        },
        {
            id: "alex",
            name: "Alex",
            age: 9,
            avatar: "/placeholder.svg?height=40&width=40&text=A",
            status: "offline",
            location: "School",
            screenTime: "45m",
            screenTimeLimit: "2h",
            screenTimePercentage: 38,
        },
    ]

    const currentChild = children.find((child) => child.id === selectedChild) || children[0]

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
            message: "Emma exceeded screen time limit yesterday",
            time: "1 hour ago",
        },
        {
            type: "info",
            message: "Alex arrived safely at school",
            time: "3 hours ago",
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

            <div className="relative z-10">
                {/* Enhanced Header */}
                <header className="bg-gray-900/90 backdrop-blur-xl border-b border-emerald-500/30 px-6 py-4 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-mint-300 bg-clip-text text-transparent">
                                        KidsWatch
                                    </h1>
                                    <div className="flex items-center gap-1">
                                        <Sparkles className="w-3 h-3 text-emerald-400" />
                                        <span className="text-xs text-gray-400 font-light">Parent Dashboard</span>
                                    </div>
                                </div>
                            </div>
                            <nav className="hidden md:flex space-x-2">
                                <Button
                                    variant="ghost"
                                    className="text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl"
                                >
                                    <Home className="h-4 w-4 mr-2" />
                                    Dashboard
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl"
                                >
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    Reports
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl"
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Settings
                                </Button>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl"
                            >
                                <Bell className="h-5 w-5" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-emerald-500 to-mint-500 border-0">
                                    2
                                </Badge>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl"
                                    >
                                        <Avatar className="h-8 w-8 ring-2 ring-emerald-500/30">
                                            <AvatarImage src="/placeholder.svg?height=32&width=32&text=P" />
                                            <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white">
                                                P
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>Parent</span>
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="bg-gray-900/95 backdrop-blur-xl border-emerald-500/30 text-gray-300"
                                >
                                    <DropdownMenuItem className="hover:bg-emerald-500/10 hover:text-emerald-400">
                                        <User className="h-4 w-4 mr-2" />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-emerald-500/10 hover:text-emerald-400">
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-emerald-500/10 hover:text-emerald-400">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    {/* Enhanced Child Selector */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                            Select Child
                        </h2>
                        <div className="flex space-x-4">
                            {children.map((child) => (
                                <Card
                                    key={child.id}
                                    className={cn(
                                        "cursor-pointer transition-all duration-300 border-2 bg-gray-900/80 backdrop-blur-xl hover:scale-105",
                                        selectedChild === child.id
                                            ? "ring-2 ring-emerald-500 bg-emerald-950/50 border-emerald-500/50"
                                            : "border-gray-700/50 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10",
                                    )}
                                    onClick={() => setSelectedChild(child.id)}
                                >
                                    <CardContent className="p-5">
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="ring-2 ring-emerald-500/30">
                                                <AvatarImage src={child.avatar || "/placeholder.svg"} />
                                                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-bold">
                                                    {child.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-bold text-white">{child.name}</h3>
                                                <p className="text-sm text-gray-400">Age {child.age}</p>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <div
                                                        className={cn(
                                                            "h-2 w-2 rounded-full",
                                                            child.status === "online" ? "bg-emerald-500" : "bg-gray-500",
                                                        )}
                                                    />
                                                    <span className="text-xs text-gray-400 capitalize">{child.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

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
                                <div className="text-3xl font-bold text-white mb-2">{currentChild.screenTime}</div>
                                <div className="mt-3">
                                    <Progress value={currentChild.screenTimePercentage} className="h-3 bg-gray-800" />
                                    <p className="text-xs text-gray-400 mt-2">of {currentChild.screenTimeLimit} limit</p>
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
                                <div className="text-3xl font-bold text-white mb-2">{currentChild.location}</div>
                                <div className="flex items-center mt-3">
                                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                                    <p className="text-xs text-gray-400">Safe zone</p>
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
                                <div className="text-3xl font-bold text-white mb-2">3</div>
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
                                <div className="text-3xl font-bold text-white mb-2">Online</div>
                                <p className="text-xs text-gray-400">Last seen: 5 min ago</p>
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
                                        {currentChild.name}'s device activity today
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
                                    <CardDescription className="text-gray-400">Manage {currentChild.name}'s device</CardDescription>
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
                                    <CardDescription className="text-gray-400">Current location of {currentChild.name}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="aspect-square bg-gray-800/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-gray-700/50">
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                <MapPin className="h-6 w-6 text-white" />
                                            </div>
                                            <p className="text-sm text-gray-300 font-medium">Map View</p>
                                            <p className="text-xs text-emerald-400 mt-1">{currentChild.location}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between text-sm bg-gray-800/40 rounded-lg p-3">
                                        <span className="text-gray-400">Last updated:</span>
                                        <span className="text-emerald-400 font-medium">2 minutes ago</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
