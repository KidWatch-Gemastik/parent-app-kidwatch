"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Shield,
    MapPin,
    MessageCircle,
    BarChart3,
    Bot,
    Star,
    CheckCircle,
    ArrowRight,
    Play,
    Heart,
    Zap,
    Download,
    Globe,
    Lock,
    Sparkles,
    Phone,
    Rocket,
    Target,
    Smartphone,
    Wifi,
    TrendingUp,
    Headphones,
    Gift,
    Crown,
    Flame,
    CloudLightningIcon as Lightning,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export default function KiddyGooLanding() {
    const [activeFeature, setActiveFeature] = useState(0)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0])
    const [isVisible, setIsVisible] = useState(false)
    const statsRef = useRef<HTMLDivElement>(null)

    const currentYear = new Date().getFullYear();

    const features = [
        {
            icon: Bot,
            title: "AI Assistant Cerdas",
            description:
                "Asisten AI yang membantu menganalisis aktivitas digital anak dan memberikan rekomendasi keamanan real-time",
            color: "from-purple-500 to-pink-500",
            image: "/placeholder.svg?height=300&width=400&text=AI+Assistant+Dashboard",
            badge: "🤖 AI Powered",
            stats: "99.8% Akurasi",
        },
        {
            icon: MapPin,
            title: "Location Tracking Real-time",
            description:
                "Pantau lokasi anak secara real-time dengan akurasi GPS tinggi, geofencing, dan notifikasi zona aman",
            color: "from-emerald-500 to-mint-500",
            image: "/placeholder.svg?height=300&width=400&text=GPS+Tracking+Map",
            badge: "📍 GPS Precision",
            stats: "±3m Akurasi",
        },
        {
            icon: MessageCircle,
            title: "Chat & Video Call",
            description: "Komunikasi langsung dengan anak melalui chat yang aman, video call HD, dan voice messages",
            color: "from-blue-500 to-cyan-500",
            image: "/placeholder.svg?height=300&width=400&text=Video+Chat+Interface",
            badge: "💬 HD Quality",
            stats: "24/7 Available",
        },
        {
            icon: BarChart3,
            title: "Analytics & Insights",
            description:
                "Dashboard analytics lengkap dengan AI insights, trend analysis, dan laporan detail aktivitas harian",
            color: "from-indigo-500 to-purple-500",
            image: "/placeholder.svg?height=300&width=400&text=Analytics+Dashboard",
            badge: "📊 Smart Analytics",
            stats: "50+ Metrics",
        },
    ]

    const testimonials = [
        {
            name: "Sarah Wijaya",
            role: "Ibu dari 2 anak",
            avatar: "/placeholder.svg?height=60&width=60&text=SW",
            rating: 5,
            comment:
                "KiddyGoo memberikan ketenangan pikiran yang luar biasa. Saya bisa memantau anak-anak tanpa merasa invasif. Fitur AI-nya sangat membantu!",
            location: "Jakarta",
            verified: true,
        },
        {
            name: "Ahmad Rahman",
            role: "Ayah dari 3 anak",
            avatar: "/placeholder.svg?height=60&width=60&text=AR",
            rating: 5,
            comment:
                "Fitur AI Assistant sangat membantu memberikan insight tentang kebiasaan digital anak-anak saya. Location tracking-nya juga sangat akurat!",
            location: "Surabaya",
            verified: true,
        },
        {
            name: "Linda Sari",
            role: "Ibu tunggal",
            avatar: "/placeholder.svg?height=60&width=60&text=LS",
            rating: 5,
            comment:
                "Location tracking yang akurat membuat saya tenang saat anak pergi sekolah. Video call feature-nya juga crystal clear. Highly recommended!",
            location: "Bandung",
            verified: true,
        },
        {
            name: "Budi Santoso",
            role: "Ayah dari 1 anak",
            avatar: "/placeholder.svg?height=60&width=60&text=BS",
            rating: 5,
            comment:
                "Setup-nya super mudah, dalam 5 menit sudah bisa monitoring. Dashboard analytics-nya memberikan insights yang sangat valuable!",
            location: "Medan",
            verified: true,
        },
    ]

    const stats = [
        { number: 50000, label: "Keluarga Terlindungi", suffix: "+" },
        { number: 99.9, label: "Uptime Reliability", suffix: "%" },
        { number: 24, label: "Monitoring Aktif", suffix: "/7" },
        { number: 4.9, label: "Rating Pengguna", suffix: "★" },
    ]

    const pricingPlans = [
        {
            name: "Basic",
            price: "Gratis",
            period: "selamanya",
            description: "Untuk keluarga dengan 1 anak",
            features: ["1 Anak", "Location Tracking", "Basic Chat", "Screen Time Monitoring", "Email Support"],
            color: "from-gray-500 to-gray-600",
            popular: false,
        },
        {
            name: "Family",
            price: "99K",
            period: "/bulan",
            description: "Untuk keluarga dengan hingga 3 anak",
            features: ["3 Anak", "AI Assistant", "Video Call HD", "Advanced Analytics", "Geofencing", "Priority Support"],
            color: "from-emerald-500 to-mint-500",
            popular: true,
        },
        {
            name: "Premium",
            price: "199K",
            period: "/bulan",
            description: "Untuk keluarga besar dengan fitur lengkap",
            features: [
                "Unlimited Anak",
                "AI Assistant Pro",
                "4K Video Call",
                "Real-time Alerts",
                "Custom Reports",
                "24/7 Phone Support",
                "Family Dashboard",
            ],
            color: "from-purple-500 to-pink-500",
            popular: false,
        },
    ]

    const floatingIcons = [
        { icon: Shield, color: "text-emerald-400", delay: 0 },
        { icon: Heart, color: "text-pink-400", delay: 1000 },
        { icon: Sparkles, color: "text-yellow-400", delay: 2000 },
        { icon: Zap, color: "text-blue-400", delay: 3000 },
        { icon: Star, color: "text-purple-400", delay: 4000 },
        { icon: Crown, color: "text-orange-400", delay: 5000 },
    ]

    // Mouse tracking effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    // Animated stats counter
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 },
        )

        if (statsRef.current) {
            observer.observe(statsRef.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (isVisible) {
            stats.forEach((stat, index) => {
                let start = 0
                const end = stat.number
                const duration = 2000
                const increment = end / (duration / 16)

                const timer = setInterval(() => {
                    start += increment
                    if (start >= end) {
                        start = end
                        clearInterval(timer)
                    }
                    setAnimatedStats((prev) => {
                        const newStats = [...prev]
                        newStats[index] = start
                        return newStats
                    })
                }, 16)
            })
        }
    }, [isVisible])

    // Auto-rotate features
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [features.length])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-950 relative overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mint-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
                <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>

                {/* Floating particles */}
                {floatingIcons.map((item, index) => (
                    <div
                        key={index}
                        className={cn("absolute w-8 h-8 opacity-20 animate-bounce", item.color)}
                        style={{
                            left: `${10 + index * 15}%`,
                            top: `${20 + index * 10}%`,
                            animationDelay: `${item.delay}ms`,
                            animationDuration: `${3000 + index * 500}ms`,
                        }}
                    >
                        <item.icon className="w-full h-full" />
                    </div>
                ))}
            </div>

            {/* Mouse follower effect */}
            <div
                className="fixed w-4 h-4 bg-emerald-400/30 rounded-full blur-sm pointer-events-none z-50 transition-all duration-100"
                style={{
                    left: mousePosition.x - 8,
                    top: mousePosition.y - 8,
                }}
            />

            <div className="relative z-10">

                {/* Enhanced Hero Section */}
                <section className="container mx-auto px-20 py-20 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left relative">
                            {/* Floating badges */}
                            <div className="absolute -top-10 -left-10 animate-bounce delay-1000">
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                    <Crown className="w-3 h-3 mr-1" />
                                    #1 Parental Control
                                </Badge>
                            </div>
                            <div className="absolute -top-5 -right-5 animate-bounce delay-2000">
                                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                                    <Flame className="w-3 h-3 mr-1" />
                                    Trending
                                </Badge>
                            </div>

                            <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 animate-pulse">
                                <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                                Pengawasan Anak Era Digital
                            </Badge>

                            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                                <span className="text-white">Lindungi Anak Anda di</span>{" "}
                                <span className="bg-gradient-to-r from-emerald-400 via-mint-300 to-emerald-500 bg-clip-text text-transparent animate-pulse">
                                    Dunia Digital
                                </span>
                                <div className="inline-block ml-2 animate-bounce">🛡️</div>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                KiddyGoo memberikan solusi pengawasan anak yang cerdas dan aman dengan teknologi{" "}
                                <span className="text-emerald-400 font-semibold">AI terdepan</span>. Pantau aktivitas digital anak tanpa
                                mengurangi privasi mereka.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white hover:from-emerald-600 hover:to-mint-600 shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 group"
                                >
                                    <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                                    Download Gratis
                                    <Lightning className="w-4 h-4 ml-2 animate-pulse" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 backdrop-blur-sm bg-transparent hover:scale-105 transition-all duration-300 group"
                                >
                                    <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                                    Lihat Demo
                                </Button>
                            </div>

                            <div className="flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-400">
                                <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                                    <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
                                    <span>Gratis 30 hari</span>
                                </div>
                                <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                                    <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
                                    <span>Tanpa kartu kredit</span>
                                </div>
                                <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                                    <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
                                    <span>Setup 5 menit</span>
                                </div>
                            </div>

                            {/* Trust indicators */}
                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <Avatar key={i} className="w-8 h-8 border-2 border-emerald-500/30">
                                                <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i}`} />
                                                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white text-xs">
                                                    {i}
                                                </AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                    <div className="text-sm">
                                        <div className="text-white font-semibold">50K+ Keluarga</div>
                                        <div className="text-gray-400">Sudah bergabung</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            {/* Floating elements around the main card */}
                            <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-bounce delay-1000 flex items-center justify-center">
                                <Bot className="w-8 h-8 text-purple-400" />
                            </div>
                            <div className="absolute -top-5 -right-5 w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-mint-500/20 rounded-full animate-bounce delay-2000 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div className="absolute -bottom-10 -left-5 w-18 h-18 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full animate-bounce delay-3000 flex items-center justify-center">
                                <MessageCircle className="w-7 h-7 text-blue-400" />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-mint-500/20 rounded-3xl transform rotate-3 blur-xl animate-pulse"></div>
                            <Card className="relative border border-emerald-500/20 shadow-2xl bg-gray-900/80 backdrop-blur-xl overflow-hidden hover:scale-105 transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-mint-500/5"></div>
                                <CardContent className="p-0 relative">
                                    <Image
                                        src="/placeholder.svg?height=400&width=600&text=KiddyGoo+Dashboard+Preview"
                                        alt="KiddyGoo Dashboard Preview"
                                        width={600}
                                        height={400}
                                        className="w-full h-auto rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>

                                    {/* Overlay stats */}
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>2 Anak Online
                                        </Badge>
                                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                            <Wifi className="w-3 h-3 mr-1" />
                                            Real-time
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Enhanced Stats Section */}
                <section ref={statsRef} className="container mx-auto px-16 py-16">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <Card
                                key={index}
                                className="border border-emerald-500/20 shadow-xl bg-gray-900/80 backdrop-blur-xl hover:scale-105 transition-all duration-300 group"
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-mint-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse">
                                        {index === 1 ? animatedStats[index].toFixed(1) : Math.floor(animatedStats[index])}
                                        {stat.suffix}
                                    </div>
                                    <div className="text-gray-400 text-sm lg:text-base">{stat.label}</div>
                                    <div className="mt-2 flex justify-center">
                                        <TrendingUp className="w-4 h-4 text-emerald-400 animate-bounce" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Enhanced Features Section */}
                <section id="features" className="container mx-auto px-16 py-20">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse">
                            <Zap className="w-3 h-3 mr-1 animate-spin" />
                            Fitur Unggulan
                        </Badge>
                        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                            Semua yang Anda Butuhkan untuk{" "}
                            <span className="bg-gradient-to-r from-emerald-400 to-mint-400 bg-clip-text text-transparent">
                                Melindungi Anak
                            </span>
                            <div className="inline-block ml-2 animate-bounce">🚀</div>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Teknologi canggih yang mudah digunakan untuk memberikan perlindungan terbaik bagi anak-anak Anda
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <Card
                                    key={index}
                                    className={cn(
                                        "border transition-all duration-500 cursor-pointer group hover:scale-105",
                                        activeFeature === index
                                            ? "border-emerald-500/50 bg-gray-900/80 backdrop-blur-xl shadow-xl shadow-emerald-500/10"
                                            : "border-gray-700/50 bg-gray-900/40 hover:border-emerald-500/30",
                                    )}
                                    onClick={() => setActiveFeature(index)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r shadow-lg group-hover:scale-110 transition-all duration-300",
                                                    feature.color,
                                                )}
                                            >
                                                <feature.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                                                    <Badge className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                                        {feature.badge}
                                                    </Badge>
                                                </div>
                                                <p className="text-gray-300 text-sm leading-relaxed mb-3">{feature.description}</p>
                                                <div className="flex items-center gap-2">
                                                    <Target className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-xs text-emerald-400 font-semibold">{feature.stats}</span>
                                                </div>
                                            </div>
                                            <ArrowRight
                                                className={cn(
                                                    "w-5 h-5 transition-all duration-300",
                                                    activeFeature === index
                                                        ? "text-emerald-400 transform translate-x-1 animate-pulse"
                                                        : "text-gray-500",
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-mint-500/10 rounded-2xl transform -rotate-3 blur-xl animate-pulse"></div>
                            <Card className="relative border border-emerald-500/20 shadow-2xl bg-gray-900/80 backdrop-blur-xl overflow-hidden hover:scale-105 transition-all duration-500">
                                <CardContent className="p-0">
                                    <Image
                                        src={features[activeFeature].image || "/placeholder.svg"}
                                        alt={features[activeFeature].title}
                                        width={500}
                                        height={400}
                                        className="w-full h-80 object-cover transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>

                                    {/* Feature overlay */}
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                        <Badge className="bg-gray-900/80 text-white border-emerald-500/30 backdrop-blur-sm">
                                            {features[activeFeature].badge}
                                        </Badge>
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse delay-200"></div>
                                            <div className="w-3 h-3 bg-mint-400 rounded-full animate-pulse delay-400"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Enhanced Pricing Section */}
                <section id="pricing" className="container mx-auto px-4 py-20">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse">
                            <Crown className="w-3 h-3 mr-1" />
                            Paket Berlangganan
                        </Badge>
                        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                            Pilih Paket yang{" "}
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Tepat untuk Keluarga
                            </span>
                            <div className="inline-block ml-2 animate-bounce">💎</div>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Mulai gratis dan upgrade kapan saja. Semua paket dilengkapi dengan jaminan uang kembali 30 hari
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <Card
                                key={index}
                                className={cn(
                                    "border shadow-xl backdrop-blur-xl relative overflow-hidden hover:scale-105 transition-all duration-500 group",
                                    plan.popular
                                        ? "border-emerald-500/50 bg-gray-900/80 shadow-emerald-500/10 scale-105"
                                        : "border-gray-700/50 bg-gray-900/60 hover:border-emerald-500/30",
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 to-mint-500 text-white text-center py-2 text-sm font-semibold">
                                        <Flame className="w-4 h-4 inline mr-1 animate-bounce" />
                                        PALING POPULER
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-mint-500/5 pointer-events-none"></div>

                                <CardContent className={cn("p-8 relative", plan.popular && "pt-12")}>
                                    <div className="text-center mb-8">
                                        <div
                                            className={cn(
                                                "w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-r shadow-lg group-hover:scale-110 transition-all duration-300",
                                                plan.color,
                                            )}
                                        >
                                            {index === 0 && <Gift className="w-8 h-8 text-white" />}
                                            {index === 1 && <Crown className="w-8 h-8 text-white" />}
                                            {index === 2 && <Rocket className="w-8 h-8 text-white" />}
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                        <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

                                        <div className="mb-6">
                                            <span className="text-4xl font-bold text-white">{plan.price}</span>
                                            <span className="text-gray-400 ml-1">{plan.period}</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                                <span className="text-gray-300 text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        className={cn(
                                            "w-full transition-all duration-300 group-hover:scale-105",
                                            plan.popular
                                                ? "bg-gradient-to-r from-emerald-500 to-mint-500 text-white hover:from-emerald-600 hover:to-mint-600 shadow-lg hover:shadow-emerald-500/25"
                                                : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 bg-transparent",
                                            plan.popular ? "" : "variant-outline",
                                        )}
                                    >
                                        {plan.price === "Gratis" ? (
                                            <>
                                                <Download className="w-4 h-4 mr-2" />
                                                Mulai Gratis
                                            </>
                                        ) : (
                                            <>
                                                <Rocket className="w-4 h-4 mr-2" />
                                                Pilih Paket
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-gray-400 mb-4">Butuh paket khusus untuk perusahaan?</p>
                        <Button
                            variant="outline"
                            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 bg-transparent"
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            Hubungi Sales
                        </Button>
                    </div>
                </section>

                {/* Enhanced Testimonials Section */}
                <section id="testimonials" className="container mx-auto px-10 py-20">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse">
                            <Heart className="w-3 h-3 mr-1 animate-pulse" />
                            Testimoni
                        </Badge>
                        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                            Dipercaya oleh{" "}
                            <span className="bg-gradient-to-r from-emerald-400 to-mint-400 bg-clip-text text-transparent">
                                Ribuan Keluarga
                            </span>
                            <div className="inline-block ml-2 animate-bounce">❤️</div>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Dengarkan pengalaman orang tua yang telah merasakan ketenangan pikiran dengan KiddyGoo
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <Card
                                key={index}
                                className="border border-emerald-500/20 shadow-xl bg-gray-900/80 backdrop-blur-xl hover:scale-105 transition-all duration-500 group"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse"
                                                style={{ animationDelay: `${i * 100}ms` }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 mb-6 leading-relaxed text-sm">&rdquo;{testimonial.comment}&rdquo;</p>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-12 h-12 border-2 border-emerald-500/30 group-hover:scale-110 transition-all duration-300">
                                            <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                                            <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white">
                                                {testimonial.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                                                {testimonial.verified && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                                            </div>
                                            <p className="text-xs text-gray-400">{testimonial.role}</p>
                                            <p className="text-xs text-emerald-400">{testimonial.location}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <Avatar key={i} className="w-10 h-10 border-2 border-emerald-500/30">
                                        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${i}`} />
                                        <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white text-sm">
                                            {i}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                            <div className="text-left">
                                <div className="text-white font-semibold">50,000+ Keluarga Bahagia</div>
                                <div className="text-gray-400 text-sm">Rating rata-rata 4.9/5 ⭐</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Enhanced CTA Section */}
                <section className="container mx-auto px-10 py-20">
                    <Card className="border border-emerald-500/20 shadow-2xl bg-gradient-to-r from-gray-900/80 to-emerald-900/20 backdrop-blur-xl overflow-hidden relative hover:scale-105 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-mint-500/5"></div>

                        {/* Floating elements */}
                        <div className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-bounce delay-1000 flex items-center justify-center">
                            <Rocket className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="absolute top-20 right-20 w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-mint-500/20 rounded-full animate-bounce delay-2000 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                        </div>

                        <CardContent className="p-12 text-center relative">
                            <div className="max-w-4xl mx-auto">
                                <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse">
                                    <Lightning className="w-3 h-3 mr-1 animate-bounce" />
                                    Penawaran Terbatas
                                </Badge>

                                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                                    Mulai Melindungi Anak Anda{" "}
                                    <span className="bg-gradient-to-r from-emerald-400 to-mint-400 bg-clip-text text-transparent">
                                        Hari Ini Juga
                                    </span>
                                    <div className="inline-block ml-2 animate-bounce">🚀</div>
                                </h2>

                                <p className="text-xl text-gray-300 mb-8">
                                    Bergabunglah dengan <span className="text-emerald-400 font-semibold">50,000+</span> keluarga yang
                                    telah mempercayakan keamanan digital anak mereka kepada KiddyGoo
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white hover:from-emerald-600 hover:to-mint-600 shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 group"
                                    >
                                        <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                                        Download Sekarang
                                        <Badge className="ml-2 bg-white/20 text-white">GRATIS</Badge>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 bg-transparent hover:scale-105 transition-all duration-300"
                                    >
                                        <Play className="w-5 h-5 mr-2" />
                                        Pelajari Lebih Lanjut
                                    </Button>
                                </div>

                                <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
                                        <span>Setup dalam 5 menit</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
                                        <span>Dukungan 24/7</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
                                        <span>Jaminan uang kembali</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Enhanced Footer */}
                <footer className="border-t border-emerald-500/20 bg-gray-900/80 backdrop-blur-xl">
                    <div className="container mx-auto px-4 py-12">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-xl shadow-xl animate-pulse">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-mint-300 to-emerald-500 bg-clip-text text-transparent">
                                        KiddyGoo
                                    </h3>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">v1.0</Badge>
                                </div>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    Solusi pengawasan anak terdepan yang memberikan ketenangan pikiran bagi orang tua di era digital.
                                    Dengan teknologi AI canggih dan interface yang user-friendly.
                                </p>
                                <div className="flex gap-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-emerald-500/30 text-emerald-400 bg-transparent hover:bg-emerald-500/10 hover:scale-105 transition-all duration-300"
                                    >
                                        <Globe className="w-4 h-4 mr-2" />
                                        Website
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-emerald-500/30 text-emerald-400 bg-transparent hover:bg-emerald-500/10 hover:scale-105 transition-all duration-300"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Android
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-emerald-500/30 text-emerald-400 bg-transparent hover:bg-emerald-500/10 hover:scale-105 transition-all duration-300"
                                    >
                                        <Smartphone className="w-4 h-4 mr-2" />
                                        iOS
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <Rocket className="w-4 h-4 text-emerald-400" />
                                    Produk
                                </h4>
                                <ul className="space-y-2 text-gray-300">
                                    <li>
                                        <Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                            KiddyGoo Parent
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                                            <div className="w-2 h-2 bg-mint-400 rounded-full"></div>
                                            KiddyGoo Child
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                            AI Assistant
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                                            <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                                            Premium Features
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <Headphones className="w-4 h-4 text-emerald-400" />
                                    Dukungan
                                </h4>
                                <ul className="space-y-2 text-gray-300">
                                    <li>
                                        <Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            Pusat Bantuan
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            Panduan
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                            Kontak
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                            Status
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-emerald-500/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 text-sm">© {currentYear} KiddyGoo. Semua hak dilindungi. Made with ❤️ in Indonesia</p>
                            <div className="flex items-center gap-6 mt-4 md:mt-0">
                                <Link
                                    href="#"
                                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors hover:scale-105"
                                >
                                    Kebijakan Privasi
                                </Link>
                                <Link
                                    href="#"
                                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors hover:scale-105"
                                >
                                    Syarat Layanan
                                </Link>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Lock className="w-3 h-3 animate-pulse" />
                                    <span>Keamanan Terjamin</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
