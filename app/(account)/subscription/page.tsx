"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, Crown, Download, Flame, Gift, Rocket, Shield } from 'lucide-react';
import * as React from 'react';

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

export default function Subscriptions() {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-950 relative overflow-hidden">
                {/* Enhanced Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-mint-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 right-1/3 w-32 h-32 md:w-64 md:h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
                    <div className="absolute top-3/4 left-1/2 w-24 h-24 md:w-48 md:h-48 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
                </div>
                <div className="relative z-10">
                    <section className='px-10 py-5 w-full overflow-y-auto'>
                        <div className="flex items-center flex-row gap-3 font-bold text-4xl">
                            <Shield />
                            <h3>
                                Kiddy Goo
                            </h3>
                        </div>
                    </section>

                    <section className="px-10 w-full">
                        <div className="relative flex flex-col gap-4 items-center min-h-screen justify-center">
                            <div className='flex flex-row gap-2 items-center'>
                                <h4 className='text-5xl font-bold'>
                                    Kiddy Goo
                                </h4>
                                <div className="rounded-lg shadow-lg bg-gradient-to-tr from-slate-700 via-gray-800 to-emerald-500 p-2 shadow-emerald-600/30">
                                    <Shield className='w-8 h-8' />
                                </div>
                                <h4 className='text-5xl font-bold text-emerald-500'>Parent Package</h4>
                            </div>

                            <div className="text-center w-4xl text-slate-300">
                                <p className='capitalize'>Lindungi dan pantau si kecil dengan cara yang lebih cerdas. Berlangganan <b>Kiddy Goo</b> dan buka akses ke fitur <b>monitoring Child</b> terlengkap. Dapatkan kontrol penuh, informasi akurat, dan yang terpenting, ketenangan hati. Ayo bergabung dengan ribuan orang tua cerdas lainnya!</p>
                            </div>

                            <section id="pricing" className="container mx-auto px-4 md:px-8 py-12 md:py-20">
                                <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
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
                                </div>
                            </section>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}