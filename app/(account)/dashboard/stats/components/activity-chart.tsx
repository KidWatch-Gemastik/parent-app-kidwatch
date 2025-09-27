"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts"
import { Phone, MapPin, Activity, Shield, Clock, TrendingUp, Eye, AlertCircle, MessageSquare, Bell } from "lucide-react"
import { useChildDetails } from "@/hooks/use-child-details"
import { useActivityTrends } from "@/hooks/use-activity-trends"
import { LocationPreview } from "./location-preview"
import { DeviceMonitor } from "./device-monitor"
import { CommunicationMonitor } from "./communication-monitor"
import { SafetyAlerts } from "./safety-alerts"

interface ActivityChartProps {
    stats: any[]
}

export function ActivityChart({ stats }: ActivityChartProps) {
    // const [selectedChildId, setSelectedChildId] = useState<string | null>(null)

    // Prepare chart data
    const chartData = stats.map((child) => ({
        name: child.child_name,
        calls: child.call_logs,
        locations: child.locations,
        activities: child.activity_logs,
        safeZones: child.safe_zones,
        devices: child.devices,
        total: child.call_logs + child.locations + child.activity_logs,
    }))

    // Activity distribution data for pie chart
    const activityDistribution = [
        { name: "Call Logs", value: stats.reduce((sum, child) => sum + child.call_logs, 0), color: "#3b82f6" },
        { name: "Locations", value: stats.reduce((sum, child) => sum + child.locations, 0), color: "#ef4444" },
        { name: "Activities", value: stats.reduce((sum, child) => sum + child.activity_logs, 0), color: "#f59e0b" },
    ]

    return (
        <div className="space-y-6">
            {/* Activity Overview Charts */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Bar Chart - Activity by Child */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                            <TrendingUp className="h-5 w-5" />
                            Activity Overview by Child
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] sm:h-[300px] md:h-[350px]">
                        <ChartContainer
                            config={{
                                calls: { label: "Calls", color: "#3b82f6" },
                                locations: { label: "Locations", color: "#ef4444" },
                                activities: { label: "Activities", color: "#f59e0b" },
                            }}
                            className="h-full w-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="calls" fill="var(--color-calls)" name="Calls" />
                                    <Bar dataKey="locations" fill="var(--color-locations)" name="Locations" />
                                    <Bar dataKey="activities" fill="var(--color-activities)" name="Activities" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Pie Chart - Activity Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Activity Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                calls: { label: "Call Logs", color: "#3b82f6" },
                                locations: { label: "Locations", color: "#ef4444" },
                                activities: { label: "Activities", color: "#f59e0b" },
                            }}
                            className="h-[300px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={activityDistribution}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {activityDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Clickable Child Cards with Detailed Sheets */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Detailed Child Monitoring
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Click on any child card to view detailed monitoring information
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {stats.map((child) => (
                            <ChildDetailSheet key={child.child_id} child={child} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function ChildDetailSheet({ child }: { child: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const { details, loading: detailsLoading, error: detailsError } = useChildDetails(isOpen ? child.child_id : "")
    const { trends, loading: trendsLoading } = useActivityTrends(isOpen ? child.child_id : "")

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
    }

    const formatDuration = (seconds: number) => {
        if (seconds === 0) return "0s"
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`
    }

    const getLocationDisplay = (location: any) => {
        if (location.safe_zone_name) {
            return location.safe_zone_name
        }
        return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{child.child_name}</CardTitle>
                            <Badge variant="secondary">
                                <Clock className="h-3 w-3 mr-1" />
                                Active
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-blue-500" />
                                    Calls
                                </span>
                                <span className="font-semibold">{child.call_logs}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-red-500" />
                                    Locations
                                </span>
                                <span className="font-semibold">{child.locations}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-yellow-500" />
                                    Activities
                                </span>
                                <span className="font-semibold">{child.activity_logs}</span>
                            </div>
                            <div className="pt-2 border-t">
                                <Button variant="outline" size="sm" className="w-full bg-transparent">
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-[600px] h-full sm:h-auto overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        {child.child_name} - Detailed Monitoring
                    </SheetTitle>
                    <SheetDescription>Comprehensive monitoring data for {child.child_name}</SheetDescription>
                </SheetHeader>

                <div className="mt-6">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-1 overflow-x-auto">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="calls">Calls</TabsTrigger>
                            <TabsTrigger value="locations">Locations</TabsTrigger>
                            <TabsTrigger value="devices">Devices</TabsTrigger>
                            <TabsTrigger value="messages">Messages</TabsTrigger>
                            <TabsTrigger value="alerts">Alerts</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-8 w-8 text-blue-500" />
                                            <div>
                                                <p className="text-2xl font-bold">{details.dailyStats.totalCalls}</p>
                                                <p className="text-sm text-muted-foreground">Calls Today</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-8 w-8 text-green-500" />
                                            <div>
                                                <p className="text-2xl font-bold">{details.dailyStats.totalMessages}</p>
                                                <p className="text-sm text-muted-foreground">Messages Today</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-8 w-8 text-green-500" />
                                            <div>
                                                <p className="text-2xl font-bold">{details.dailyStats.timeInSafeZones}</p>
                                                <p className="text-sm text-muted-foreground">Safe Zone Checks</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Weekly Activity Trends</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {trendsLoading ? (
                                        <Skeleton className="h-[250px] w-full" />
                                    ) : (
                                        <ChartContainer
                                            config={{
                                                calls: { label: "Calls", color: "#3b82f6" },
                                                messages: { label: "Messages", color: "#10b981" },
                                                locations: { label: "Locations", color: "#ef4444" },
                                                safeZoneTime: { label: "Safe Zone Time", color: "#f59e0b" },
                                            }}
                                            className="h-[250px]"
                                        >
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={details.weeklyTrends}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="day" />
                                                    <YAxis />
                                                    <ChartTooltip content={<ChartTooltipContent />} />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="calls"
                                                        stroke="var(--color-calls)"
                                                        strokeWidth={2}
                                                        name="Calls"
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="messages"
                                                        stroke="var(--color-messages)"
                                                        strokeWidth={2}
                                                        name="Messages"
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="locations"
                                                        stroke="var(--color-locations)"
                                                        strokeWidth={2}
                                                        name="Locations"
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="safeZoneTime"
                                                        stroke="var(--color-safeZoneTime)"
                                                        strokeWidth={2}
                                                        name="Safe Zone Time"
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </ChartContainer>
                                    )}
                                </CardContent>
                            </Card>

                            {details.safetyAlerts.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Bell className="h-4 w-4" />
                                            Recent Safety Alerts
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {details.safetyAlerts.slice(0, 3).map((alert) => (
                                                <div key={alert.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                                                    <div
                                                        className={`h-2 w-2 rounded-full ${alert.severity === "high"
                                                            ? "bg-red-500"
                                                            : alert.severity === "medium"
                                                                ? "bg-yellow-500"
                                                                : "bg-blue-500"
                                                            }`}
                                                    />
                                                    <p className="text-sm flex-1">{alert.message}</p>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(alert.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="calls" className="space-y-4">
                            {detailsLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-20 w-full" />
                                    ))}
                                </div>
                            ) : detailsError ? (
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-2 text-red-500">
                                            <AlertCircle className="h-4 w-4" />
                                            <p>Error loading call logs: {detailsError}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : details.callLogs.length === 0 ? (
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-muted-foreground text-center">No call logs found</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {details.callLogs.map((call) => (
                                        <Card key={call.id}>
                                            <CardContent className="pt-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Phone className="h-4 w-4 text-blue-500" />
                                                        <div>
                                                            <p className="font-medium">{call.phone_number || "Unknown"}</p>
                                                            <p className="text-sm text-muted-foreground">{formatTime(call.timestamp)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <Badge variant={call.type === "missed" ? "destructive" : "secondary"}>
                                                            {call.type || "Unknown"}
                                                        </Badge>
                                                        <p className="text-sm text-muted-foreground mt-1">{formatDuration(call.duration || 0)}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="locations" className="space-y-4">
                            {detailsLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-20 w-full" />
                                    ))}
                                </div>
                            ) : detailsError ? (
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-2 text-red-500">
                                            <AlertCircle className="h-4 w-4" />
                                            <p>Error loading locations: {detailsError}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <LocationPreview locations={details.locations} />
                            )}
                        </TabsContent>

                        <TabsContent value="activities" className="space-y-4">
                            {detailsLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-20 w-full" />
                                    ))}
                                </div>
                            ) : detailsError ? (
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-2 text-red-500">
                                            <AlertCircle className="h-4 w-4" />
                                            <p>Error loading device data: {detailsError}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <DeviceMonitor devices={details.devices} />
                            )}
                        </TabsContent>

                        <TabsContent value="messages" className="space-y-4">
                            {detailsLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-20 w-full" />
                                    ))}
                                </div>
                            ) : detailsError ? (
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-2 text-red-500">
                                            <AlertCircle className="h-4 w-4" />
                                            <p>Error loading messages: {detailsError}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <CommunicationMonitor messages={details.chatMessages} />
                            )}
                        </TabsContent>

                        <TabsContent value="alerts" className="space-y-4">
                            <SafetyAlerts alerts={details.safetyAlerts} />
                        </TabsContent>
                    </Tabs>
                </div>
            </SheetContent>
        </Sheet>
    )
}
