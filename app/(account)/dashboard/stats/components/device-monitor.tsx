"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Monitor, Tablet, Wifi, Globe, Clock } from "lucide-react"

interface Device {
    id: string
    device_id: string
    os: string
    status: string
    platform: string
    ip_address: string
    created_at: string
}

interface DeviceMonitorProps {
    devices: Device[]
}

export function DeviceMonitor({ devices }: DeviceMonitorProps) {
    const getDeviceIcon = (platform: string) => {
        switch (platform?.toLowerCase()) {
            case "android":
            case "ios":
                return <Smartphone className="h-4 w-4" />
            case "web":
                return <Monitor className="h-4 w-4" />
            case "tablet":
                return <Tablet className="h-4 w-4" />
            default:
                return <Smartphone className="h-4 w-4" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "online":
                return "bg-green-500"
            case "offline":
                return "bg-gray-500"
            case "idle":
                return "bg-yellow-500"
            default:
                return "bg-gray-500"
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    if (devices.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center">No devices registered</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {/* Device Overview */}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <Smartphone className="h-8 w-8 text-blue-500" />
                            <div>
                                <p className="text-2xl font-bold">{devices.length}</p>
                                <p className="text-sm text-muted-foreground">Total Devices</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <Wifi className="h-8 w-8 text-green-500" />
                            <div>
                                <p className="text-2xl font-bold">{devices.filter((d) => d.status === "online").length}</p>
                                <p className="text-sm text-muted-foreground">Online Now</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Device List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Registered Devices</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {devices.map((device) => (
                            <div key={device.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        {getDeviceIcon(device.platform)}
                                        <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${getStatusColor(device.status)}`} />
                                    </div>
                                    <div>
                                        <p className="font-medium">{device.platform || "Unknown Device"}</p>
                                        <p className="text-sm text-muted-foreground">{device.os || "Unknown OS"}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Globe className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground font-mono">{device.ip_address}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant={device.status === "online" ? "default" : "secondary"}>
                                        {device.status || "Unknown"}
                                    </Badge>
                                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {formatDate(device.created_at)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
