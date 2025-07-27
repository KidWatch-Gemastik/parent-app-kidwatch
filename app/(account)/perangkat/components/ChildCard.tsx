"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Trash2, MoreVertical, User, Calendar, Users } from "lucide-react"
import type { Child } from "../page"
import { cn } from "@/lib/utils"

interface ChildCardProps {
    child: Child
    onEdit: (child: Child) => void
    onDelete: (child: Child) => void
}

export function ChildCard({ child, onEdit, onDelete }: ChildCardProps) {
    return (
        <Card className="bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 shadow-xl group">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16 ring-2 ring-emerald-500/30 group-hover:ring-emerald-500/50 transition-all duration-300">
                            <AvatarImage
                                src={
                                    child.gender === "L"
                                        ? `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(child.name)}`
                                        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(child.name)}`
                                }
                                alt={child.name}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-bold text-lg">
                                {child.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors duration-300">
                                {child.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <div
                                    className={cn("h-2 w-2 rounded-full", child.status === "online" ? "bg-emerald-500" : "bg-gray-500")}
                                />
                                <span className="text-xs text-gray-400 capitalize">{child.status}</span>
                            </div>
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
                                onClick={() => onEdit(child)}
                                className="hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(child)}
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
                            <Calendar className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm text-gray-300">Usia</span>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{child.age} tahun</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg border border-gray-700/50">
                        <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-mint-400" />
                            <span className="text-sm text-gray-300">Jenis Kelamin</span>
                        </div>
                        <Badge className="bg-mint-500/20 text-mint-400 border-mint-500/30">{child.gender}</Badge>
                    </div>

                    {child.lastSeen && (
                        <div className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg border border-gray-700/50">
                            <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-300">Terakhir Dilihat</span>
                            </div>
                            <span className="text-xs text-gray-400">{child.lastSeen}</span>
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <div className="flex space-x-2">
                        <Button
                            onClick={() => onEdit(child)}
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-gray-800/60 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 rounded-lg"
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                        <Button
                            onClick={() => onDelete(child)}
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-gray-800/60 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 rounded-lg"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
