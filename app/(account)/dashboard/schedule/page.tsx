"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardSidebar from "@/components/layouts/dashboardSidebar";
import DashboardHeader from "@/components/layouts/DashboardHeader";
import ScheduleCard from "./components/ScheduleCard";
import AddScheduleDialog from "./components/AddScheduleDialog";
import type { Scheduling, DayOfWeek, Status } from "@/types";
import { useSupabase } from "@/providers/SupabaseProvider";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDayInIndonesian } from "./utils/day";

// --- Custom Hook Logic Schedule Data ---
function useSchedules() {
  const { supabase } = useSupabase();
  const [schedules, setSchedules] = useState<Scheduling[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;
      const parentId = session.user.id;

      const { data: children, error: childrenError } = await supabase
        .from("children")
        .select("id")
        .eq("user_id", parentId);

      if (childrenError || !children) throw childrenError;
      const childIds = children.map((c) => c.id);

      const { data, error } = await supabase
        .from("scheduling")
        .select("*")
        .in("child_id", childIds)
        .order("day_of_week", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw error;
      setSchedules(data || []);
    } catch (err: unknown) {
      let errorMessage = "Gagal memuat jadwal. Silakan coba lagi nanti.";
      if (err instanceof Error) errorMessage = err.message;
      console.error("Failed to fetch schedules:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleAddSchedule = useCallback(
    async (
      newSchedule: Omit<Scheduling, "id" | "created_at" | "updated_at">
    ) => {
      try {
        const { data, error } = await supabase
          .from("scheduling")
          .insert([{ ...newSchedule }])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setSchedules((prev) => [...prev, data]);
          toast.success("Jadwal berhasil ditambahkan!");
        }
      } catch (err: unknown) {
        let errorMessage = "Terjadi kesalahan saat menambahkan jadwal.";
        if (err instanceof Error) errorMessage = err.message;
        console.error("Gagal menambahkan jadwal:", errorMessage);
        toast.error(errorMessage);
      }
    },
    [supabase]
  );

  const handleEditSchedule = useCallback(
    async (schedule: Scheduling) => {
      try {
        const { data, error } = await supabase
          .from("scheduling")
          .update(schedule)
          .eq("id", schedule.id)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setSchedules((prev) =>
            prev.map((s) => (s.id === data.id ? data : s))
          );
          toast.success("Jadwal berhasil diperbarui!");
        }
      } catch (err: unknown) {
        let errorMessage = "Terjadi kesalahan saat memperbarui jadwal.";
        if (err instanceof Error) errorMessage = err.message;
        console.error("Gagal mengedit jadwal:", errorMessage);
        toast.error(errorMessage);
      }
    },
    [supabase]
  );

  const handleDeleteSchedule = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase
          .from("scheduling")
          .delete()
          .eq("id", id);
        if (error) throw error;
        setSchedules((prev) => prev.filter((s) => s.id !== id));
        toast.success("Jadwal berhasil dihapus.");
      } catch (err: unknown) {
        let errorMessage = "Terjadi kesalahan yang tidak diketahui.";
        if (err instanceof Error) errorMessage = err.message;
        console.error("Gagal menghapus jadwal:", errorMessage);
        toast.error("Gagal menghapus jadwal.");
      }
    },
    [supabase]
  );

  return {
    schedules,
    loading,
    error,
    handleAddSchedule,
    handleEditSchedule,
    handleDeleteSchedule,
  };
}

