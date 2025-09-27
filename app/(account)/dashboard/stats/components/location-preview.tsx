"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ExternalLink, Navigation, Clock } from "lucide-react"

interface LocationPreviewProps {
    locations: Array<{
        id: string
        latitude: number
        longitude: number
        accuracy: number
        speed?: number
        altitude?: number
        source: string
        timestamp: string
        safe_zone_name?: string
    }>
}

export function LocationPreview({ locations }: LocationPreviewProps) {
    const [selectedLocation, setSelectedLocation] = useState<number>(0)

    if (locations.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center">No location data available</p>
                </CardContent>
            </Card>
        )
    }

    const currentLocation = locations[selectedLocation]

    const openInMaps = (lat: number, lng: number) => {
        const url = `https://www.google.com/maps?q=${lat},${lng}&z=15`
        window.open(url, "_blank")
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

    const getSpeedDisplay = (speed?: number) => {
        if (!speed || speed === 0) return "Stationary"
        return `${Math.round(speed * 3.6)} km/h` // Convert m/s to km/h
    }

    return (
        <div className="space-y-4">
            {/* Location Map Preview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Current Location
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openInMaps(currentLocation.latitude, currentLocation.longitude)}
                            className="flex items-center gap-2"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Open in Maps
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Location Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Coordinates</p>
                                <p className="font-mono text-sm">
                                    {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Accuracy</p>
                                <p className="text-sm">±{Math.round(currentLocation.accuracy)}m</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Speed</p>
                                <p className="text-sm flex items-center gap-1">
                                    <Navigation className="h-3 w-3" />
                                    {getSpeedDisplay(currentLocation.speed)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Source</p>
                                <Badge variant="secondary" className="text-xs">
                                    {currentLocation.source?.toUpperCase() || "GPS"}
                                </Badge>
                            </div>
                        </div>

                        {/* Safe Zone Status */}
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`h-3 w-3 rounded-full ${currentLocation.safe_zone_name ? "bg-green-500" : "bg-yellow-500"
                                        }`}
                                />
                                <span className="text-sm font-medium">
                                    {currentLocation.safe_zone_name ? `In ${currentLocation.safe_zone_name}` : "Outside Safe Zones"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatTime(currentLocation.timestamp)}
                            </div>
                        </div>

                        {/* Location History Navigation */}
                        {locations.length > 1 && (
                            <div className="flex items-center justify-between">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedLocation(Math.max(0, selectedLocation - 1))}
                                    disabled={selectedLocation === 0}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {selectedLocation + 1} of {locations.length}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedLocation(Math.min(locations.length - 1, selectedLocation + 1))}
                                    disabled={selectedLocation === locations.length - 1}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Locations List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Recent Locations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {locations.slice(0, 10).map((location, index) => (
                            <div
                                key={location.id}
                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${index === selectedLocation ? "bg-primary/10" : "hover:bg-muted/50"
                                    }`}
                                onClick={() => setSelectedLocation(index)}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`h-2 w-2 rounded-full ${location.safe_zone_name ? "bg-green-500" : "bg-yellow-500"}`}
                                    />
                                    <div>
                                        <p className="text-sm font-medium">
                                            {location.safe_zone_name || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{formatTime(location.timestamp)}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        openInMaps(location.latitude, location.longitude)
                                    }}
                                    className="h-8 w-8 p-0"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
