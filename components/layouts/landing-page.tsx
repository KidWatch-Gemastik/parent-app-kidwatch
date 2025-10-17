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
    Sparkles,
    Phone,
    Rocket,
    Target,
    Wifi,
    TrendingUp,
    Crown,
    Flame,
    CloudLightningIcon as Lightning,
    CheckCheck,
    SquareArrowOutDownRightIcon,
    ScreenShare,
    ShieldCheckIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "./footer"
import { id } from "date-fns/locale"

export default function KiddyGooLanding() {
    const [activeFeature, setActiveFeature] = useState(0)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0])
    const [isVisible, setIsVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const statsRef = useRef<HTMLDivElement>(null)

    // Check if mobile
    useEffect(() => {
        const checkScreen = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            if (!mobile) {
                setShowMobileMenu(false)
            }
        }
        checkScreen()
        window.addEventListener("resize", checkScreen)
        return () => window.removeEventListener("resize", checkScreen)
    }, [])

    const features = [
        {
            icon: Bot,
            title: "AI Assistant Cerdas",
            description:
                "Asisten AI yang membantu menganalisis aktivitas digital anak dan memberikan rekomendasi keamanan real-time",
            color: "from-purple-500 to-pink-500",
            image: "/kiddygoo/ai-assistant.png?height=300&width=400&text=AI+Assistant+Dashboard",
            badge: "🤖 AI Powered",
            stats: "86.8% Akurasi",
            id: "ai-assistant",
        },
        {
            icon: MapPin,
            title: "Location Tracking Real-time",
            description:
                "Pantau lokasi anak secara real-time dengan akurasi GPS tinggi, geofencing, dan notifikasi zona aman",
            color: "from-emerald-500 to-mint-500",
            image: "/kiddygoo/location.png?height=300&width=400&text=GPS+Tracking+Map",
            badge: "📍 GPS Precision",
            stats: "±3m Akurasi",
            id: "location",
        },
        {
            icon: MessageCircle,
            title: "Realtime Chat",
            description: "Komunikasi langsung dengan anak melalui chat yang aman HD, dan voice messages",
            color: "from-blue-500 to-cyan-500",
            image: "/kiddygoo/chat.png?height=300&width=400&text=Chat+Interface",
            badge: "💬 HD Quality",
            stats: "24/7 Available",
            id: "chat",
        },
        {
            icon: BarChart3,
            title: "Analytics & Insights",
            description:
                "Dashboard analytics lengkap dengan AI insights, trend analysis, dan laporan detail aktivitas harian",
            color: "from-indigo-500 to-purple-500",
            image: "/kiddygoo/log.png?height=300&width=400&text=Analytics+Dashboard",
            badge: "📊 Smart Analytics",
            stats: "50+ Metrics",
            id: "analytics",
        },
        {
            icon: ScreenShare,
            title: "Screen Time Control",
            description:
                "Control Waktu layar dan aplikasi dengan jadwal fleksibel, serta fitur penjadwalan yang mudah",
            color: "from-indigo-500 to-purple-500",
            image: "/kiddygoo/management.png?height=300&width=400&text=ScreenTime+Control",
            badge: "🤳 Smart Control",
            stats: "Full Customization",
            id: "screen-time",
        },
        {
            icon: ShieldCheckIcon,
            title: "Location Safe Zone",
            description:
                "Tetapkan area aman untuk anak agar perangkat hanya dapat digunakan di lokasi tertentu. Dilengkapi dengan notifikasi saat keluar dari zona aman.",
            color: "from-green-500 to-emerald-500",
            image: "/kiddygoo/safe-zone.png?height=300&width=400&text=Location+Safe+Zone",
            badge: "🛰️ Geo Control",
            stats: "Smart Geofencing",
            id: "safety",

        },
    ]

    const testimonials = [
        {
            name: "Sarah Wijaya",
            role: "Ibu dari 2 anak",
            avatar: "?height=60&width=60&text=SW",
            rating: 5,
            comment:
                "KiddyGoo memberikan ketenangan pikiran yang luar biasa. Saya bisa memantau anak-anak tanpa merasa invasif. Fitur AI-nya sangat membantu!",
            location: "Jakarta",
            verified: true,
        },
        {
            name: "Ahmad Rahman",
            role: "Ayah dari 3 anak",
            avatar: "?height=60&width=60&text=AR",
            rating: 5,
            comment:
                "Fitur AI Assistant sangat membantu memberikan insight tentang kebiasaan digital anak-anak saya. Location tracking-nya juga sangat akurat!",
            location: "Surabaya",
            verified: true,
        },
        {
            name: "Linda Sari",
            role: "Ibu tunggal",
            avatar: "?height=60&width=60&text=LS",
            rating: 5,
            comment:
                "Location tracking yang akurat membuat saya tenang saat anak pergi sekolah. feature-nya juga crystal clear. Highly recommended!",
            location: "Bandung",
            verified: true,
        },
        {
            name: "Budi Santoso",
            role: "Ayah dari 1 anak",
            avatar: "?height=60&width=60&text=BS",
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

    // const pricingPlans = [
    //     {
    //         name: "Basic",
    //         price: "Gratis",
    //         period: "selamanya",
    //         description: "Untuk keluarga dengan 1 anak",
    //         features: ["1 Anak", "Location Tracking", "Basic Chat", "Screen Time Monitoring", "Email Support"],
    //         color: "from-gray-500 to-gray-600",
    //         popular: false,
    //     },
    //     {
    //         name: "Family",
    //         price: "99K",
    //         period: "/bulan",
    //         description: "Untuk keluarga dengan hingga 3 anak",
    //         features: ["3 Anak", "AI Assistant", "Advanced Analytics", "Geofencing", "Priority Support"],
    //         color: "from-emerald-500 to-mint-500",
    //         popular: true,
    //     },
    //     {
    //         name: "Premium",
    //         price: "199K",
    //         period: "/bulan",
    //         description: "Untuk keluarga besar dengan fitur lengkap",
    //         features: [
    //             "Unlimited Anak",
    //             "AI Assistant Pro",
    //             "Real-time Alerts",
    //             "Custom Reports",
    //             "24/7 Phone Support",
    //             "Family Dashboard",
    //         ],
    //         color: "from-purple-500 to-pink-500",
    //         popular: false,
    //     },
    // ]

    const floatingIcons = [
        { icon: Shield, color: "text-emerald-400", delay: 0 },
        { icon: Heart, color: "text-pink-400", delay: 1000 },
        { icon: Sparkles, color: "text-yellow-400", delay: 2000 },
        { icon: Zap, color: "text-blue-400", delay: 3000 },
        { icon: Star, color: "text-purple-400", delay: 4000 },
        { icon: Crown, color: "text-orange-400", delay: 5000 },
    ]

    // Mouse tracking effect (desktop only)
    useEffect(() => {
        if (!isMobile) {
            const handleMouseMove = (e: MouseEvent) => {
                setMousePosition({ x: e.clientX, y: e.clientY })
            }
            window.addEventListener("mousemove", handleMouseMove)
            return () => window.removeEventListener("mousemove", handleMouseMove)
        }
    }, [isMobile])

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
                <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-mint-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-1/3 w-32 h-32 md:w-64 md:h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
                <div className="absolute top-3/4 left-1/2 w-24 h-24 md:w-48 md:h-48 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>

                {/* Floating particles - hidden on mobile */}
                {!isMobile &&
                    floatingIcons.map((item, index) => (
                        <div
                            key={index}
                            className={cn("absolute w-6 h-6 md:w-8 md:h-8 opacity-20 animate-bounce", item.color)}
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

            {/* Mouse follower effect - desktop only */}
            {!isMobile && (
                <div
                    className="fixed w-4 h-4 bg-emerald-400/30 rounded-full blur-sm pointer-events-none z-50 transition-all duration-100"
                    style={{
                        left: mousePosition.x - 8,
                        top: mousePosition.y - 8,
                    }}
                />
            )}

            <div className="relative z-10">


                {/* Enhanced Hero Section */}
                <section className="container mx-auto px-4 md:px-8 lg:px-20 py-12 md:py-20 relative">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="text-center lg:text-left relative order-2 lg:order-1">
                            {/* Floating badges - hidden on mobile */}
                            {!isMobile && (
                                <>
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
                                </>
                            )}

                            <Badge className="mb-4 md:mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 animate-pulse">
                                <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                                Pengawasan Anak Era Digital
                            </Badge>

                            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                                <span className="text-white">Lindungi Anak Anda di</span>{" "}
                                <span className="bg-gradient-to-r from-emerald-400 via-mint-300 to-emerald-500 bg-clip-text text-transparent animate-pulse">
                                    Dunia Digital
                                </span>
                                <div className="inline-block ml-2 animate-bounce">🛡️</div>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 leading-relaxed px-4 lg:px-0">
                                KiddyGoo memberikan solusi pengawasan anak yang cerdas dan aman dengan teknologi{" "}
                                <span className="text-emerald-400 font-semibold">AI terdepan</span>. Pantau aktivitas digital anak tanpa
                                mengurangi privasi mereka.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8 px-4 lg:px-0">
                                <Button
                                    variant={'ghost'}
                                    size={isMobile ? "default" : "lg"}
                                    className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white hover:from-emerald-600 hover:to-mint-600 shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 group"
                                >
                                    <Download className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:animate-bounce" />
                                    Download Gratis
                                    <Lightning className="w-3 h-3 md:w-4 md:h-4 ml-2 animate-pulse" />
                                </Button>
                                <Button
                                    size={isMobile ? "default" : "lg"}
                                    variant="outline"
                                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 backdrop-blur-sm bg-transparent hover:scale-105 transition-all duration-300 group"
                                >
                                    <Play className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:animate-pulse" />
                                    Lihat Demo
                                </Button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-8 text-sm text-gray-400 px-4 lg:px-0">
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
                            <div className="mt-6 md:mt-8 flex items-center justify-center lg:justify-start gap-4 md:gap-6 px-4 lg:px-0">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <Avatar key={i} className="w-6 h-6 md:w-8 md:h-8 border-2 border-emerald-500/30">
                                                <AvatarImage src={`?height=32&width=32&text=${i}`} />
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

                        <div className="relative order-1 lg:order-2">
                            {/* Floating elements around the main card - hidden on mobile */}
                            {!isMobile && (
                                <>
                                    <div className="absolute -top-10 -left-10 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-bounce delay-1000 flex items-center justify-center">
                                        <Bot className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                                    </div>
                                    <div className="absolute -top-5 -right-5 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-emerald-500/20 to-mint-500/20 rounded-full animate-bounce delay-2000 flex items-center justify-center">
                                        <MapPin className="w-4 h-4 md:w-6 md:h-6 text-emerald-400" />
                                    </div>
                                    <div className="absolute -bottom-10 -left-5 w-14 h-14 md:w-18 md:h-18 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full animate-bounce delay-3000 flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 md:w-7 md:h-7 text-blue-400" />
                                    </div>
                                </>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-mint-500/20 rounded-3xl transform rotate-3 blur-xl animate-pulse"></div>
                            <Card className="relative border border-emerald-500/20 shadow-2xl bg-gray-900/80 backdrop-blur-xl overflow-hidden hover:scale-105 transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-mint-500/5"></div>
                                <CardContent className="p-0 relative">
                                    <Image
                                        src="/kiddygoo/Mockup.svg?height=400&width=600&text=KiddyGoo+Dashboard+Preview"
                                        alt="KiddyGoo Dashboard Preview"
                                        width={600}
                                        height={400}
                                        loading="eager"
                                        className="w-full h-auto rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>

                                    {/* Overlay stats */}
                                    <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 flex justify-between">
                                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full mr-1 md:mr-2 animate-pulse"></div>
                                            2 Anak Online
                                        </Badge>
                                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                            <Wifi className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                                            Real-time
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Enhanced Stats Section */}
                <section ref={statsRef} className="container mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-16">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {stats.map((stat, index) => (
                            <Card
                                key={index}
                                className="border border-emerald-500/20 shadow-xl bg-gray-900/80 backdrop-blur-xl hover:scale-105 transition-all duration-300 group"
                            >
                                <CardContent className="p-4 md:p-6 text-center">
                                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-mint-400 bg-clip-text text-transparent mb-2 group-hover:animate-pulse">
                                        {index === 1 ? animatedStats[index].toFixed(1) : Math.floor(animatedStats[index])}
                                        {stat.suffix}
                                    </div>
                                    <div className="text-gray-400 text-xs md:text-sm lg:text-base">{stat.label}</div>
                                    <div className="mt-2 flex justify-center">
                                        <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-emerald-400 animate-bounce" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Enhanced Features Section */}
                <section id="features" className="container mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-20">
                    <div className="text-center mb-12 md:mb-16">
                        <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse">
                            <Zap className="w-3 h-3 mr-1 animate-spin" />
                            Fitur Unggulan
                        </Badge>
                        <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4 md:mb-6 px-4">
                            Semua yang Anda Butuhkan untuk{" "}
                            <span className="bg-gradient-to-r from-emerald-400 to-mint-400 bg-clip-text text-transparent">
                                Melindungi Anak
                            </span>
                            <div className="inline-block ml-2 animate-bounce">🚀</div>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
                            Teknologi canggih yang mudah digunakan untuk memberikan perlindungan terbaik bagi anak-anak Anda
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="space-y-4 md:space-y-6">
                            {features.map((feature, index) => (
                                <Card
                                    id={feature.id}
                                    key={index}
                                    className={cn(
                                        "border transition-all duration-500 cursor-pointer group hover:scale-105",
                                        activeFeature === index
                                            ? "border-emerald-500/50 bg-gray-900/80 backdrop-blur-xl shadow-xl shadow-emerald-500/10"
                                            : "border-gray-700/50 bg-gray-900/40 hover:border-emerald-500/30",
                                    )}
                                    onClick={() => setActiveFeature(index)}
                                >
                                    <CardContent className="p-4 md:p-6">
                                        <div className="flex items-start gap-3 md:gap-4">
                                            <div
                                                className={cn(
                                                    "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-gradient-to-r shadow-lg group-hover:scale-110 transition-all duration-300",
                                                    feature.color,
                                                )}
                                            >
                                                <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-base md:text-lg font-semibold text-white">{feature.title}</h3>
                                                    <Badge className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hidden sm:inline-flex">
                                                        {feature.badge}
                                                    </Badge>
                                                </div>
                                                <p className="text-gray-300 text-sm leading-relaxed mb-3">{feature.description}</p>
                                                <div className="flex items-center gap-2">
                                                    <Target className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />
                                                    <span className="text-xs text-emerald-400 font-semibold">{feature.stats}</span>
                                                </div>
                                            </div>
                                            <ArrowRight
                                                className={cn(
                                                    "w-4 h-4 md:w-5 md:h-5 transition-all duration-300 shrink-0",
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
                                <CardContent className="p-0 w-full h-full">
                                    <Image
                                        src={features[activeFeature].image || "/placeholder.svg"}
                                        alt={features[activeFeature].title}
                                        width={500}
                                        height={400}
                                        className="w-full h-full object-contain transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>

                                    {/* Feature overlay */}
                                    <div className="absolute top-2 md:top-4 left-2 md:left-4 right-2 md:right-4 flex justify-between items-start">
                                        <Badge className="bg-gray-900/80 text-white border-emerald-500/30 backdrop-blur-sm text-xs">
                                            {features[activeFeature].badge}
                                        </Badge>
                                        <div className="flex gap-1 md:gap-2">
                                            <div className="w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 md:w-3 md:h-3 bg-emerald-400 rounded-full animate-pulse delay-200"></div>
                                            <div className="w-2 h-2 md:w-3 md:h-3 bg-mint-400 rounded-full animate-pulse delay-400"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Enhanced Pricing Section */}
                <section id="pricing" className="container mx-auto px-4 md:px-8 py-12 md:py-20">
                    <div className="text-center mb-12 md:mb-16">
                        <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse">
                            <Crown className="w-3 h-3 mr-1" />
                            Paket Berlangganan
                        </Badge>
                        <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4 md:mb-6 px-4">
                            Pilih Paket yang{" "}
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Tepat untuk Keluarga
                            </span>
                            <div className="inline-block ml-2 animate-bounce">💎</div>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
                            Mulai gratis dan upgrade kapan saja. Semua paket dilengkapi dengan jaminan uang kembali 30 hari
                        </p>
                    </div>

                    {/* <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <Card
                                key={index}
                                className={cn(
                                    "border shadow-xl backdrop-blur-xl relative overflow-hidden hover:scale-105 transition-all duration-500 group",
                                    plan.popular
                                        ? "border-emerald-500/50 bg-gray-900/80 shadow-emerald-500/10 md:scale-105"
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

                                <CardContent className={cn("p-6 md:p-8 relative", plan.popular && "pt-12")}>
                                    <div className="text-center mb-6 md:mb-8">
                                        <div
                                            className={cn(
                                                "w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-r shadow-lg group-hover:scale-110 transition-all duration-300",
                                                plan.color,
                                            )}
                                        >
                                            {index === 0 && <Gift className="w-6 h-6 md:w-8 md:h-8 text-white" />}
                                            {index === 1 && <Crown className="w-6 h-6 md:w-8 md:h-8 text-white" />}
                                            {index === 2 && <Rocket className="w-6 h-6 md:w-8 md:h-8 text-white" />}
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                        <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

                                        <div className="mb-6">
                                            <span className="text-3xl md:text-4xl font-bold text-white">{plan.price}</span>
                                            <span className="text-gray-400 ml-1">{plan.period}</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center gap-3">
                                                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0" />
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
                                        )}
                                        variant={plan.popular ? "ghost" : "outline"}
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
                    </div> */}

                    <div className="text-center mt-8 md:mt-12">
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
                <section id="testimonials" className="container mx-auto px-4 md:px-8 lg:px-10 py-12 md:py-20">
                    <div className="text-center mb-12 md:mb-16">
                        <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse">
                            <Heart className="w-3 h-3 mr-1 animate-pulse" />
                            Testimoni
                        </Badge>
                        <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4 md:mb-6 px-4">
                            Dipercaya oleh{" "}
                            <span className="bg-gradient-to-r from-emerald-400 to-mint-400 bg-clip-text text-transparent">
                                Ribuan Keluarga
                            </span>
                            <div className="inline-block ml-2 animate-bounce">❤️</div>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
                            Dengarkan pengalaman orang tua yang telah merasakan ketenangan pikiran dengan KiddyGoo
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {testimonials.map((testimonial, index) => (
                            <Card
                                key={index}
                                className="border border-emerald-500/20 shadow-xl bg-gray-900/80 backdrop-blur-xl hover:scale-105 transition-all duration-500 group"
                            >
                                <CardContent className="p-4 md:p-6">
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400 animate-pulse"
                                                style={{ animationDelay: `${i * 100}ms` }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 mb-4 md:mb-6 leading-relaxed text-sm">
                                        &rdquo;{testimonial.comment}&rdquo;
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10 md:w-12 md:h-12 border-2 border-emerald-500/30 group-hover:scale-110 transition-all duration-300">
                                            <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                                            <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white">
                                                {testimonial.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-white text-sm truncate">{testimonial.name}</p>
                                                {testimonial.verified && <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />}
                                            </div>
                                            <p className="text-xs text-gray-400 truncate">{testimonial.role}</p>
                                            <p className="text-xs text-emerald-400">{testimonial.location}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-8 md:mt-12">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <Avatar key={i} className="w-8 h-8 md:w-10 md:h-10 border-2 border-emerald-500/30">
                                        <AvatarImage src={`?height=40&width=40&text=${i}`} />
                                        <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white text-sm">
                                            {i}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                            <div className="text-center sm:text-left">
                                <div className="text-white font-semibold">50,000+ Keluarga Bahagia</div>
                                <div className="text-gray-400 text-sm">Rating rata-rata 4.9/5 ⭐</div>
                            </div>
                        </div>
                    </div>
                </section>



                <section className="container mx-auto px-4 md:px-10 py-12 md:py-20">
                    <div className="text-center">
                        <Badge className="mb-4 bg-violet-500/20 text-violet-400 border-violet-500/30 animate-pulse">
                            <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                            Ongoing Feature
                        </Badge>

                        <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4 md:mb-6 px-4">
                            Inovasi <span className="bg-gradient-to-r from-violet-400 to-rose-400 bg-clip-text text-transparent">
                                Terbaru
                            </span>{" "}
                            untuk <span className="bg-gradient-to-r from-emerald-400 to-mint-400 bg-clip-text text-transparent">
                                Keluarga Aman Digital
                            </span>
                            <div className="inline-block ml-2 animate-bounce">🚀</div>
                        </h2>

                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
                            Fitur-fitur cerdas yang sedang kami kembangkan untuk membantu orang tua
                            menjaga keseimbangan digital anak dengan cara yang aman, interaktif, dan menyenangkan.
                        </p>
                    </div>


                    {/* Ongoing Feature Section */}
                    <CardContent className="p-8 md:p-12 relative">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* Geofence */}
                            <div className="group p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 text-center shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.03] transition-all duration-300">
                                <Badge className="mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                    🛡️ Geofence
                                </Badge>
                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition">
                                    Geofence & Notifikasi Zona
                                </h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Orang tua set lokasi aman (rumah, sekolah, tempat les). <br />
                                    Mengirimkan notifikasi real-time bila anak masuk/keluar zona.
                                </p>
                                <div className="mt-6 flex items-center justify-center gap-2 text-emerald-400 font-medium text-sm animate-pulse">
                                    <CheckCheck className="w-4 h-4" />
                                    <span>Sudah Implementasi</span>
                                </div>
                            </div>

                            {/* Deteksi Pola Digital */}
                            <div className="group p-8 rounded-2xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/30 text-center shadow-lg hover:shadow-rose-500/30 hover:scale-[1.03] transition-all duration-300">
                                <Badge className="mb-4 bg-rose-500/20 text-rose-400 border-rose-500/30">
                                    ⚠️ Pola Digital
                                </Badge>
                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-rose-300 transition">
                                    Deteksi Pola Digital & Alert Overuse
                                </h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Monitor screen time anak. <br />
                                    Memberikan Alert ke orang tua bila ada pemakaian abnormal / berlebihan.
                                </p>
                                <div className="mt-6 flex items-center justify-center gap-2 text-rose-400 font-medium text-sm animate-bounce">
                                    <SquareArrowOutDownRightIcon className="w-4 h-4" />
                                    <span>On Going</span>
                                </div>
                            </div>

                            {/* Gamifikasi */}
                            <div className="group p-8 rounded-2xl bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent border border-violet-500/30 text-center shadow-lg hover:shadow-violet-500/30 hover:scale-[1.03] transition-all duration-300">
                                <Badge className="mb-4 bg-violet-500/20 text-violet-400 border-violet-500/30">
                                    🎮 Gamifikasi
                                </Badge>
                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-violet-300 transition">
                                    Gamifikasi Digital Sehat
                                </h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Anak dapat <span className="font-semibold text-violet-300">badge</span> atau <span className="font-semibold text-violet-300 mr-2">reward</span>
                                    Jika berhasil mengurangi screen time, atau lebih banyak membuka aplikasi edukasi.
                                </p>
                                <div className="mt-6 flex items-center justify-center gap-2 text-violet-400 font-medium text-sm animate-bounce">
                                    <SquareArrowOutDownRightIcon className="w-4 h-4" />
                                    <span>On Going</span>
                                </div>
                            </div>

                        </div>
                    </CardContent>
                </section>



                {/* Enhanced CTA Section */}
                <section className="container mx-auto px-4 md:px-8 lg:px-10 py-12 md:py-20">
                    <Card className="border border-emerald-500/20 shadow-2xl bg-gradient-to-r from-gray-900/80 to-emerald-900/20 backdrop-blur-xl overflow-hidden relative hover:scale-105 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-mint-500/5"></div>

                        {/* Floating elements - hidden on mobile */}
                        {!isMobile && (
                            <>
                                <div className="absolute top-10 left-10 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-bounce delay-1000 flex items-center justify-center">
                                    <Rocket className="w-4 h-4 md:w-6 md:h-6 text-purple-400" />
                                </div>
                                <div className="absolute top-20 right-20 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-emerald-500/20 to-mint-500/20 rounded-full animate-bounce delay-2000 flex items-center justify-center">
                                    <Sparkles className="w-3 h-3 md:w-5 md:h-5 text-emerald-400" />
                                </div>
                            </>
                        )}


                        <CardContent className="p-8 md:p-12 text-center relative">
                            <div className="max-w-4xl mx-auto">
                                <Badge className="mb-4 md:mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse">
                                    <Lightning className="w-3 h-3 mr-1 animate-bounce" />
                                    Penawaran Terbatas
                                </Badge>

                                <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4 md:mb-6 px-4">
                                    Mulai Melindungi Anak Anda{" "}
                                    <span className="bg-gradient-to-r from-emerald-400 to-mint-400 bg-clip-text text-transparent">
                                        Hari Ini Juga
                                    </span>
                                    <div className="inline-block ml-2 animate-bounce">🚀</div>
                                </h2>

                                <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 px-4">
                                    Bergabunglah dengan <span className="text-emerald-400 font-semibold">50,000+</span> keluarga yang
                                    telah mempercayakan keamanan digital anak mereka kepada KiddyGoo
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-6 md:mb-8 px-4">
                                    <Button
                                        variant={'ghost'}
                                        size={isMobile ? "default" : "lg"}
                                        className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white hover:from-emerald-600 hover:to-mint-600 shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 group"
                                    >
                                        <Download className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:animate-bounce" />
                                        Download Sekarang
                                        <Badge className="ml-2 bg-white/20 text-white">GRATIS</Badge>
                                    </Button>
                                    <Button
                                        size={isMobile ? "default" : "lg"}
                                        variant="outline"
                                        className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 bg-transparent hover:scale-105 transition-all duration-300"
                                    >
                                        <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                        Pelajari Lebih Lanjut
                                    </Button>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 text-sm text-gray-400 px-4">
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


                <Footer />

            </div>
        </div>
    )
}
