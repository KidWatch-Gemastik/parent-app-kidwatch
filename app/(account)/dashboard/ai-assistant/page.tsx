import Link from "next/link"
import AIAssistant from "./components/AiAssistant"
import { ArrowLeft } from "lucide-react"

export default function AssistantPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

            <div className="relative z-10">
                {/* Header with back button */}
                <header className="border-b border-emerald-500/20 bg-gray-900/80 backdrop-blur-xl">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-xl font-bold text-emerald-400">AI Assistant</h1>
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 flex flex-row gap-2 items-center rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors hover:scale-105"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Kembali ke Dashboard</span>
                                <span className="sm:hidden">Kembali</span>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="h-screen">
                    <AIAssistant />
                </main>
            </div>
        </div>
    )
}
