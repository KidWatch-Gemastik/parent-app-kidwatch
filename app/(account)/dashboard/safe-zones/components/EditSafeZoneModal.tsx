"use client"

import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Pencil, Loader2 } from "lucide-react"
import type { Child, SafeZone } from "@/types"
import { updateSafeZone } from "@/lib/actions/safeZones"
const MapPicker = dynamic(
    () => import("@/components/map-picker").then(mod => mod.MapPicker),
    { ssr: false }
)
import { ChildSelect } from "./childSelect"
import dynamic from "next/dynamic"

interface EditSafeZoneModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
    zone: SafeZone | null
    childrenList: Child[]
}

export function EditSafeZoneModal({
    isOpen,
    onClose,
    onSave,
    zone,
    childrenList,
}: EditSafeZoneModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        child_id: "",
    })

    const [location, setLocation] = useState({
        lat: 0,
        lng: 0,
        radius: 100,
    })

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (zone) {
            setFormData({
                name: zone.name || "",
                child_id: zone.child_id || "",
            })
            setLocation({
                lat: zone.latitude || 0,
                lng: zone.longitude || 0,
                radius: zone.radius || 100,
            })
        }
    }, [zone])

    const handleClose = () => {
        setFormData({ name: "", child_id: "" })
        setLocation({ lat: 0, lng: 0, radius: 100 })
        setError(null)
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!zone?.id) return setError("Zona tidak valid.")

        const { name, child_id } = formData
        const { lat, lng, radius } = location

        if (!name || !child_id || lat === 0 || lng === 0 || radius <= 0) {
            setError("Semua kolom wajib diisi dengan benar.")
            return
        }

        setIsLoading(true)

        const result = await updateSafeZone({
            id: zone.id,
            name,
            latitude: lat,
            longitude: lng,
            radius,
            child_id,
        })


        if (result.success) {
            onSave()
            handleClose()
        } else {
            setError(result.message)
        }

        setIsLoading(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-emerald-500/30 text-white w-full md:max-w-4xl lg:max-w-5xl">
                <DialogHeader className="relative z-10 mb-4">
                    <DialogTitle className="flex items-center space-x-3 text-xl">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-xl flex items-center justify-center shadow-lg">
                            <Pencil className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent font-bold">
                            Edit Zona Aman
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 flex items-center gap-2 mt-2">
                        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                        Perbarui detail zona aman anak Anda
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6 relative z-10">
                    {error && (
                        <div className="bg-red-950/30 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm">{error}</div>
                    )}

                    {/* Nama + Anak */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                                Nama Tempat
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Contoh: Rumah, Sekolah"
                                className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 rounded-xl h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <ChildSelect
                                childrenList={childrenList}
                                value={formData.child_id}
                                onChange={(val) => setFormData({ ...formData, child_id: val })}
                            />
                        </div>
                    </div>

                    {/* Lokasi Map */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full" />
                            Lokasi & Radius Zona
                        </Label>
                        <MapPicker
                            initialLatitude={location.lat}
                            initialLongitude={location.lng}
                            initialRadius={location.radius}
                            onSelectLocation={(lat, lng, radius) => setLocation({ lat, lng, radius })}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1 bg-gray-800/60 border-gray-600 text-gray-300 hover:bg-gray-700/60 hover:border-gray-500 rounded-xl h-12"
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="ghost"
                            className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black hover:from-yellow-500 hover:to-yellow-400 rounded-xl shadow-lg h-12 font-semibold transition-all duration-300 hover:scale-105"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
