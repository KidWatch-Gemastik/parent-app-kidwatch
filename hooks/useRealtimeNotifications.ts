"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getDeviceToken } from "@/lib/firebase";
import { toast } from "sonner";

export interface Notification {
  id: string;
  child_id: string;
  title: string | null;
  body: string | null;
  package_name?: string | null;
  is_read: boolean;
  ai_analysis?: {
    text: string;
    predicted_label: string;
    score: number;
    all_scores: any[];
  };
}

const LOCAL_STORAGE_KEY = "parent_notifications";

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [childIds, setChildIds] = useState<string[]>([]);
  const [deviceToken, setDeviceToken] = useState<string>();
  const [parentEmail, setParentEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // ===============================
  // 1️⃣ Ambil email parent dari session Supabase
  // ===============================
  useEffect(() => {
    const fetchParentSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        const email = session?.user?.email || "";
        if (email) {
          console.log("📧 Parent Email dari Session:", email);
          setParentEmail(email);
        } else {
          console.warn("⚠️ Tidak ada email di session Supabase");
        }
      } catch (err) {
        console.error("❌ Gagal ambil session Supabase:", err);
      }
    };

    fetchParentSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const email = session?.user?.email || "";
      setParentEmail(email);
      console.log("🔁 Auth state change:", event, "| Email:", email);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ===============================
  // 2️⃣ Request izin notifikasi browser
  // ===============================
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // ===============================
  // 3️⃣ Ambil token device dari Firebase
  // ===============================
  useEffect(() => {
    const fetchToken = async () => {
      try {
        if (!("Notification" in window)) return;

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const token = await getDeviceToken();
        if (token) {
          console.log("✅ Firebase device token:", token);
          setDeviceToken(token);
        } else {
          console.warn("⚠️ Firebase tidak mengembalikan token");
        }
      } catch (err) {
        console.error("❌ Gagal ambil device token:", err);
        toast.error("Gagal mendapatkan token notifikasi");
      }
    };

    fetchToken();
  }, []);

  // ===============================
  // 4️⃣ Ambil daftar anak parent
  // ===============================
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user?.id) return;

        const { data, error } = await supabase
          .from("children")
          .select("id")
          .eq("parent_id", user.id);

        if (error) throw error;

        const ids = data?.map((c) => c.id) || [];
        setChildIds(ids);
      } catch (err) {
        console.error("❌ Gagal fetch children:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  // ===============================
  // 5️⃣ Load notifikasi lokal
  // ===============================
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
      } catch (e) {
        console.error("❌ Gagal parse notifikasi lokal:", e);
      }
    }
  }, []);

  // ===============================
  // 6️⃣ Simpan notifikasi ke localStorage
  // ===============================
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // ===============================
  // 7️⃣ Helper notifikasi browser
  // ===============================
  const showBrowserNotification = (title: string, body: string) => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    new Notification(title, {
      body,
      icon: "/kiddygoo/KiddyGoo_Icon_Logo.png",
      silent: false,
    });
  };

  // ===============================
  // 8️⃣ Proses notifikasi baru
  // ===============================
  const processNotification = async (notif: Notification) => {
    if (notif.is_read) return;
    if (!notif.body) return;

    try {
      // Kirim ke AI backend (langsung ke /analyze-text)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze-text/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: notif.body,
          parent_token: deviceToken,
          parent_email: parentEmail || null,
        }),
      });

      if (!res.ok) throw new Error(`Failed send notification: ${res.status}`);
      notif.ai_analysis = await res.json();

      // Browser notification langsung tampil
      showBrowserNotification(notif.title || "Notifikasi baru", notif.body);

      // Update status di Supabase
      await supabase.from("notifications").update({ is_read: true }).eq("id", notif.id);

      // Update state lokal
      notif.is_read = true;
      setNotifications((prev) => {
        const updated = new Map(prev.map((n) => [n.id, n]));
        updated.set(notif.id, notif);
        return Array.from(updated.values());
      });
    } catch (err) {
      console.error("❌ Gagal memproses notifikasi:", err);
    }
  };

  // ===============================
  // 9️⃣ Realtime listener Supabase
  // ===============================
  useEffect(() => {
    if (childIds.length === 0) return;

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `child_id=in.(${childIds.join(",")})`,
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          console.log("📥 Notifikasi baru diterima:", newNotif);
          processNotification(newNotif);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [childIds, parentEmail, deviceToken]);

  return {
    notifications,
    loading,
    parentEmail,
  };
}
