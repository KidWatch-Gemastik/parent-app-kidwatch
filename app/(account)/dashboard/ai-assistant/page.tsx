import Link from "next/link";
import AIAssistant from "./components/AiAssistant";
import { ArrowLeft } from "lucide-react";

export default function AssistantPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
            <div className="relative z-10 flex">
                <main className="flex-1 p-6">
                    <div className="flex justify-end mb-4">
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 flex flex-row gap-2 items-center rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition"
                        >
                            <ArrowLeft /> Kembali ke Dashboard
                        </Link>
                    </div>
                    <AIAssistant />
                </main>
            </div>
        </div>
    );
}
