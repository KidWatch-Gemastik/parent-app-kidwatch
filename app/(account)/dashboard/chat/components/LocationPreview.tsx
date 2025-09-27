"use client"

import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"

interface LocationPreviewProps {
    data: string
}

export default function LocationPreview({ data }: LocationPreviewProps) {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

    useEffect(() => {
        try {
            const parsed = JSON.parse(data)
            if (parsed.lat && parsed.lng) {
                setLocation(parsed)
            }
        } catch (error) {
            console.error("Error parsing location data:", error)
        }
    }, [data])

    if (!location) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-800/50 rounded-lg">
                <MapPin className="w-6 h-6 text-gray-400" />
            </div>
        )
    }

    return (
        <div className="w-full h-full relative bg-gray-800/50 rounded-lg overflow-hidden">
            <iframe
                src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
            />
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Lokasi
            </div>
        </div>
    )
}
