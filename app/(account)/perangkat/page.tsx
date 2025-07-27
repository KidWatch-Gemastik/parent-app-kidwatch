"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Session } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import DashboardSidebar from "@/components/layouts/dashboardSidebar"
import DashboardHeader from "@/components/layouts/DashboardHeader"
import { ChildCard } from "./components/ChildCard"
import { AddChildModal } from "./components/AddChildModal"
import { EditChildModal } from "./components/EditChildModal"
import { DeleteChildModal } from "./components/DeleteChildModal"
import { Button } from "@/components/ui/button"
import { Plus, Users, Sparkles } from "lucide-react"

export type Child = {
    id: string
    name: string
    age: string
    gender: string
    avatar?: string
    status?: "online" | "offline"
    lastSeen?: string
}

export default function ChildPage() {
    const supabase = createClientComponentClient()
    const router = useRouter()
    const [session, setSession] = useState<Session | null>(null)
    const [children, setChildren] = useState<Child[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedChild, setSelectedChild] = useState<Child | null>(null)

    useEffect(() => {
        const getSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()
            if (!session) router.push("/login")
            else setSession(session)
        }
        getSession()
    }, [router, supabase])

    const handleAddChild = (child: Omit<Child, "id">) => {
        const newChild: Child = {
            ...child,
            id: Date.now().toString(),
            status: "offline",
            lastSeen: "Just now",
        }
        setChildren([...children, newChild])
        setIsAddModalOpen(false)
    }

    const handleEditChild = (updatedChild: Child) => {
        setChildren(children.map((child) => (child.id === updatedChild.id ? updatedChild : child)))
        setIsEditModalOpen(false)
        setSelectedChild(null)
    }

    const handleDeleteChild = (childId: string) => {
        setChildren(children.filter((child) => child.id !== childId))
        setIsDeleteModalOpen(false)
        setSelectedChild(null)
    }

    const openEditModal = (child: Child) => {
        setSelectedChild(child)
        setIsEditModalOpen(true)
    }

    const openDeleteModal = (child: Child) => {
        setSelectedChild(child)
        setIsDeleteModalOpen(true)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-mint-900/20 via-transparent to-transparent"></div>
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-mint-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
            </div>

            <div className="relative z-10 flex">
                <DashboardSidebar />
                <main className="flex-1 p-6 space-y-8">
                    <DashboardHeader title="Manajemen Anak" />

                    {/* Header Section */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-mint-300 bg-clip-text text-transparent flex items-center gap-2">
                                    <Users className="w-6 h-6 text-emerald-400" />
                                    Daftar Anak
                                </h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <Sparkles className="w-4 h-4 text-emerald-400" />
                                    <p className="text-gray-400 text-sm">Kelola profil anak-anak Anda dengan mudah</p>
                                </div>
                            </div>
                            <Button
                                variant='ghost'
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white hover:from-emerald-600 hover:to-mint-600 rounded-xl shadow-lg hover:shadow-emerald-500/25 px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Tambah Anak
                            </Button>
                        </div>
                    </section>

                    {/* Children Grid */}
                    {children.length > 0 ? (
                        <section className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {children.map((child) => (
                                    <ChildCard key={child.id} child={child} onEdit={openEditModal} onDelete={openDeleteModal} />
                                ))}
                            </div>
                        </section>
                    ) : (
                        <section className="flex flex-col items-center justify-center py-16">
                            <div className="text-center max-w-md">
                                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500/20 to-mint-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Belum Ada Anak Terdaftar</h3>
                                <p className="text-gray-400 mb-6">Mulai dengan menambahkan profil anak pertama Anda</p>
                                <Button
                                    variant='ghost'

                                    onClick={() => setIsAddModalOpen(true)}
                                    className="bg-gradient-to-r from-emerald-500 to-mint-500 text-white hover:from-emerald-600 hover:to-mint-600 rounded-xl shadow-lg hover:shadow-emerald-500/25 px-6 py-3 font-semibold"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Tambah Anak Pertama
                                </Button>
                            </div>
                        </section>
                    )}
                </main>
            </div>

            {/* Modals */}
            <AddChildModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddChild} />

            <EditChildModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setSelectedChild(null)
                }}
                child={selectedChild}
                onSave={handleEditChild}
            />

            <DeleteChildModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedChild(null)
                }}
                child={selectedChild}
                onDelete={handleDeleteChild}
            />
        </div>
    )
}
