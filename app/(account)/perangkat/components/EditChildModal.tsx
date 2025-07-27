"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Sparkles } from "lucide-react"
import type { Child } from "../page"

interface EditChildModalProps {
    isOpen: boolean
    onClose: () => void
    child: Child | null
    onSave: (child: Child) => void
}

export function EditChildModal({ isOpen, onClose, child, onSave }: EditChildModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
    })

    useEffect(() => {
        if (child) {
            setFormData({
                name: child.name,
                age: child.age,
                gender: child.gender,
            })
        }
    }, [child])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (child && formData.name && formData.age && formData.gender) {
            onSave({
                ...child,
                ...formData,
            })
        }
    }

    const handleClose = () => {
        setFormData({ name: "", age: "", gender: "" })
        onClose()
    }

    if (!child) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-emerald-500/30 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-3 text-xl">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-lg flex items-center justify-center">
                            <Edit className="h-4 w-4 text-white" />
                        </div>
                        <span>Edit Data Anak</span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        Perbarui informasi anak Anda
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-300">
                            Nama Lengkap
                        </Label>
                        <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Masukkan nama anak"
                            className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-age" className="text-sm font-semibold text-gray-300">
                            Usia
                        </Label>
                        <Input
                            id="edit-age"
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            placeholder="Masukkan usia anak"
                            className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                            min="1"
                            max="18"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-gender" className="text-sm font-semibold text-gray-300">
                            Jenis Kelamin
                        </Label>
                        <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                            <SelectTrigger className="bg-gray-800/60 border-gray-700 text-white focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl">
                                <SelectValue placeholder="Pilih jenis kelamin" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                <SelectItem value="Perempuan">Perempuan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1 bg-gray-800/60 border-gray-600 text-gray-300 hover:bg-gray-700/60 hover:border-gray-500 rounded-xl"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant='ghost'
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-mint-500 text-white hover:from-emerald-600 hover:to-mint-600 rounded-xl shadow-lg hover:shadow-emerald-500/25"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
