"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MapPin, Zap, Smartphone, CheckCircle, Clock, X } from "lucide-react"

interface SafetyAlert {
    id: string
    type: string
    message: string
    severity: "low" | "medium" | "high"
    timestamp: string
    resolved: boolean
}

interface SafetyAlertsProps {
    alerts: SafetyAlert[]
}

export function SafetyAlerts({ alerts }: SafetyAlertsProps) {
    const getAlertIcon = (type: string) => {
        switch (type) {
            case "location":
                return <MapPin className="h-4 w-4" />
            case "speed":
                return <Zap className="h-4 w-4" />
            case "device":
                return <Smartphone className="h-4 w-4" />
            default:
                return <AlertTriangle className="h-4 w-4" />
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "high":
                return "bg-red-500"
            case "medium":
                return "bg-yellow-500"
            case "low":
                return "bg-blue-500"
            default:
                return "bg-gray-500"
        }
    }

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case "high":
                return <Badge variant="destructive">High Priority</Badge>
            case "medium":
                return (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Medium
                    </Badge>
                )
            case "low":
                return <Badge variant="secondary">Low Priority</Badge>
            default:
                return <Badge variant="secondary">Unknown</Badge>
        }
    }

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
    }

    const activeAlerts = alerts.filter((alert) => !alert.resolved)
    const resolvedAlerts = alerts.filter((alert) => alert.resolved)

    if (alerts.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <p className="text-muted-foreground">No safety alerts - everything looks good!</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {/* Alert Statistics */}
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                            <div>
                                <p className="text-2xl font-bold">{activeAlerts.length}</p>
                                <p className="text-sm text-muted-foreground">Active Alerts</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                    {alerts.filter((a) => a.severity === "high" && !a.resolved).length}
                                </span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{alerts.filter((a) => a.severity === "high").length}</p>
                                <p className="text-sm text-muted-foreground">High Priority</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                    {alerts.filter((a) => a.severity === "medium" && !a.resolved).length}
                                </span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{alerts.filter((a) => a.severity === "medium").length}</p>
                                <p className="text-sm text-muted-foreground">Medium Priority</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                            <div>
                                <p className="text-2xl font-bold">{resolvedAlerts.length}</p>
                                <p className="text-sm text-muted-foreground">Resolved</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Active Alerts */}
            {activeAlerts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            Active Safety Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {activeAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className="flex items-start gap-3 p-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                                >
                                    <div className="flex-shrink-0">
                                        <div
                                            className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${getSeverityColor(alert.severity)}`}
                                        >
                                            {getAlertIcon(alert.type)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {getSeverityBadge(alert.severity)}
                                            <span className="text-xs text-muted-foreground capitalize">{alert.type} Alert</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert.message}</p>
                                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {formatTime(alert.timestamp)}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Resolved Alerts */}
            {resolvedAlerts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Resolved Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {resolvedAlerts.map((alert) => (
                                <div key={alert.id} className="flex items-center gap-3 p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                                    <div className="flex-shrink-0">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
                                        <span className="text-xs text-muted-foreground">Resolved • {formatTime(alert.timestamp)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
