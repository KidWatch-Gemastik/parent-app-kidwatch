"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wrench, Clock, ArrowLeft } from "lucide-react"

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto text-center">
                <Card className="p-8 md:p-12 shadow-lg">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                            <Wrench className="w-10 h-10 text-primary" />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                            Situs Sedang Dalam Pemeliharaan
                        </h1>

                        <p className="text-lg text-muted-foreground mb-8 text-pretty leading-relaxed">
                            Kami sedang melakukan pemeliharaan untuk meningkatkan pengalaman Anda. Silakan cek kembali dalam beberapa
                            saat.
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-muted rounded-lg">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">Estimasi selesai: 7 - 10 Oktober 2025.</span>
                    </div>

                    <div className="space-y-4">
                        <Button
                            size="lg"
                            className="w-full md:w-auto px-8 py-3 text-base font-medium"
                            onClick={() => window.location.reload()}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Muat Ulang Halaman
                        </Button>

                        <p className="text-sm text-muted-foreground">Atau kembali lagi nanti untuk menggunakan layanan kami</p>
                    </div>

                    <div className="mt-12 pt-6 border-t border-border">
                        <p className="text-sm text-muted-foreground">KiddyGoo AI Assistant - Terima kasih atas kesabaran Anda</p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
