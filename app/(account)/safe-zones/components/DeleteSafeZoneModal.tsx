"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2, Loader2, MapPin } from "lucide-react"
import type { SafeZone } from "@/types"
import { deleteSafeZone } from "@/lib/actions/safeZones"
import { useState } from "react"

interface DeleteSafeZoneModalProps {
    isOpen: boolean
    onClose: () => void
    zone: SafeZone | null
    onDelete: () => void // Callback to refresh data after delete
}

export function DeleteSafeZoneModal({ isOpen, onClose, zone, onDelete }: DeleteSafeZoneModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async () => {
        if (!zone) return

        setIsLoading(true)
        setError(null)
        const result = await deleteSafeZone(zone.id)

        if (result.success) {
            onDelete() // Trigger data refresh on parent page
            onClose()
        } else {
            setError(result.message)
        }
        setIsLoading(false)
    }

    if (!zone) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-red-500/30 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-3 text-xl text-red-400">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-white" />
                        </div>
                        <span>Hapus Zona Aman</span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Tindakan ini tidak dapat dibatalkan. Zona aman akan dihapus secara permanen.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-6">
                    <div className="flex items-center space-x-4 p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                            <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{zone.name}</h3>
                            <p className="text-sm text-gray-400">
                                Untuk: {zone.child_name || "N/A"} • Radius: {zone.radius}m
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-red-950/30 border border-red-500/30 rounded-xl">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-red-400 mb-1">Peringatan</h4>
                                <p className="text-sm text-red-300">
                                    Menghapus zona aman ini akan menghentikan semua notifikasi terkait geofencing untuk area ini.
                                </p>
                            </div>
                        </div>
                    </div>
                    {error && (
                        <div className="bg-red-950/30 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm mt-4">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex space-x-3 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 bg-gray-800/60 border-gray-600 text-gray-300 hover:bg-gray-700/60 hover:border-gray-500 rounded-xl"
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        variant={'ghost'}
                        onClick={handleDelete}
                        className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 rounded-xl shadow-lg hover:shadow-red-500/25"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Menghapus...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus Zona Aman
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