// --- Komponen Utama ---
export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterDay, setFilterDay] = useState<DayOfWeek | "all">("all");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [editingSchedule, setEditingSchedule] = useState<Scheduling | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<Scheduling | null>(
    null
  );

  const handleDeleteClick = (schedule: Scheduling) => {
    setScheduleToDelete(schedule);
    setDeleteDialogOpen(true);
  };

  // Konfirmasi hapus
  const confirmDelete = () => {
    if (scheduleToDelete) {
      handleDeleteSchedule(scheduleToDelete.id);
      setDeleteDialogOpen(false);
      setScheduleToDelete(null);
    }
  };

  const {
    schedules,
    loading,
    error,
    handleAddSchedule,
    handleEditSchedule,
    handleDeleteSchedule,
  } = useSchedules();

  const handleOpenEdit = (schedule: Scheduling) => {
    setEditingSchedule(schedule);
    setDialogOpen(true);
  };

  // --- Memoized Filters and Stats ---
  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      if (filterDay !== "all" && schedule.day_of_week !== filterDay)
        return false;
      if (filterStatus !== "all" && schedule.status !== filterStatus)
        return false;
      return true;
    });
  }, [schedules, filterDay, filterStatus]);

  const stats = useMemo(() => {
    const total = schedules.length;
    const active = schedules.filter((s) => s.status === "active").length;
    const thisWeek = schedules.filter(
      (s) => s.recurrence === "weekly" || s.recurrence === "daily"
    ).length;
    return { total, active, thisWeek };
  }, [schedules]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-emerald-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="relative z-10 flex">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 space-y-6 md:ml-0">
          <DashboardHeader
            title="Manajemen Jadwal Anak"
            subtitle="Kelola dan pantau aktivitas harian anak Anda dengan mudah"
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Jadwal
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {stats.total}
                </div>
                <p className="text-xs text-muted-foreground">
                  Semua aktivitas terjadwal
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Jadwal Aktif
                </CardTitle>
                <Badge className="bg-accent text-accent-foreground">
                  {stats.active}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  {stats.active}
                </div>
                <p className="text-xs text-muted-foreground">
                  Aktivitas yang sedang berjalan
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Minggu Ini
                </CardTitle>
                <Badge variant="outline">{stats.thisWeek}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.thisWeek}</div>
                <p className="text-xs text-muted-foreground">
                  Aktivitas rutin mingguan
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Controls & Add/Edit Dialog */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <Select
                value={filterDay}
                onValueChange={(value) =>
                  setFilterDay(value as DayOfWeek | "all")
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter hari" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Hari</SelectItem>
                  <SelectItem value="monday">Senin</SelectItem>
                  <SelectItem value="tuesday">Selasa</SelectItem>
                  <SelectItem value="wednesday">Rabu</SelectItem>
                  <SelectItem value="thursday">Kamis</SelectItem>
                  <SelectItem value="friday">Jumat</SelectItem>
                  <SelectItem value="saturday">Sabtu</SelectItem>
                  <SelectItem value="sunday">Minggu</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filterStatus}
                onValueChange={(value) =>
                  setFilterStatus(value as Status | "all")
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex rounded-md border border-border">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Dialog untuk Tambah / Edit */}
            <AddScheduleDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              scheduleToEdit={editingSchedule}
              onAdd={handleAddSchedule}
              onEdit={(schedule) => {
                handleEditSchedule(schedule);
                setDialogOpen(false);
              }}
            />
          </div>

          {/* Conditional Rendering for Loading, Error, and Content */}
          {loading ? (
            <p className="text-center text-muted-foreground">
              Memuat jadwal...
            </p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredSchedules.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <Calendar className="h-12 w-12 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">Belum ada jadwal</h3>
                  <p className="text-muted-foreground text-pretty">
                    Mulai dengan menambahkan jadwal aktivitas pertama untuk anak
                    Anda.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setEditingSchedule(null);
                    setDialogOpen(true);
                  }}
                >
                  Tambah Jadwal
                </Button>
              </div>
            </Card>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {filteredSchedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </main>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus Jadwal</DialogTitle>
            </DialogHeader>
            <p className="py-4">
              Apakah Anda yakin ingin menghapus jadwal{" "}
              <strong>{scheduleToDelete?.activity_type}</strong> pada{" "}
              <strong>
                {scheduleToDelete
                  ? getDayInIndonesian(scheduleToDelete.day_of_week)
                  : ""}
              </strong>
              ?
            </p>
            <DialogFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Batal
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
