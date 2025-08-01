"use client"

import * as React from "react"
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    Circle,
} from "react-leaflet"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Ruler } from "lucide-react"
import L from "leaflet"


interface MapPickerProps {
    onSelectLocation: (lat: number, lng: number, radius: number) => void
    initialLatitude?: number
    initialLongitude?: number
    initialRadius?: number
    label?: string
}

const defaultCenter = { lat: -8.65, lng: 115.216667 }

function LocationMarker({
    setLatitude,
    setLongitude,
    setRadius,
    onSelectLocation,
}: {
    setLatitude: (lat: number) => void
    setLongitude: (lng: number) => void
    setRadius: (r: number) => void
    onSelectLocation: (lat: number, lng: number, r: number) => void
}) {
    useMapEvents({
        click(e) {
            const lat = e.latlng.lat
            const lng = e.latlng.lng
            setLatitude(lat)
            setLongitude(lng)
            onSelectLocation(lat, lng, 100)
        },
    })

    return null
}

export function MapPicker({
    onSelectLocation,
    initialLatitude,
    initialLongitude,
    initialRadius,
    label = "Pilih Lokasi di Peta",
}: MapPickerProps) {
    const [latitude, setLatitude] = React.useState(initialLatitude ?? defaultCenter.lat)
    const [longitude, setLongitude] = React.useState(initialLongitude ?? defaultCenter.lng)
    const [radius, setRadius] = React.useState(initialRadius ?? 100)

    const mapRef = React.useRef<L.Map | null>(null)

    // Ambil lokasi pengguna saat mount
    React.useEffect(() => {
        if (!initialLatitude && !initialLongitude && typeof window !== "undefined" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude
                    const lng = pos.coords.longitude
                    setLatitude(lat)
                    setLongitude(lng)
                    onSelectLocation(lat, lng, radius)

                    // Set view ke posisi user
                    if (mapRef.current) {
                        mapRef.current.setView([lat, lng], 16)
                    }
                },
                (err) => {
                    console.warn("Gagal ambil lokasi pengguna:", err)
                    onSelectLocation(latitude, longitude, radius)
                }
            )
        } else {
            onSelectLocation(latitude, longitude, radius)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Card className="bg-gray-800/60 border-gray-700 text-white rounded-xl shadow-lg">
            <CardContent className="p-4 space-y-4">
                <div className="h-[300px] rounded-lg overflow-hidden relative z-0">
                    <MapContainer
                        center={[latitude, longitude]}
                        zoom={3}
                        scrollWheelZoom={true}
                        className="h-full w-full z-0"
                        ref={(ref) => {
                            if (ref) {
                                mapRef.current = ref
                            }
                        }}
                    >
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker
                            setLatitude={setLatitude}
                            setLongitude={setLongitude}
                            setRadius={setRadius}
                            onSelectLocation={onSelectLocation}
                        />
                        <Marker
                            position={[latitude, longitude]}
                            icon={L.icon({
                                iconUrl: "/marker.png",
                                iconSize: [25, 25],
                                iconAnchor: [12, 41],
                            })}
                        />
                        <Circle center={[latitude, longitude]} radius={radius} pathOptions={{ color: "#10B981" }} />
                    </MapContainer>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span>Radius:</span>
                    <Input
                        type="number"
                        min={10}
                        max={1000}
                        value={radius}
                        onChange={(e) => {
                            const r = Number(e.target.value)
                            setRadius(r)
                            onSelectLocation(latitude, longitude, r)
                        }}
                        className="w-24 text-black"
                    />
                    <Ruler className="w-4 h-4 text-purple-400" />
                    <span>{radius} meter</span>
                </div>
            </CardContent>
        </Card>
    )
}
