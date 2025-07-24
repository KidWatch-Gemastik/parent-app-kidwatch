"use client"

import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Shield, Mail, Phone, CheckCircle, AlertCircle, Loader2, Sparkles, UserPlus, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AuthError } from '@supabase/supabase-js'

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [emailOrPhone, setEmailOrPhone] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [alert, setAlert] = useState<{
        type: "success" | "error" | null
        message: string
    }>({ type: null, message: "" })
    const router = useRouter()

    const showAlert = (type: "success" | "error", message: string) => {
        setAlert({ type, message })
        setTimeout(() => setAlert({ type: null, message: "" }), 5000)
    }

    const handleRegister = async () => {
        if (!name.trim()) {
            showAlert("error", "Mohon masukkan nama lengkap")
            return
        }
        if (!emailOrPhone.trim()) {
            showAlert("error", "Mohon masukkan email atau nomor HP")
            return
        }

        setIsLoading(true)
        setAlert({ type: null, message: "" })

        const isPhone = emailOrPhone.startsWith("+") || /^[0-9]+$/.test(emailOrPhone)

        try {
            if (isPhone) {
                const { error: phoneError } = await supabase.auth.signInWithOtp({
                    phone: emailOrPhone,
                    options: {
                        shouldCreateUser: true,
                        data: { full_name: name },
                        channel: "whatsapp",
                    },
                })
                if (phoneError) throw phoneError
                showAlert("success", "Kode OTP telah dikirim via WhatsApp!")
            } else {
                if (!password.trim()) {
                    showAlert("error", "Mohon masukkan password")
                    return
                }
                const { error } = await supabase.auth.signUp({
                    email: emailOrPhone,
                    password,
                    options: {
                        data: { full_name: name },
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                })
                if (error) throw error
                showAlert("success", "Silakan cek email Anda untuk konfirmasi akun!")
                setTimeout(() => router.push("/login"), 2000)
            }
        } catch (err) {
            const error = err as AuthError
            showAlert("error", error?.message || "Terjadi kesalahan saat mendaftar")
        } finally {
            setIsLoading(false)
        }
    }

    const handleOAuth = async (provider: "google" | "facebook") => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            })
            if (error) showAlert("error", error.message)
        } catch {
            showAlert("error", "Terjadi kesalahan saat mendaftar. Silakan coba lagi.")
        }
    }

    const isPhone = emailOrPhone.startsWith("+") || /^[0-9]+$/.test(emailOrPhone)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-mint-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-3rem)]">
                    <div className="flex flex-col justify-center">
                        <div className="max-w-sm mx-auto w-full">
                            {/* Logo and Brand */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-xl mb-4 shadow-xl">
                                    <Shield className="w-7 h-7 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-mint-300 to-emerald-500 bg-clip-text text-transparent mb-1">
                                    KidsWatch
                                </h1>
                                <p className="text-gray-400 text-sm font-light flex items-center justify-center gap-1">
                                    <Sparkles className="w-3 h-3 text-emerald-400" />
                                    Bergabung dengan kami
                                    <Sparkles className="w-3 h-3 text-emerald-400" />
                                </p>
                            </div>

                            <Card className="border border-emerald-500/20 shadow-xl bg-gray-900/80 backdrop-blur-xl relative overflow-hidden">
                                {/* Card Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-mint-500/5 pointer-events-none"></div>

                                <CardHeader className="space-y-1 pb-6 relative">
                                    <CardTitle className="text-xl font-bold text-center text-white">Buat Akun Baru</CardTitle>
                                    <CardDescription className="text-center text-gray-300 text-sm font-light">
                                        Daftar untuk mulai melindungi anak Anda
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-5 relative">
                                    {alert.type && (
                                        <Alert variant={alert.type === "error" ? "destructive" : "success"} className="backdrop-blur-sm">
                                            {alert.type === "error" ? (
                                                <AlertCircle className="h-4 w-4" />
                                            ) : (
                                                <CheckCircle className="h-4 w-4" />
                                            )}
                                            <AlertDescription className="text-sm">{alert.message}</AlertDescription>
                                        </Alert>
                                    )}

                                    <form
                                        className="space-y-4"
                                        onSubmit={(e) => {
                                            e.preventDefault()
                                            handleRegister()
                                        }}
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-gray-200 text-sm font-medium">
                                                Nama Lengkap
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Masukkan nama lengkap"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="h-11 text-sm border-gray-700 bg-gray-800/50 focus:border-emerald-500 focus:ring-emerald-500/30 focus:ring-1 text-white placeholder:text-gray-400 transition-all duration-300"
                                                disabled={isLoading}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="emailOrPhone" className="text-gray-200 text-sm font-medium">
                                                Email atau Nomor HP
                                            </Label>
                                            <div className="relative group">
                                                <Input
                                                    id="emailOrPhone"
                                                    placeholder="nama@email.com atau +628123456789"
                                                    value={emailOrPhone}
                                                    onChange={(e) => setEmailOrPhone(e.target.value)}
                                                    className="pl-10 h-11 text-sm border-gray-700 bg-gray-800/50 focus:border-emerald-500 focus:ring-emerald-500/30 focus:ring-1 text-white placeholder:text-gray-400 transition-all duration-300"
                                                    disabled={isLoading}
                                                />
                                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 group-focus-within:text-emerald-400">
                                                    {emailOrPhone.includes("@") ? (
                                                        <Mail className="h-4 w-4 text-gray-400" />
                                                    ) : (
                                                        <Phone className="h-4 w-4 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {!isPhone && (
                                            <div className="space-y-2">
                                                <Label htmlFor="password" className="text-gray-200 text-sm font-medium">
                                                    Password
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Masukkan password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="pr-10 h-11 text-sm border-gray-700 bg-gray-800/50 focus:border-emerald-500 focus:ring-emerald-500/30 focus:ring-1 text-white placeholder:text-gray-400 transition-all duration-300"
                                                        disabled={isLoading}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-gray-400" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            variant={'ghost'}
                                            className="w-full h-11 text-sm bg-gradient-to-r from-emerald-500 to-emerald-500 hover:from-emerald-600 hover:to-mint-600 text-white font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-[1.01]"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="mr-2 h-4 w-4" />
                                                    Daftar Sekarang
                                                </>
                                            )}
                                        </Button>
                                    </form>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <Separator className="w-full bg-gray-700" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-gray-900 px-3 text-gray-400 font-medium">atau daftar dengan</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <Button
                                            variant="outline"
                                            className="w-full h-12 text-sm px-4 py-2 border border-gray-700 bg-gray-800/60 hover:bg-gray-700/50 text-white font-medium transition-all duration-300 hover:border-emerald-500/60 rounded-xl flex items-center justify-center gap-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleOAuth("google")}
                                            disabled={isLoading}
                                        >
                                            <Image
                                                src="/source/icons/google.svg"
                                                alt="Google Login"
                                                width={20}
                                                height={20}
                                                className="w-5 h-5"
                                            />
                                            Masuk dengan Google
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full h-12 text-sm px-4 py-2 border border-gray-700 bg-gray-800/60 hover:bg-gray-700/50 text-white font-medium transition-all duration-300 hover:border-emerald-500/60 rounded-xl flex items-center justify-center gap-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleOAuth("facebook")}
                                            disabled={isLoading}
                                        >
                                            <Image
                                                src="/source/icons/facebook.svg"
                                                alt="Facebook Login"
                                                width={20}
                                                height={20}
                                                className="w-5 h-5"
                                            />
                                            Masuk dengan Facebook
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="text-center mt-6 text-gray-400">
                                <p className="text-sm font-light">
                                    Sudah punya akun?{" "}
                                    <Link
                                        href='/login'
                                        className="px-0 text-emerald-400 hover:text-emerald-300 text-sm h-auto font-medium transition-colors duration-300"
                                        onClick={() => router.push("/login")}
                                    >
                                        Masuk di sini
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-col justify-center items-center">
                        <div className="relative w-full max-w-md">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-mint-500/10 rounded-2xl transform rotate-3 blur-xl"></div>

                            <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-emerald-500/20">
                                <Image
                                    src="/placeholder.svg?height=300&width=300&text=Family+Registration+Safety"
                                    alt="Keluarga mendaftar untuk keamanan digital"
                                    width={300}
                                    height={300}
                                    className="w-full h-60 object-cover rounded-xl shadow-lg"
                                />
                                <div className="mt-5 text-center">
                                    <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-emerald-400 to-mint-400 bg-clip-text text-transparent">
                                        Mulai Perjalanan Keamanan Digital
                                    </h3>
                                    <p className="text-gray-300 font-light leading-relaxed text-sm">
                                        Bergabunglah dengan ribuan orang tua yang telah mempercayai KidsWatch untuk melindungi anak-anak
                                        mereka.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Registration Benefits */}
                        <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
                            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-xl p-4 text-center border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group">
                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                    <UserPlus className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-white text-sm mb-1">Gratis Selamanya</h4>
                                <p className="text-gray-300 font-light text-xs">Fitur dasar tanpa biaya</p>
                            </div>
                            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-xl p-4 text-center border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group">
                                <div className="w-8 h-8 bg-gradient-to-r from-mint-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="w-4 h-4 text-white" />
                                </div>
                                <h4 className="font-semibold text-white text-sm mb-1">Setup Mudah</h4>
                                <p className="text-gray-300 font-light text-xs">Siap dalam 5 menit</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
