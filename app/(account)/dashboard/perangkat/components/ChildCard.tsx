"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, User, Calendar, Users, QrCode } from "lucide-react"
import { Child } from "@/types"
import { cn } from "@/lib/utils"
import { getAgeFromDate } from "@/lib/function"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import * as QRCode from "qrcode.react"
import { toast } from "sonner"

interface ChildCardProps {
    child: Child
    onEdit: (child: Child) => void
    onDelete: (child: Child) => void
}

export function ChildCard({ child, onEdit, onDelete }: ChildCardProps) {
    const [isQrOpen, setIsQrOpen] = useState(false)
    const qrValue = child.qr_id || "https://kiddygoo.my.id/" + child.qr_id

    // console.log(qrValue)

    return (
        <>
            <Card className="bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 shadow-xl group">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <Avatar className="w-16 h-16 ring-2 ring-emerald-500/30 group-hover:ring-emerald-500/50 transition-all duration-300">
                                <AvatarImage
                                    src={
                                        child.sex === "Laki-laki"
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

                        <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg opacity-100 group-hover:opacity-100 transition-all duration-300"
                                >
                                    <QrCode className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-900 border-emerald-500/30 text-center space-y-4">
                                <DialogTitle className="text-white font-semibold text-lg">
                                    QR Code untuk {child.name}
                                </DialogTitle>
                                <div className="flex flex-col items-center justify-center">
                                    <QRCode.QRCodeCanvas value={qrValue} size={200} fgColor="#10B981" bgColor="transparent" />
                                    {child.qr_id && (
                                        <div className="flex flex-col items-center space-y-2">
                                            <span className="text-sm font-mono mt-3 text-gray-300 bg-gray-800/60 px-3 py-1 rounded-lg border border-gray-700/50">
                                                {child.qr_id}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(child.qr_id || "")
                                                    toast.success(`QR ID ${child.name} berhasil disalin!`)
                                                }}
                                            >
                                                Salin QR ID
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        const canvas = document.querySelector("canvas") as HTMLCanvasElement
                                        const link = document.createElement("a")
                                        link.download = `${child.name}_qr.png`
                                        link.href = canvas.toDataURL("image/png")
                                        link.click()
                                    }}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                                >
                                    Unduh QR Code
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg border border-gray-700/50">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-emerald-400" />
                                <span className="text-sm text-gray-300">Usia</span>
                            </div>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{getAgeFromDate(child.date_of_birth)} tahun</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg border border-gray-700/50">
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-mint-400" />
                                <span className="text-sm text-gray-300">Jenis Kelamin</span>
                            </div>
                            <Badge className="bg-mint-500/20 text-mint-400 border-mint-500/30">{child.sex}</Badge>
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
        </>
    )
}
