"use client"

import type React from "react"
import Image from "next/image"
import {
    MapPin,
    Phone,
    MessageCircle,
    Camera,
    Video,
    Music,
    Clock,
    ExternalLink,
    Sparkles,
    AlertTriangle,
    CheckCircle,
    Copy,
} from "lucide-react"
import { useState } from "react"

interface MessageFormatterProps {
    message: string
    className?: string
}

export function MessageFormatter({ message, className = "" }: MessageFormatterProps) {
    const [copiedPhone, setCopiedPhone] = useState<string | null>(null)

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedPhone(text)
            setTimeout(() => setCopiedPhone(null), 2000)
        } catch (err) {
            console.error("Failed to copy: ", err)
        }
    }

    const formatMessage = (text: string) => {
        const parts: React.ReactNode[] = []

        // Split by lines first to handle different sections
        const lines = text.split("\n")

        lines.forEach((line, lineIndex) => {
            if (lineIndex > 0) {
                parts.push(<br key={`br-${lineIndex}`} />)
            }

            let lineIndex2 = 0

            const boldRegex = /\*\*\*?(.*?)\*\*\*?/g
            let lastBoldIndex = 0
            let boldMatch

            while ((boldMatch = boldRegex.exec(line)) !== null) {
                // Add text before bold
                if (boldMatch.index > lastBoldIndex) {
                    const beforeText = line.slice(lastBoldIndex, boldMatch.index)
                    parts.push(processLinks(beforeText, `${lineIndex}-${lineIndex2++}`))
                }

                // Add bold text
                parts.push(
                    <strong key={`bold-${lineIndex}-${lineIndex2++}`} className="font-bold text-emerald-300">
                        {boldMatch[1]}
                    </strong>,
                )

                lastBoldIndex = boldMatch.index + boldMatch[0].length
            }

            // Add remaining text after last bold
            if (lastBoldIndex < line.length) {
                const remainingText = line.slice(lastBoldIndex)
                parts.push(processLinks(remainingText, `${lineIndex}-${lineIndex2++}`))
            }

            // If no bold text was found, process the entire line
            if (lastBoldIndex === 0) {
                parts.pop() // Remove the empty part we might have added
                parts.push(processLinks(line, `${lineIndex}-${lineIndex2++}`))
            }
        })

        return parts
    }

    const processLinks = (text: string, key: string) => {
        const parts: React.ReactNode[] = []
        let currentIndex = 0

        // Regex hanya untuk nomor +62
        const phoneRegex = /\+62(?:\d[\s-]?){8,13}\d/g
        let phoneMatch

        while ((phoneMatch = phoneRegex.exec(text)) !== null) {
            // Teks sebelum nomor
            if (phoneMatch.index > currentIndex) {
                const beforeText = text.slice(currentIndex, phoneMatch.index)
                parts.push(processOtherLinks(beforeText, `${key}-before-${parts.length}`))
            }

            const phoneNumber = phoneMatch[0] // seperti +62 821-4517-5076
            const cleanPhone = phoneNumber.replace(/\s|-/g, "") // jadi +6282145175076

            parts.push(
                <div
                    key={`phone-${key}-${parts.length}`}
                    className="inline-flex items-center gap-2 bg-green-500/10 px-2 py-1 rounded-md"
                >
                    <Phone className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 font-medium">{phoneNumber}</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => copyToClipboard(phoneNumber)}
                            className="p-1 hover:bg-green-500/20 rounded transition-colors"
                            title="Copy nomor"
                        >
                            <Copy className={`w-3 h-3 ${copiedPhone === phoneNumber ? "text-green-300" : "text-gray-400"}`} />
                        </button>
                        <a
                            href={`tel:${cleanPhone}`}
                            className="p-1 hover:bg-green-500/20 rounded transition-colors"
                            title="Telepon"
                        >
                            <Phone className="w-3 h-3 text-green-400" />
                        </a>
                    </div>
                </div>,
            )

            currentIndex = phoneMatch.index + phoneMatch[0].length
        }

        // Teks setelah nomor
        if (currentIndex < text.length) {
            const remainingText = text.slice(currentIndex)
            parts.push(processOtherLinks(remainingText, `${key}-remaining`))
        }

        if (parts.length === 0) return processOtherLinks(text, key)
        return parts
    }




    const processOtherLinks = (text: string, key: string) => {
        const parts: React.ReactNode[] = []
        let currentIndex = 0

        const locationRegex = /\{"lat":(-?\d+\.?\d*),?"lng":(-?\d+\.?\d*)\}/g
        let locationMatch

        while ((locationMatch = locationRegex.exec(text)) !== null) {
            // Add text before location
            if (locationMatch.index > currentIndex) {
                const beforeText = text.slice(currentIndex, locationMatch.index)
                parts.push(processImages(beforeText, `${key}-before-${parts.length}`))
            }

            const lat = locationMatch[1]
            const lng = locationMatch[2]
            const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`

            // Add location link with icon
            parts.push(
                <a
                    key={`location-${key}-${parts.length}`}
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline transition-colors bg-blue-500/10 px-2 py-1 rounded-md"
                >
                    <MapPin className="w-4 h-4" />
                    Lihat Lokasi di Maps
                    <ExternalLink className="w-3 h-3" />
                </a>,
            )

            currentIndex = locationMatch.index + locationMatch[0].length
        }

        // Google Maps links (existing functionality)
        const mapsRegex = /(https:\/\/www\.google\.com\/maps\?q=[-\d.,]+)/g
        let mapsMatch

        while ((mapsMatch = mapsRegex.exec(text.slice(currentIndex))) !== null) {
            const actualIndex = currentIndex + mapsMatch.index

            // Add text before link
            if (actualIndex > currentIndex) {
                const beforeText = text.slice(currentIndex, actualIndex)
                parts.push(processImages(beforeText, `${key}-before-${parts.length}`))
            }

            // Add maps link with icon
            parts.push(
                <a
                    key={`maps-${key}-${parts.length}`}
                    href={mapsMatch[1]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline transition-colors bg-blue-500/10 px-2 py-1 rounded-md"
                >
                    <MapPin className="w-4 h-4" />
                    Lihat di Google Maps
                    <ExternalLink className="w-3 h-3" />
                </a>,
            )

            currentIndex = actualIndex + mapsMatch[0].length
        }

        // Add remaining text
        if (currentIndex < text.length) {
            const remainingText = text.slice(currentIndex)
            parts.push(processImages(remainingText, `${key}-remaining`))
        }

        // If no links found, process images
        if (parts.length === 0) {
            return processImages(text, key)
        }

        return parts
    }

    const processImages = (text: string, key: string) => {
        const parts: React.ReactNode[] = []
        let currentIndex = 0

        const mediaRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg|webm|mp4|mp3|wav)(?:\?[^\s]*)?)/gi
        let mediaMatch

        while ((mediaMatch = mediaRegex.exec(text)) !== null) {
            // Add text before media
            if (mediaMatch.index > currentIndex) {
                const beforeText = text.slice(currentIndex, mediaMatch.index)
                parts.push(addIcons(beforeText, `${key}-before-${parts.length}`))
            }

            const mediaUrl = mediaMatch[1]
            const isImage = /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(mediaUrl)
            const isVideo = /\.(webm|mp4)(\?|$)/i.test(mediaUrl)
            const isAudio = /\.(mp3|wav|webm)(\?|$)/i.test(mediaUrl)

            if (isImage) {
                // Add image
                parts.push(
                    <div key={`img-${key}-${parts.length}`} className="my-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Camera className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-gray-400">Gambar:</span>
                        </div>
                        <Image
                            src={mediaUrl || "/placeholder.svg"}
                            alt="Media dari anak"
                            width={200}
                            height={200}
                            className="rounded-lg border border-emerald-500/20 object-cover max-w-full h-auto"
                            unoptimized
                        />
                    </div>,
                )
            } else if (isVideo) {
                // Add video
                parts.push(
                    <div key={`video-${key}-${parts.length}`} className="my-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Video className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-gray-400">Video:</span>
                        </div>
                        <video
                            src={mediaUrl}
                            controls
                            className="rounded-lg border border-emerald-500/20 max-w-full h-auto"
                            style={{ maxWidth: "300px", maxHeight: "200px" }}
                        />
                    </div>,
                )
            } else if (isAudio) {
                // Add audio
                parts.push(
                    <div key={`audio-${key}-${parts.length}`} className="my-2">
                        <div className="flex items-center gap-2 mb-1">
                            <Music className="w-4 h-4 text-pink-400" />
                            <span className="text-sm text-gray-400">Audio:</span>
                        </div>
                        <audio src={mediaUrl} controls className="w-full max-w-xs" />
                    </div>,
                )
            } else {
                // Fallback for other media types
                parts.push(
                    <a
                        key={`media-${key}-${parts.length}`}
                        href={mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 underline transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Lihat Media
                    </a>,
                )
            }

            currentIndex = mediaMatch.index + mediaMatch[0].length
        }

        // Add remaining text
        if (currentIndex < text.length) {
            const remainingText = text.slice(currentIndex)
            parts.push(addIcons(remainingText, `${key}-remaining`))
        }

        // If no media found, add icons
        if (currentIndex === 0) {
            return addIcons(text, key)
        }

        return parts
    }

    const addIcons = (text: string, key: string) => {
        const iconMap = [
            { regex: /📍|lokasi|dimana|location/i, icon: MapPin, color: "text-blue-400" },
            { regex: /📞|panggilan|telepon|call/i, icon: Phone, color: "text-green-400" },
            { regex: /💬|pesan|chat|message|isi\s*:/i, icon: MessageCircle, color: "text-purple-400" },
            { regex: /🖼️|gambar|image|foto|jenis\s*:\s*pesan\s*teks/i, icon: Camera, color: "text-yellow-400" },
            { regex: /🎵|audio|suara|voice/i, icon: Music, color: "text-pink-400" },
            { regex: /🎬|video/i, icon: Video, color: "text-red-400" },
            { regex: /⏰|waktu|jam|terakhir|\[\d+\/\d+\/\d+,\s*\d+:\d+:\d+\]/i, icon: Clock, color: "text-gray-400" },
            { regex: /✅|aman|safe|tidak ada hal yang mencurigakan/i, icon: CheckCircle, color: "text-green-400" },
            { regex: /⚠️|bahaya|mencurigakan|luar|gagal/i, icon: AlertTriangle, color: "text-orange-400" },
            { regex: /🔎|analisis|hasil|ringkasan/i, icon: Sparkles, color: "text-emerald-400" },
        ]

        // Find matching icon
        const matchedIcon = iconMap.find((item) => item.regex.test(text))

        if (matchedIcon && text.trim()) {
            const IconComponent = matchedIcon.icon
            return (
                <span key={key} className="inline-flex items-start gap-1">
                    <IconComponent className={`w-4 h-4 mt-0.5 shrink-0 ${matchedIcon.color}`} />
                    <span>{text}</span>
                </span>
            )
        }

        return <span key={key}>{text}</span>
    }

    return <div className={className}>{formatMessage(message)}</div>
}
