"use client";

import { SafeZoneCard } from "./SafeZoneCard";
import { AddSafeZoneModal } from "./AddSafeZoneModal";
import { EditSafeZoneModal } from "./EditSafeZoneModal";
import { DeleteSafeZoneModal } from "./DeleteSafeZoneModal";
import { Button } from "@/components/ui/button";
import { Plus, ShieldCheck, Sparkles } from "lucide-react";
import type { SafeZone, Child } from "@/types";
import { useState } from "react";
import { useSupabase } from "@/providers/SupabaseProvider";
import { fetchSafeZonesClient } from "@/hooks/safeZonesClient";

interface SafeZonesPageClientProps {
    initialSafeZones: SafeZone[];
    childrenList: Child[];
}

export function SafeZonesPageClient({ initialSafeZones, childrenList }: SafeZonesPageClientProps) {
    const { session, supabase } = useSupabase();
    const [safeZones, setSafeZones] = useState<SafeZone[]>(initialSafeZones);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedZone, setSelectedZone] = useState<SafeZone | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const refreshData = async () => {
        if (!session) return;
        setIsLoading(true);

        const updatedSafeZones = await fetchSafeZonesClient(supabase, session.user.id);
        console.log("Fetched safe zones:", updatedSafeZones);
        setSafeZones(updatedSafeZones);
        setIsLoading(false);
    };

    return (
        <>
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-mint-300 bg-clip-text text-transparent flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                            Daftar Zona Aman
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <p className="text-gray-400 text-sm">Kelola area aman untuk anak-anak Anda</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white hover:from-emerald-600 hover:to-mint-600 rounded-xl shadow-lg px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah Zona Aman
                    </Button>
                </div>
            </section>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-64 bg-gray-900/80 backdrop-blur-xl border-emerald-500/30 shadow-xl rounded-xl"
                        />
                    ))}
                </div>
            ) : safeZones.length > 0 ? (
                <section className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {safeZones.map((zone) => (
                            <SafeZoneCard
                                key={zone.id}
                                zone={zone}
                                onEdit={(z) => { setSelectedZone(z); setIsEditModalOpen(true); }}
                                onDelete={(z) => { setSelectedZone(z); setIsDeleteModalOpen(true); }}
                            />
                        ))}
                    </div>
                </section>
            ) : (
                <section className="flex flex-col items-center justify-center py-16">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-gradient-to-r from-emerald-500/20 to-mint-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Belum Ada Zona Aman Terdaftar</h3>
                        <p className="text-gray-400 mb-6">Mulai dengan menambahkan zona aman pertama Anda</p>
                        <Button
                            variant="ghost"
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white hover:from-emerald-600 hover:to-mint-600 rounded-xl shadow-lg px-6 py-3 font-semibold"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Tambah Zona Aman Pertama
                        </Button>
                    </div>
                </section>
            )}

            {/* Modals */}
            <AddSafeZoneModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={refreshData}
                childrenList={childrenList}
            />

            <EditSafeZoneModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setSelectedZone(null); }}
                zone={selectedZone}
                onSave={refreshData}
                childrenList={childrenList}
            />

            <DeleteSafeZoneModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setSelectedZone(null); }}
                zone={selectedZone}
                onDelete={refreshData}
            />
        </>
    );
}
