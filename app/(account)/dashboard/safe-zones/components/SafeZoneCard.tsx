"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MapPin, Edit, Trash2, MoreVertical, Users, Ruler } from "lucide-react"
import type { SafeZone } from "@/types"

interface SafeZoneCardProps {
    zone: SafeZone
    onEdit: (zone: SafeZone) => void
    onDelete: (zone: SafeZone) => void
}

export function SafeZoneCard({ zone, onEdit, onDelete }: SafeZoneCardProps) {
    return (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 shadow-xl group">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors duration-300">
                                {zone.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}
                            </p>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="bg-gray-900/95 backdrop-blur-xl border-emerald-500/30 text-gray-300"
                        >
                            <DropdownMenuItem
                                onClick={() => onEdit(zone)}
                                className="hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(zone)}
                                className="hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg border border-gray-700/50">
                        <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-mint-400" />
                            <span className="text-sm text-gray-300">Untuk Anak</span>
                        </div>
                        <span className="text-sm text-emerald-400 font-medium">{zone.child_name || "N/A"}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg border border-gray-700/50">
                        <div className="flex items-center space-x-2">
                            <Ruler className="h-4 w-4 text-purple-400" />
                            <span className="text-sm text-gray-300">Radius</span>
                        </div>
                        <span className="text-sm text-gray-400">{zone.radius} meter</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg border border-gray-700/50">
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-orange-400" />
                            <span className="text-sm text-gray-300">Dibuat Pada</span>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(zone.created_at).toLocaleString()}</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <div className="flex space-x-2">
                        <Button
                            onClick={() => onEdit(zone)}
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-gray-800/60 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 rounded-lg"
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                        <Button
                            onClick={() => onDelete(zone)}
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-gray-800/60 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 rounded-lg"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Hapus
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
