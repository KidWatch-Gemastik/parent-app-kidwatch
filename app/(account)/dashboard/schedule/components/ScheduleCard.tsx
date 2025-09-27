"use client"

import { Clock, AlertCircle, MoreVertical, Edit2, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Scheduling } from "@/types"

interface ScheduleCardProps {
    schedule: Scheduling
    onEdit?: (schedule: Scheduling) => void
    onDelete?: (schedule: Scheduling) => void
}

const urgencyColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    normal: "bg-blue-100 text-blue-800 border-blue-200",
    high: "bg-red-100 text-red-800 border-red-200",
}

const statusColors = {
    active: "bg-accent text-accent-foreground",
    inactive: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive text-destructive-foreground",
}

export default function ScheduleCard({ schedule, onEdit, onDelete }: ScheduleCardProps) {
    const formatTime = (time: string) => time.slice(0, 5)

    const getDayInIndonesian = (day: string) => {
        const days: Record<string, string> = {
            monday: "Senin",
            tuesday: "Selasa",
            wednesday: "Rabu",
            thursday: "Kamis",
            friday: "Jumat",
            saturday: "Sabtu",
            sunday: "Minggu",
        }
        return days[day] || day
    }

    return (
        <Card className="hover:shadow-md transition-shadow duration-200 group">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="font-semibold text-card-foreground text-lg mb-1">{schedule.activity_type}</h3>
                        <p className="text-sm text-muted-foreground">{getDayInIndonesian(schedule.day_of_week)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge className={cn("text-xs", statusColors[schedule.status])}>{schedule.status}</Badge>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onEdit?.(schedule)}
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onDelete?.(schedule)}
                        >
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                </div>

                {schedule.description && (
                    <p className="text-sm text-muted-foreground mb-3 text-pretty">{schedule.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                            {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                        </span>
                    </div>

                    {schedule.notify_before && (
                        <div className="flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>Notifikasi {schedule.notify_before}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <Badge className={cn("text-xs", urgencyColors[schedule.urgency])}>
                        {schedule.urgency === "low" ? "Rendah" : schedule.urgency === "normal" ? "Normal" : "Tinggi"}
                    </Badge>

                    <Badge variant="outline" className="text-xs">
                        {schedule.recurrence === "once"
                            ? "Sekali"
                            : schedule.recurrence === "daily"
                                ? "Harian"
                                : schedule.recurrence === "weekly"
                                    ? "Mingguan"
                                    : "Bulanan"}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}
