"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Ghost } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden flex items-center justify-center p-6">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

            <div className="relative z-10 text-center space-y-6 max-w-md">
                <Ghost className="w-20 h-20 text-emerald-400 mx-auto" />
                <h1 className="text-5xl font-bold text-white">404</h1>
                <p className="text-gray-400">
                    Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan.
                </p>
                <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
                    <Link href="/">Kembali ke Beranda</Link>
                </Button>
            </div>
        </div>
    )
}
