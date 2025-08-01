"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Plus, Users, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/layouts/dashboardSidebar";
import DashboardHeader from "@/components/layouts/DashboardHeader";
import { ChildCard } from "./components/ChildCard";
import { AddChildModal } from "./components/AddChildModal";
import { EditChildModal } from "./components/EditChildModal";
import { DeleteChildModal } from "./components/DeleteChildModal";

import type { Child } from "@/types";
import { fetchChildrenFromServer } from "@/lib/actions/fetchChildren";
import { useChildren } from "@/hooks/useChildren";
import { useSupabase } from "@/providers/SupabaseProvider";

export default function ChildPage() {
    const router = useRouter();
    const initRef = useRef(false);

    const { session, supabase } = useSupabase(); // ✅ Ambil dari context
    const [children, setChildren] = useState<Child[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { children: freshChildren } = useChildren(session?.user.id || null);

    // ✅ Initial load
    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;

        const init = async () => {
            if (!session) {
                router.replace("/login");
                return;
            }

            const serverData = await fetchChildrenFromServer();
            setChildren(serverData);
            setIsLoading(false);
        };

        init();
    }, [router, session]);

    // ✅ Sync children dari hook
    useEffect(() => {
        if (freshChildren.length && session) {
            setChildren(freshChildren);
            setIsLoading(false);
        }
    }, [freshChildren, session]);

    const handleAddChild = async (child: Omit<Child, "id">) => {
        if (!session) return;
        const qr = uuidv4();

        const { data, error } = await supabase
            .from("children")
            .insert({
                parent_id: session.user.id,
                name: child.name,
                date_of_birth: child.date_of_birth,
                sex: child.sex,
                qr_code: qr,
            })
            .select()
            .single();

        if (error) {
            console.error("Gagal menambahkan anak:", error);
            return;
        }

        setChildren((prev) => [...prev, { ...child, id: data.id, qr_code: data.qr_code }]);
        setIsAddModalOpen(false);
    };

    const handleEditChild = async (updated: Child) => {
        if (!session) return;

        const { error } = await supabase
            .from("children")
            .update({
                name: updated.name,
                date_of_birth: updated.date_of_birth,
                sex: updated.sex,
            })
            .eq("id", updated.id)
            .eq("parent_id", session.user.id);

        if (error) {
            console.error("Gagal update anak:", error);
            return;
        }

        setChildren((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setIsEditModalOpen(false);
        setSelectedChild(null);
    };

    const handleDeleteChild = async (childId: string) => {
        if (!session) return;

        const { error } = await supabase
            .from("children")
            .delete()
            .eq("id", childId)
            .eq("parent_id", session.user.id);

        if (error) {
            console.error("Gagal menghapus anak:", error);
            return;
        }

        setChildren((prev) => prev.filter((c) => c.id !== childId));
        setIsDeleteModalOpen(false);
        setSelectedChild(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

            <div className="relative z-10 flex">
                <DashboardSidebar />
                <main className="flex-1 p-6 space-y-8">
                    <DashboardHeader title="Manajemen Anak" />

                    <section className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-mint-300 bg-clip-text text-transparent flex items-center gap-2">
                                <Users className="w-6 h-6 text-emerald-400" />
                                Daftar Anak
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                <p className="text-gray-400 text-sm">Kelola profil anak-anak Anda</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white rounded-xl px-6 py-2 hover:scale-105"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Tambah Anak
                        </Button>
                    </section>

                    {isLoading ? (
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-40 bg-gray-800 rounded-xl animate-pulse border border-gray-700"
                                />
                            ))}
                        </section>
                    ) : children.length > 0 ? (
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {children.map((c) => (
                                <ChildCard
                                    key={c.id}
                                    child={c}
                                    onEdit={() => {
                                        setSelectedChild(c);
                                        setIsEditModalOpen(true);
                                    }}
                                    onDelete={() => {
                                        setSelectedChild(c);
                                        setIsDeleteModalOpen(true);
                                    }}
                                />
                            ))}
                        </section>
                    ) : (
                        <section className="flex flex-col items-center justify-center py-16">
                            <div className="text-center">
                                <Users className="w-16 h-16 text-emerald-400 mb-4" />
                                <p className="text-white text-lg mb-2">Belum Ada Anak Terdaftar</p>
                                <Button variant="ghost" onClick={() => setIsAddModalOpen(true)}>
                                    Tambah Anak Pertama
                                </Button>
                            </div>
                        </section>
                    )}
                </main>
            </div>

            {/* Modals */}
            <AddChildModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddChild}
            />
            <EditChildModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedChild(null);
                }}
                child={selectedChild}
                onSave={handleEditChild}
            />
            <DeleteChildModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedChild(null);
                }}
                child={selectedChild}
                onDelete={handleDeleteChild}
            />
        </div>
    );
}
