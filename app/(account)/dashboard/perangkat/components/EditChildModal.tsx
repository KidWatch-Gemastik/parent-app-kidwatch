"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Edit, Sparkles, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Child } from "@/types"

interface EditChildModalProps {
    isOpen: boolean
    onClose: () => void
    child: Child | null
    onSave: (child: Child) => void
}

export function EditChildModal({ isOpen, onClose, child, onSave }: EditChildModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        birthDate: undefined as Date | undefined,
        gender: "",
    })

    useEffect(() => {
        if (child) {
            setFormData({
                name: child.name,
                birthDate: child.date_of_birth ? new Date(child.date_of_birth) : undefined,
                gender: child.sex,
            })
        }
    }, [child])

    const calculateAge = (birthDate: Date): string => {
        const today = new Date()
        const birth = new Date(birthDate)
        let age = today.getFullYear() - birth.getFullYear()
        const monthDiff = today.getMonth() - birth.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--
        }

        return age.toString()
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (child && formData.name && formData.birthDate && formData.gender) {
            onSave({
                ...child,
                name: formData.name,
                date_of_birth: formData.birthDate.toISOString(),
                sex: formData.gender,
            })
        }
    }

    const handleClose = () => {
        setFormData({ name: "", birthDate: undefined, gender: "" })
        onClose()
    }

    if (!child) return null

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i)

    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ]

    const handleYearChange = (yearString: string) => {
        const year = Number.parseInt(yearString)
        setFormData((prev) => {
            const newDate = prev.birthDate ? new Date(prev.birthDate) : new Date()
            newDate.setFullYear(year)
            return { ...prev, birthDate: newDate }
        })
    }

    const handleMonthChange = (monthString: string) => {
        const monthIndex = Number.parseInt(monthString)
        setFormData((prev) => {
            const newDate = prev.birthDate ? new Date(prev.birthDate) : new Date()
            newDate.setMonth(monthIndex)
            return { ...prev, birthDate: newDate }
        })
    }

    const handleDaySelect = (date: Date | undefined) => {
        setFormData((prev) => {
            if (!date) return { ...prev, birthDate: undefined }
            const newDate = prev.birthDate ? new Date(prev.birthDate) : new Date()
            newDate.setDate(date.getDate())
            newDate.setMonth(date.getMonth()) // Ensure month is also updated if user navigates in calendar
            newDate.setFullYear(date.getFullYear()) // Ensure year is also updated if user navigates in calendar
            return { ...prev, birthDate: newDate }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-emerald-500/30 text-white max-w-md">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-mint-500/10 opacity-50 rounded-lg" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent transform -skew-y-12 rounded-lg" />

                <DialogHeader className="relative z-10">
                    <DialogTitle className="flex items-center space-x-3 text-xl">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-mint-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Edit className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-emerald-300 to-mint-300 bg-clip-text text-transparent font-bold">
                            Edit Data Anak
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 flex items-center gap-2 mt-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                        Perbarui informasi lengkap anak Anda
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6 relative z-10">
                    {/* Name Input */}
                    <div className="space-y-3">
                        <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                            Nama Lengkap
                        </Label>
                        <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Masukkan nama lengkap anak"
                            className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl h-12 transition-all duration-300 hover:bg-gray-800/80"
                            required
                        />
                    </div>

                    {/* Birth Date Pickers (Year, Month, Day) */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                            <div className="w-2 h-2 bg-mint-400 rounded-full" />
                            Tanggal Lahir
                        </Label>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Year Selector */}
                            <div>
                                <Label className="text-xs text-gray-400 mb-2 block">Tahun</Label>
                                <Select
                                    value={formData.birthDate ? formData.birthDate.getFullYear().toString() : ""}
                                    onValueChange={handleYearChange}
                                >
                                    <SelectTrigger className="bg-gray-800/60 border-gray-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl h-12 transition-all duration-300 hover:bg-gray-800/80">
                                        <SelectValue placeholder="Pilih tahun" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-emerald-500/30 text-white max-h-48">
                                        {years.map((year) => (
                                            <SelectItem
                                                key={year}
                                                value={year.toString()}
                                                className="hover:bg-emerald-500/10 hover:text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-400"
                                            >
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Month Selector */}
                            <div>
                                <Label className="text-xs text-gray-400 mb-2 block">Bulan</Label>
                                <Select
                                    value={formData.birthDate ? formData.birthDate.getMonth().toString() : ""}
                                    onValueChange={handleMonthChange}
                                >
                                    <SelectTrigger className="bg-gray-800/60 border-gray-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl h-12 transition-all duration-300 hover:bg-gray-800/80">
                                        <SelectValue placeholder="Pilih bulan" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-emerald-500/30 text-white max-h-48">
                                        {months.map((monthName, index) => (
                                            <SelectItem
                                                key={index}
                                                value={index.toString()}
                                                className="hover:bg-emerald-500/10 hover:text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-400"
                                            >
                                                {monthName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Day Picker - Calendar Popup */}
                        <div>
                            <Label className="text-xs text-gray-400 mb-2 block">Tanggal</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full h-12 justify-start text-left font-normal rounded-xl transition-all duration-300",
                                            "bg-gray-800/60 border-gray-700 text-white hover:bg-gray-800/80 hover:border-emerald-500/50",
                                            !formData.birthDate && "text-gray-400",
                                        )}
                                    >
                                        <CalendarIcon className="mr-3 h-4 w-4 text-emerald-400" />
                                        {formData.birthDate ? (
                                            <span className="text-white">
                                                {format(formData.birthDate, "dd MMMM yyyy", { locale: id })}
                                                <span className="ml-2 text-emerald-400 text-sm">
                                                    ({calculateAge(formData.birthDate)} tahun)
                                                </span>
                                            </span>
                                        ) : (
                                            <span>Pilih tanggal lahir lengkap</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0 bg-gray-900/95 backdrop-blur-xl border-emerald-500/30 shadow-2xl"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={formData.birthDate}
                                        onSelect={handleDaySelect}
                                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                        month={formData.birthDate} // Pass current month to calendar for display
                                        initialFocus
                                        className="text-white"
                                        classNames={{
                                            months: "text-white",
                                            month: "text-white",
                                            caption: "text-white",
                                            caption_label: "text-white",
                                            nav_button: "text-gray-400 hover:text-emerald-400",
                                            nav_button_previous: "text-gray-400 hover:text-emerald-400",
                                            nav_button_next: "text-gray-400 hover:text-emerald-400",
                                            table: "text-white",
                                            head_row: "text-gray-400",
                                            head_cell: "text-gray-400",
                                            row: "text-white",
                                            cell: "text-white hover:bg-emerald-500/10 rounded-lg",
                                            day: "text-white hover:bg-emerald-500/20 hover:text-emerald-300",
                                            day_selected: "bg-emerald-500 text-white hover:bg-emerald-600",
                                            day_today: "bg-mint-500/20 text-mint-300",
                                            day_outside: "text-gray-600",
                                            day_disabled: "text-gray-600",
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    {/* Gender Selection */}
                    <div className="space-y-3">
                        <Label htmlFor="edit-gender" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full" />
                            Jenis Kelamin
                        </Label>
                        <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                            <SelectTrigger className="bg-gray-800/60 border-gray-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl h-12 transition-all duration-300 hover:bg-gray-800/80">
                                <SelectValue placeholder="Pilih jenis kelamin" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-emerald-500/30 text-white">
                                <SelectItem
                                    value="Laki-laki"
                                    className="hover:bg-emerald-500/10 hover:text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-400"
                                >
                                    👦 Laki-laki
                                </SelectItem>
                                <SelectItem
                                    value="Perempuan"
                                    className="hover:bg-mint-500/10 hover:text-mint-400 focus:bg-mint-500/10 focus:text-mint-400"
                                >
                                    👧 Perempuan
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Age Preview */}
                    {formData.birthDate && (
                        <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-mint-400 rounded-lg flex items-center justify-center">
                                    <CalendarIcon className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-emerald-400 font-semibold">Usia Saat Ini</p>
                                    <p className="text-lg font-bold text-white">{calculateAge(formData.birthDate)} tahun</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1 bg-gray-800/60 border-gray-600 text-gray-300 hover:bg-gray-700/60 hover:border-gray-500 rounded-xl h-12 transition-all duration-300"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="ghost"
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-mint-500 text-white hover:from-emerald-600 hover:to-mint-600 rounded-xl shadow-lg hover:shadow-emerald-500/25 h-12 transition-all duration-300 hover:scale-105 font-semibold"
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
