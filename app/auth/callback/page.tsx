"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { cn } from "@/lib/utils";

export default function AuthCallbackPage() {
    const router = useRouter();
    const { supabase } = useSupabase(); // ✅ ambil supabase client
    const [status, setStatus] = useState<"processing" | "success" | "error">(
        "processing"
    );
    const [message, setMessage] = useState("Memproses login...");

    const saveSessionToLocalStorage = (session: any) => {
        if (!session) return;
        try {
            localStorage.setItem("kidy-goo-auth", JSON.stringify(session));
        } catch (error) {
            console.error("Failed to save session:", error);
        }
    };

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (access_token && refresh_token) {
            setMessage("Mengatur sesi...");

            supabase.auth
                .setSession({
                    access_token,
                    refresh_token,
                })
                .then(({ error, data }) => {
                    if (error) {
                        console.error("Failed to set session", error);
                        setStatus("error");
                        setMessage("Gagal masuk. Mencoba lagi...");
                        setTimeout(() => {
                            router.replace("/login?error=invalid_or_expired");
                        }, 2000);
                    } else {
                        if (data.session) {
                            saveSessionToLocalStorage(data.session);
                        }
                        setStatus("success");
                        setMessage("Berhasil masuk! Mengarahkan...");
                        setTimeout(() => {
                            router.replace("/dashboard");
                        }, 1500);
                    }
                });
        } else {
            setStatus("error");
            setMessage("Token tidak valid. Mengarahkan...");
            setTimeout(() => {
                router.replace("/login?error=invalid_or_expired");
            }, 2000);
        }
    }, [router, supabase]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-mint-900/20 via-transparent to-transparent"></div>

                {/* Floating Orbs */}
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-mint-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            {/* Loading Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="text-center max-w-md w-full">
                    {/* Animated Logo */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 via-emerald-400 to-mint-500 rounded-3xl shadow-2xl flex items-center justify-center mx-auto transform hover:scale-105 transition-transform duration-300">
                            <Shield className="w-10 h-10 text-white drop-shadow-lg animate-pulse" />
                        </div>
                    </div>

                    {/* Brand Name */}
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 via-mint-200 to-emerald-400 bg-clip-text text-transparent mb-2 tracking-tight">
                        KiddyGoo
                    </h1>

                    {/* Status Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="text-gray-400 text-sm font-light">Mengamankan akses Anda</span>
                        <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                    </div>

                    {/* Loading Card */}
                    <div className="bg-gray-900/90 backdrop-blur-2xl rounded-2xl p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
                        {/* Card Background Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-mint-500/10 opacity-50"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent transform -skew-y-12 transition-transform duration-700"></div>

                        <div className="relative z-10">
                            {/* Status Icon */}
                            <div className="mb-6">
                                {status === "processing" && (
                                    <div className="w-16 h-16 mx-auto relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-full animate-spin">
                                            <div className="w-full h-full bg-gray-900 rounded-full m-1"></div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                                        </div>
                                    </div>
                                )}

                                {status === "success" && (
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-emerald-500 to-mint-500 rounded-full flex items-center justify-center animate-bounce">
                                        <CheckCircle className="w-8 h-8 text-white" />
                                    </div>
                                )}

                                {status === "error" && (
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                                        <Shield className="w-8 h-8 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Status Message */}
                            <h2 className="text-xl font-bold text-white mb-2">
                                {status === "processing" && "Memproses Login"}
                                {status === "success" && "Login Berhasil!"}
                                {status === "error" && "Terjadi Kesalahan"}
                            </h2>

                            <p className="text-gray-300 text-sm mb-6 leading-relaxed">{message}</p>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full bg-gradient-to-r transition-all duration-1000 ease-out",
                                        status === "processing" && "from-emerald-500 to-mint-500 w-2/3 animate-pulse",
                                        status === "success" && "from-emerald-400 to-mint-400 w-full",
                                        status === "error" && "from-red-500 to-orange-500 w-1/3",
                                    )}
                                ></div>
                            </div>

                            {/* Loading Dots */}
                            {status === "processing" && (
                                <div className="flex justify-center space-x-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                            )}

                            {/* Success Message */}
                            {status === "success" && (
                                <div className="text-emerald-400 text-sm font-medium">Selamat datang kembali! 🎉</div>
                            )}

                            {/* Error Message */}
                            {status === "error" && (
                                <div className="text-red-400 text-sm font-medium">Silakan coba lagi dalam beberapa saat</div>
                            )}
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-6 text-center">
                        <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-900/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700/50">
                            <Shield className="w-3 h-3 text-emerald-400" />
                            <span>Koneksi aman dengan enkripsi end-to-end</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-10 opacity-20">
                <div className="w-32 h-32 border border-emerald-500/20 rounded-full animate-spin-slow"></div>
            </div>
            <div className="absolute top-10 right-10 opacity-20">
                <div className="w-24 h-24 border border-mint-500/20 rounded-full animate-spin-slow delay-1000"></div>
            </div>
        </div>
    )
}
