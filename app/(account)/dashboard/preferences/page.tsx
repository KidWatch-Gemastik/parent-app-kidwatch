"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
    Moon,
    Sun,
    Bell,
    Lock,
    Globe,
    Palette,
    Volume2,
    Mail,
    MessageSquare,
    ArrowLeft,
    Settings,
    Sparkles,
    Monitor,
    Database,
    Wifi,
    Timer,
    MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function PreferencesPage() {
    const [darkMode, setDarkMode] = useState(true)
    const [notifications, setNotifications] = useState(true)
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(true)
    const [locationTracking, setLocationTracking] = useState(true)
    const [autoLock, setAutoLock] = useState(true)
    const [soundEnabled, setSoundEnabled] = useState(true)
    const [dataSync, setDataSync] = useState(true)
    const [offlineMode, setOfflineMode] = useState(false)
    const [language, setLanguage] = useState("id")
    const [theme, setTheme] = useState("dark")
    const [soundVolume, setSoundVolume] = useState([75])
    const [autoLockTime, setAutoLockTime] = useState([5])

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
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <Settings className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-mint-300 bg-clip-text text-transparent">
                                        Preferences
                                    </h1>
                                    <div className="flex items-center gap-1">
                                        <Sparkles className="w-3 h-3 text-emerald-400" />
                                        <span className="text-xs text-gray-400 font-light">Customize your experience</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Premium</Badge>
                            <Avatar className="h-10 w-10 ring-2 ring-emerald-500/30">
                                <AvatarImage src="/placeholder.svg?height=40&width=40&text=P" />
                                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-bold">
                                    P
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                <div className="p-6 max-w-4xl mx-auto">
                    {/* Theme & Appearance Settings */}
                    <Card className="mb-8 bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-3 text-white">
                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-lg flex items-center justify-center">
                                    <Palette className="h-4 w-4 text-white" />
                                </div>
                                <span>Theme & Appearance</span>
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Customize the look and feel of your KiddyGoo experience
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Theme Selection */}
                            <div className="space-y-4">
                                <Label className="text-sm font-semibold text-gray-300">Theme Mode</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    <Card
                                        className={cn(
                                            "cursor-pointer transition-all duration-300 border-2 bg-gray-800/60 backdrop-blur-sm hover:scale-105",
                                            theme === "light"
                                                ? "border-emerald-500/50 bg-emerald-950/30"
                                                : "border-gray-700/50 hover:border-emerald-500/30",
                                        )}
                                        onClick={() => setTheme("light")}
                                    >
                                        <CardContent className="p-4 text-center">
                                            <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                                <Sun className="h-6 w-6 text-gray-800" />
                                            </div>
                                            <h3 className="font-semibold text-white text-sm">Light</h3>
                                            <p className="text-xs text-gray-400 mt-1">Bright and clean</p>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className={cn(
                                            "cursor-pointer transition-all duration-300 border-2 bg-gray-800/60 backdrop-blur-sm hover:scale-105",
                                            theme === "dark"
                                                ? "border-emerald-500/50 bg-emerald-950/30"
                                                : "border-gray-700/50 hover:border-emerald-500/30",
                                        )}
                                        onClick={() => setTheme("dark")}
                                    >
                                        <CardContent className="p-4 text-center">
                                            <div className="w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                                <Moon className="h-6 w-6 text-emerald-400" />
                                            </div>
                                            <h3 className="font-semibold text-white text-sm">Dark</h3>
                                            <p className="text-xs text-gray-400 mt-1">Easy on the eyes</p>
                                        </CardContent>
                                    </Card>

                                    <Card
                                        className={cn(
                                            "cursor-pointer transition-all duration-300 border-2 bg-gray-800/60 backdrop-blur-sm hover:scale-105",
                                            theme === "system"
                                                ? "border-emerald-500/50 bg-emerald-950/30"
                                                : "border-gray-700/50 hover:border-emerald-500/30",
                                        )}
                                        onClick={() => setTheme("system")}
                                    >
                                        <CardContent className="p-4 text-center">
                                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                                <Monitor className="h-6 w-6 text-white" />
                                            </div>
                                            <h3 className="font-semibold text-white text-sm">System</h3>
                                            <p className="text-xs text-gray-400 mt-1">Follow device</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            <Separator className="bg-gray-700/50" />

                            {/* Dark Mode Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                        <Moon className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-white">Dark Mode</Label>
                                        <p className="text-xs text-gray-400">Enable dark theme across the app</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={darkMode}
                                    onCheckedChange={setDarkMode}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications Settings */}
                    <Card className="mb-8 bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-3 text-white">
                                <div className="w-8 h-8 bg-gradient-to-r from-mint-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <Bell className="h-4 w-4 text-white" />
                                </div>
                                <span>Notifications</span>
                            </CardTitle>
                            <CardDescription className="text-gray-400">Manage how you receive alerts and updates</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                        <Bell className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-white">Push Notifications</Label>
                                        <p className="text-xs text-gray-400">Receive instant alerts on your device</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={pushNotifications}
                                    onCheckedChange={setPushNotifications}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-white">Email Notifications</Label>
                                        <p className="text-xs text-gray-400">Get updates via email</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={emailNotifications}
                                    onCheckedChange={setEmailNotifications}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                        <MessageSquare className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-white">SMS Notifications</Label>
                                        <p className="text-xs text-gray-400">Receive critical alerts via SMS</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={notifications}
                                    onCheckedChange={setNotifications}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </div>

                            {/* Sound Volume */}
                            <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                            <Volume2 className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-semibold text-white">Notification Sound</Label>
                                            <p className="text-xs text-gray-400">Adjust notification volume</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={soundEnabled}
                                        onCheckedChange={setSoundEnabled}
                                        className="data-[state=checked]:bg-emerald-500"
                                    />
                                </div>
                                {soundEnabled && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Volume: {soundVolume[0]}%</span>
                                        </div>
                                        <Slider value={soundVolume} onValueChange={setSoundVolume} max={100} step={5} className="w-full" />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy & Security Settings */}
                    <Card className="mb-8 bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-3 text-white">
                                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <Lock className="h-4 w-4 text-white" />
                                </div>
                                <span>Privacy & Security</span>
                            </CardTitle>
                            <CardDescription className="text-gray-400">Control your privacy and security settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-lg flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-white">Location Tracking</Label>
                                        <p className="text-xs text-gray-400">Allow location monitoring for safety</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={locationTracking}
                                    onCheckedChange={setLocationTracking}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                                        <Lock className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-white">Auto Lock</Label>
                                        <p className="text-xs text-gray-400">Automatically lock app when inactive</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={autoLock}
                                    onCheckedChange={setAutoLock}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </div>

                            {/* Auto Lock Time */}
                            {autoLock && (
                                <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                            <Timer className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-semibold text-white">Auto Lock Timer</Label>
                                            <p className="text-xs text-gray-400">Lock after {autoLockTime[0]} minutes of inactivity</p>
                                        </div>
                                    </div>
                                    <Slider
                                        value={autoLockTime}
                                        onValueChange={setAutoLockTime}
                                        max={30}
                                        min={1}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                        <Database className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-white">Data Sync</Label>
                                        <p className="text-xs text-gray-400">Sync data across devices</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={dataSync}
                                    onCheckedChange={setDataSync}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* General Settings */}
                    <Card className="mb-8 bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-3 text-white">
                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-mint-400 rounded-lg flex items-center justify-center">
                                    <Settings className="h-4 w-4 text-white" />
                                </div>
                                <span>General</span>
                            </CardTitle>
                            <CardDescription className="text-gray-400">General app preferences and settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Language Selection */}
                            <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                            <Globe className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-semibold text-white">Language</Label>
                                            <p className="text-xs text-gray-400">Choose your preferred language</p>
                                        </div>
                                    </div>
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger className="w-32 bg-gray-700/50 border-gray-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-600">
                                            <SelectItem value="id">Bahasa Indonesia</SelectItem>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="ms">Bahasa Malaysia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                                        <Wifi className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-white">Offline Mode</Label>
                                        <p className="text-xs text-gray-400">Use app without internet connection</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={offlineMode}
                                    onCheckedChange={setOfflineMode}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            variant="outline"
                            className="bg-gray-800/60 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 rounded-xl"
                        >
                            Reset to Default
                        </Button>
                        <Button className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white hover:from-emerald-600 hover:to-mint-600 rounded-xl shadow-lg hover:shadow-emerald-500/25 px-8">
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
