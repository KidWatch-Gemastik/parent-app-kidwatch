"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Scheduling,
  DayOfWeek,
  Urgency,
  Recurrence,
  Status,
} from "@/types";
import { useSupabase } from "@/providers/SupabaseProvider";
import Image from "next/image";

interface AddScheduleDialogProps {
  onAdd: (
    schedule: Omit<Scheduling, "id" | "created_at" | "updated_at">
  ) => void;
  onEdit?: (schedule: Scheduling) => void;
  scheduleToEdit?: Scheduling | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Child {
  id: string;
  name: string;
}

export default function AddScheduleDialog({
  onAdd,
  onEdit,
  scheduleToEdit,
  open,
  onOpenChange,
}: AddScheduleDialogProps) {
  const { supabase } = useSupabase();
  const [children, setChildren] = useState<Child[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [formData, setFormData] = useState({
    child_id: "",
    day_of_week: "monday" as DayOfWeek,
    start_time: "",
    end_time: "",
    activity_type: "",
    description: "",
    urgency: "normal" as Urgency,
    recurrence: "once" as Recurrence,
    notify_before: "",
    status: "active" as Status,
  });

  // Sync open state dari parent
  useEffect(() => {
    if (scheduleToEdit) {
      setFormData({
        child_id: scheduleToEdit.child_id,
        day_of_week: scheduleToEdit.day_of_week,
        start_time: scheduleToEdit.start_time,
        end_time: scheduleToEdit.end_time,
        activity_type: scheduleToEdit.activity_type,
        description: scheduleToEdit.description || "",
        urgency: scheduleToEdit.urgency,
        recurrence: scheduleToEdit.recurrence,
        notify_before: scheduleToEdit.notify_before || "",
        status: scheduleToEdit.status,
      });
    } else {
      setFormData({
        child_id: "",
        day_of_week: "monday",
        start_time: "",
        end_time: "",
        activity_type: "",
        description: "",
        urgency: "normal",
        recurrence: "once",
        notify_before: "",
        status: "active",
      });
    }
  }, [scheduleToEdit, open]);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoadingChildren(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          console.warn("Tidak ada user login.");
          setChildren([]);
          return;
        }

        const { data, error } = await supabase
          .from("children")
          .select("id, name")
          .eq("parent_id", user.id) 
          .order("created_at", { ascending: true });

        if (error) throw error;

        setChildren(data || []);
      } catch (error: any) {
        console.error("Gagal ambil anak:", error.message);
        setChildren([]);
      } finally {
        setLoadingChildren(false);
      }
    };

    fetchChildren();
  }, [supabase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.child_id) return alert("Silakan pilih anak");

    if (scheduleToEdit && onEdit) {
      onEdit({
        ...scheduleToEdit,
        ...formData,
        notify_before:
          formData.notify_before === "none"
            ? null
            : formData.notify_before || null,
        description: formData.description || null,
      });
    } else {
      onAdd({
        ...formData,
        notify_before:
          formData.notify_before === "none"
            ? null
            : formData.notify_before || null,
        description: formData.description || null,
      });
    }

    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {scheduleToEdit ? "Edit Jadwal" : "Tambah Jadwal"}
        </Button>
      </SheetTrigger>

      <SheetContent
        className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] overflow-y-auto"
        side={"right"}
      >
        <SheetHeader>
          <SheetTitle>
            {scheduleToEdit ? "Edit Jadwal" : "Tambah Jadwal Baru"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 px-4 py-2">
          {/* Pilih Anak */}
          <div className="space-y-2">
            <Label htmlFor="child_id">Anak</Label>
            <Select
              value={formData.child_id}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, child_id: value }))
              }
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={loadingChildren ? "Loading..." : "Pilih anak"}
                />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem
                    key={child.id}
                    value={child.id}
                    className="flex items-center gap-2"
                  >
                    <Image
                      unoptimized
                      width={24}
                      height={24}
                      src={`https://api.dicebear.com/6.x/miniavs/svg?seed=${child.name}`}
                      alt={child.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{child.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hari & Jenis Aktivitas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day_of_week">Hari</Label>
              <Select
                value={formData.day_of_week}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    day_of_week: value as DayOfWeek,
                  }))
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih hari" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Senin</SelectItem>
                  <SelectItem value="tuesday">Selasa</SelectItem>
                  <SelectItem value="wednesday">Rabu</SelectItem>
                  <SelectItem value="thursday">Kamis</SelectItem>
                  <SelectItem value="friday">Jumat</SelectItem>
                  <SelectItem value="saturday">Sabtu</SelectItem>
                  <SelectItem value="sunday">Minggu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity_type">Jenis Aktivitas</Label>
              <Input
                id="activity_type"
                value={formData.activity_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    activity_type: e.target.value,
                  }))
                }
                placeholder="Sekolah, Les, Olahraga..."
                required
              />
            </div>
          </div>

          {/* Waktu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Waktu Mulai</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    start_time: e.target.value + ":00",
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">Waktu Selesai</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    end_time: e.target.value + ":00",
                  }))
                }
                required
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Detail tambahan tentang aktivitas..."
              rows={3}
            />
          </div>

          {/* Prioritas, Pengulangan, Notifikasi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="urgency">Prioritas</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    urgency: value as Urgency,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Rendah</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Tinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurrence">Pengulangan</Label>
              <Select
                value={formData.recurrence}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    recurrence: value as Recurrence,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Sekali</SelectItem>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notify_before">Notifikasi</Label>
              <Select
                value={formData.notify_before || "none"}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, notify_before: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih waktu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada</SelectItem>
                  <SelectItem value="00:05:00">5 menit</SelectItem>
                  <SelectItem value="00:10:00">10 menit</SelectItem>
                  <SelectItem value="00:15:00">15 menit</SelectItem>
                  <SelectItem value="00:30:00">30 menit</SelectItem>
                  <SelectItem value="01:00:00">1 jam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">
              {scheduleToEdit ? "Simpan Perubahan" : "Simpan Jadwal"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
