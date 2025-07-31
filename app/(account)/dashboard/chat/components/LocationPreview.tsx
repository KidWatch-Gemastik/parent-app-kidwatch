"use client"

export default function LocationPreview({ data }: { data: string }) {
    try {
        const { lat, lng } = JSON.parse(data)
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`

        return (
            <iframe
                src={mapsUrl}
                width="100%"
                height="100%"
                className="rounded-lg"
                loading="lazy"
                allowFullScreen
            />
        )
    } catch {
        return <p className="text-xs text-gray-300">Lokasi tidak valid</p>
    }
}
