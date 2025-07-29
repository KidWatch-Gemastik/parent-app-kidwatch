"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Global Error:", error)
    }, [error])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden flex items-center justify-center p-6">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

            <div className="relative z-10 text-center space-y-6 max-w-md">
                <AlertTriangle className="w-20 h-20 text-red-500 mx-auto" />
                <h1 className="text-4xl font-bold text-white">Terjadi Kesalahan</h1>
                <p className="text-gray-400">{error.message || "Maaf, ada kesalahan pada aplikasi."}</p>
                <div className="flex justify-center gap-4 mt-4">
                    <Button onClick={reset} className="bg-emerald-500 hover:bg-emerald-600">
                        Coba Lagi
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/">Beranda</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
