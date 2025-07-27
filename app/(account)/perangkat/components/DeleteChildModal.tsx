"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, Trash2 } from "lucide-react"
import type { Child } from "../page"

interface DeleteChildModalProps {
    isOpen: boolean
    onClose: () => void
    child: Child | null
    onDelete: (childId: string) => void
}

export function DeleteChildModal({ isOpen, onClose, child, onDelete }: DeleteChildModalProps) {
    const handleDelete = () => {
        if (child) {
            onDelete(child.id)
        }
    }

    if (!child) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-red-500/30 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-3 text-xl text-red-400">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-white" />
                        </div>
                        <span>Hapus Data Anak</span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Tindakan ini tidak dapat dibatalkan. Data anak akan dihapus secara permanen.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-6">
                    <div className="flex items-center space-x-4 p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                        <Avatar className="w-12 h-12 ring-2 ring-red-500/30">
                            <AvatarImage src={child.avatar || `/placeholder.svg?height=48&width=48&text=${child.name[0]}`} />
                            <AvatarFallback className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold">
                                {child.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold text-white">{child.name}</h3>
                            <p className="text-sm text-gray-400">
                                {child.age} tahun • {child.gender}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-red-950/30 border border-red-500/30 rounded-xl">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-red-400 mb-1">Peringatan</h4>
                                <p className="text-sm text-red-300">
                                    Semua data monitoring, riwayat aktivitas, dan pengaturan untuk {child.name} akan dihapus secara
                                    permanen.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-3 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 bg-gray-800/60 border-gray-600 text-gray-300 hover:bg-gray-700/60 hover:border-gray-500 rounded-xl"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleDelete}
                        className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 rounded-xl shadow-lg hover:shadow-red-500/25"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus Anak
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
