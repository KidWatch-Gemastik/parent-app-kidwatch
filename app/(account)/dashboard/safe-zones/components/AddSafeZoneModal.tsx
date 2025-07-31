"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Sparkles, Loader2 } from "lucide-react"
import type { Child } from "@/types"
import { addSafeZone } from "@/lib/actions/safeZones"
import { MapPicker } from "@/components/map-picker"
import 'leaflet/dist/leaflet.css';
import { ChildSelect } from "./childSelect"


interface AddSafeZoneModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
    childrenList: Child[]
}

export function AddSafeZoneModal({ isOpen, onClose, onSave, childrenList }: AddSafeZoneModalProps) {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const { name, child_id } = formData
        const { lat, lng, radius } = location

        if (!name || !child_id || lat === 0 || lng === 0 || radius <= 0) {
            setError("Semua kolom wajib diisi dengan benar.")
            return
        }

        setIsLoading(true)
        const result = await addSafeZone({
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

    const handleClose = () => {
        setFormData({ name: "", child_id: "" })
        setLocation({ lat: 0, lng: 0, radius: 100 })
        setError(null)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-emerald-500/30 text-white w-full md:max-w-4xl lg:max-w-5xl">
                <DialogHeader className="relative z-10 mb-4">
                    <DialogTitle className="flex items-center space-x-3 text-xl">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Plus className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-emerald-300 to-mint-300 bg-clip-text text-transparent font-bold">
                            Tambah Zona Aman Baru
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 flex items-center gap-2 mt-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                        Definisikan area aman untuk anak Anda
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6 relative z-10">
                    {error && (
                        <div className="bg-red-950/30 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm">{error}</div>
                    )}

                    {/* Nama + Anak (samping-sampingan) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                                Nama Tempat
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Contoh: Sekolah, Rumah"
                                className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl h-12"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <ChildSelect
                                childrenList={childrenList}
                                value={formData.child_id}
                                onChange={(value) => setFormData({ ...formData, child_id: value })}
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

                    {/* Action Buttons */}
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
                            variant="ghost"
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-mint-500 text-white hover:from-emerald-600 hover:to-mint-600 rounded-xl shadow-lg hover:shadow-emerald-500/25 h-12 transition-all duration-300 hover:scale-105 font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tambah Zona Aman
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
