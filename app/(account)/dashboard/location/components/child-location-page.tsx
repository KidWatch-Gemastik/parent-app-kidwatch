"use client"
import { useEffect, useState } from "react"
import { useChildren } from "@/hooks/useChildren"
import type { Child } from "@/types"
import { getAgeFromDate } from "@/lib/function"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Sparkles, LocateFixed, Satellite, Compass, Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { fetchLatestLocation } from "../utils/ChildLocationPage"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"


type Props = {
    initialChildren: Child[]
    userId?: string
}

export function ChildLocationPage({ initialChildren, userId }: Props) {
    console.log('USER', userId)

    const router = useRouter()
    const { children: refreshedChildren, isLoading: isLoadingChildren } = useChildren(userId || null)
    const [children, setChildren] = useState<Child[]>(initialChildren)
    const [selectedChild, setSelectedChild] = useState<Child | null>(initialChildren[0] || null)
    const [isRequestingLocation, setIsRequestingLocation] = useState(false)

    useEffect(() => {
        if (!isLoadingChildren) {
            if (refreshedChildren.length > 0) {
                setChildren((prev) => {
                    return prev.map((child) => {
                        const refreshed = refreshedChildren.find((c) => c.id === child.id)
                        return refreshed ? { ...child, ...refreshed } : child
                    })
                })
            }
        }
    }, [refreshedChildren, isLoadingChildren])

    console.log("🎯 Rendered selectedChild:", selectedChild)


    // const handleRequestLocation = async () => {
    //     if (!selectedChild) return

    //     setIsRequestingLocation(true)

    //     const latestLoc = await fetchLatestLocation(selectedChild.id)

    //     if (latestLoc) {
    //         setSelectedChild((prev) =>
    //             prev
    //                 ? {
    //                     ...prev,
    //                     location: `${latestLoc.latitude.toFixed(4)}, ${latestLoc.longitude.toFixed(4)}`,
    //                     gpsAccuracy: `${latestLoc.accuracy} meter`,
    //                     lastSeen: new Date(latestLoc.timestamp).toLocaleString("id-ID"),
    //                     safeZoneStatus: Math.random() > 0.5 ? "Di dalam zona aman" : "Di luar zona aman", // nanti diganti geofence asli
    //                     status: "online",
    //                 }
    //                 : null,
    //         )
    //     }

    //     setIsRequestingLocation(false)
    // }

    const handleRefreshLocation = async (childId: string) => {
        if (!userId || !selectedChild) return

        setIsRequestingLocation(true)

        const latestLoc = await fetchLatestLocation(childId)

        if (!latestLoc) {
            console.warn("⚠️ No latest location found or fetch error.")
            setIsRequestingLocation(false)
            return
        }

        const updatedChild: Child = {
            ...selectedChild,
            location: `${latestLoc.latitude.toFixed(4)},${latestLoc.longitude.toFixed(4)}`,
            gpsAccuracy: `${latestLoc.accuracy} meter`,
            lastSeen: new Date(latestLoc.timestamp).toLocaleString("id-ID"),
            safeZoneStatus: Math.random() > 0.5 ? "Di dalam zona aman" : "Di luar zona aman",
            status: "online",
        }

        console.log("✅ Updated child with new location:", updatedChild)

        setChildren((prev) =>
            prev.map((child) =>
                child.id === updatedChild.id ? updatedChild : child
            )
        )

        setSelectedChild(updatedChild)
        setIsRequestingLocation(false)
    }


    return (
        <div className="space-y-8">
            {/* Child Selector Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-mint-300 bg-clip-text text-transparent flex items-center gap-2">
                            <Users className="w-6 h-6 text-emerald-400" />
                            Pilih Anak
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <p className="text-gray-400 text-sm">Pilih anak untuk melihat detail lokasinya</p>
                        </div>
                    </div>
                </div>
                {isLoadingChildren ? (
                    <div className="flex space-x-4 overflow-x-auto pb-2 animate-pulse">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Card
                                key={i}
                                className="flex-shrink-0 w-48 h-28 bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 shadow-xl"
                            >
                                <CardContent className="p-4 flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-700" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-gray-700 rounded" />
                                        <div className="h-3 w-20 bg-gray-700 rounded" />
                                        <div className="h-2 w-16 bg-gray-700 rounded-full" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : children.length > 0 ? (
                    <div className="flex space-x-4 overflow-x-auto pb-2">
                        {children.map((child) => (
                            <Card
                                key={child.id}
                                className={cn(
                                    "flex-shrink-0 cursor-pointer transition-all duration-300 border-2 bg-gray-900/80 backdrop-blur-xl hover:scale-90",
                                    selectedChild?.id === child.id
                                        ? "ring-2 ring-emerald-500 bg-emerald-950/50 border-emerald-500/50"
                                        : "border-gray-700/50 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10",
                                )}
                                onClick={() => setSelectedChild(child)}
                            >
                                <CardContent className="p-4 flex items-center space-x-4">
                                    <Avatar className="w-12 h-12 ring-2 ring-emerald-500/30">
                                        <AvatarImage src={
                                            child.sex === "Laki-laki"
                                                ? `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(child.name)}`
                                                : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(child.name)}`
                                        }
                                            alt={child.name} />
                                        <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white font-bold">
                                            {child.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-white">{child.name}</h3>
                                        <p className="text-sm text-gray-400">Usia {getAgeFromDate(child.date_of_birth)} tahun</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <div
                                                className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    child.status === "online" ? "bg-emerald-500" : "bg-gray-500",
                                                )}
                                            />
                                            <span className="text-xs text-gray-400 capitalize">{child.status || "offline"}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-400">Tidak ada anak terdaftar. Silakan tambahkan anak terlebih dahulu.</p>
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/perangkat")}
                            className="mt-4 bg-gradient-to-r from-emerald-500 to-mint-500 text-white hover:from-emerald-600 hover:to-mint-600 rounded-xl shadow-lg hover:shadow-emerald-500/25 px-6 py-3 font-semibold"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Tambah Anak
                        </Button>
                    </div>
                )}
            </section>

            {/* Location Details Section */}
            {selectedChild && (
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-mint-300 bg-clip-text text-transparent flex items-center gap-2">
                        <LocateFixed className="w-6 h-6 text-emerald-400" />
                        Lokasi {selectedChild.name}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Map Placeholder */}
                        <Card className="bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-3 text-white">
                                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-lg flex items-center justify-center">
                                        <MapPin className="h-4 w-4 text-white" />
                                    </div>
                                    <span>Peta Lokasi</span>
                                </CardTitle>
                                <CardDescription className="text-gray-400">Lokasi terkini {selectedChild.name} di peta</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video bg-gray-800/60 backdrop-blur-sm rounded-xl flex items-center justify-center border border-gray-700/50 relative overflow-hidden">
                                    {selectedChild.location ? (
                                        <iframe
                                            src={`https://www.google.com/maps?q=${selectedChild.location}&output=embed`}
                                            className="absolute inset-0 w-full h-full object-cover opacity-90 rounded-xl"
                                            loading="lazy"
                                            title={`Map of ${selectedChild.name}`}
                                        />
                                    ) : (
                                        <div className="relative z-10 text-center bg-gray-900/70 p-4 rounded-lg backdrop-blur-sm border border-emerald-500/30">
                                            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                                <Satellite className="h-8 w-8 text-white" />
                                            </div>
                                            <p className="text-lg text-gray-300 font-medium">Peta Lokasi</p>
                                            <p className="text-sm text-emerald-400 mt-1">
                                                Lokasi: {selectedChild.location || "Tidak diketahui"}
                                            </p>
                                        </div>
                                    )}

                                </div>
                                <div className="mt-4 flex items-center justify-between text-sm bg-gray-800/40 rounded-lg p-3">
                                    <span className="text-gray-400">Terakhir diperbarui:</span>
                                    <span className="text-emerald-400 font-medium">
                                        {selectedChild.lastSeen && !isNaN(new Date(selectedChild.lastSeen).getTime())
                                            ? formatDistanceToNow(new Date(selectedChild.lastSeen), {
                                                addSuffix: true,
                                                locale: id,
                                            })
                                            : "Belum ada data lokasi"}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location Details Card */}
                        <Card className="bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-3 text-white">
                                    <div className="w-8 h-8 bg-gradient-to-r from-mint-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                        <Compass className="h-4 w-4 text-white" />
                                    </div>
                                    <span>Detail Lokasi</span>
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Informasi lebih lanjut tentang lokasi {selectedChild.name}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                    <p className="text-sm text-gray-300">
                                        <span className="font-semibold text-emerald-400">Koordinat:</span>{" "}
                                        {selectedChild.location || "Tidak tersedia"}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                    <p className="text-sm text-gray-300">
                                        <span className="font-semibold text-emerald-400">Status Zona Aman:</span>{" "}
                                        <span
                                            className={cn(
                                                selectedChild.safeZoneStatus?.includes("dalam") ? "text-emerald-400" : "text-amber-400",
                                            )}
                                        >
                                            {selectedChild.safeZoneStatus || "Tidak diatur"}
                                        </span>
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                    <p className="text-sm text-gray-300">
                                        <span className="font-semibold text-emerald-400">Akurasi GPS:</span>{" "}
                                        {selectedChild.gpsAccuracy || "Tidak diketahui"}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => handleRefreshLocation(selectedChild.id)}
                                    disabled={isRequestingLocation}
                                    className="w-full bg-gray-800/60 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all duration-300 rounded-xl"
                                >
                                    {isRequestingLocation ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Meminta Lokasi...
                                        </>
                                    ) : (
                                        <>
                                            <MapPin className="h-4 w-4 mr-2" />
                                            Minta Lokasi Terbaru
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}
        </div>
    )
}
