import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSupabaseServer,
  getSupabaseAdmin,
} from "@/lib/supabase-serverles";
import {
  getChildrenForParent,
  getRecentCallLogs,
  getRecentMessages,
  getLocations,
  getSafeZones,
} from "@/app/services/chatService";
import { analyzeMediaSafe } from "@/app/services/mediaService";
import { isInSafeZone } from "@/utils/geo";
import { askGemini } from "@/app/services/aiService";
import { cookies } from "next/headers";

const bodySchema = z.object({
  userId: z.string().min(1),
  question: z.string().min(1),
});

const allowedOrigins = [
  "https://parent-kiddygoo.vercel.app",
  "http://localhost:3000",
  "https://kiddygoo.my.id",
];
const SERVER_API_KEY = process.env.NEXT_PUBLIC_KIDDYGOO_API_KEY;

export async function POST(req: Request) {
  try {
    // ----- CORS & API Key check -----
    const origin = req.headers.get("origin");
    if (!origin || !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: "Origin not allowed and Invalid Path Origin" },
        { status: 403 }
      );
    }

    const apiKey = req.headers.get("x-kiddygoo-key");
    if (!apiKey || apiKey !== SERVER_API_KEY) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // ----- Body parsing & validation -----
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const { userId, question } = parsed.data;

    // Auth: ensure requester is owner of userId (implement your own check)
    // For example: extract supabase session from cookies and verify sub === userId
    const cookie = await cookies();
    const supabaseClient = createSupabaseServer(cookie);
    const { data: session } = await supabaseClient.auth.getSession();
    if (!session?.session || session.session.user.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized User, Not Allowed" },
        { status: 401 }
      );
    }

    // Fetch children & data
    const children = await getChildrenForParent(userId);
    if (!children.length)
      return NextResponse.json({ answer: "Tidak ada data anak. ~ KiddyGoo" });
    const childIds = children.map((c) => c.id);

    const [callLogs, messages, locations, safeZones] = await Promise.all([
      getRecentCallLogs(childIds, 20),
      getRecentMessages(childIds, 20),
      getLocations(childIds, 20),
      getSafeZones(childIds),
    ]);

    let answer = "";
    const q = question.toLowerCase();

    if (/lokasi|dimana/i.test(q)) {
      if (!locations.length)
        answer = "Lokasi anak belum terdeteksi. ~ KiddyGoo";
      else {
        const locTexts = locations.map((loc) => {
          const child = children.find((c) => c.id === loc.child_id);
          const mapsLink = `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`;
          return `👶 Anak: ${child?.name || "Tidak diketahui"}\n📍 Lokasi: ${
            loc.latitude
          }, ${
            loc.longitude
          }\n🗺️ Google Maps: ${mapsLink}\n⏰ Terakhir terdeteksi: ${new Date(
            loc.timestamp
          ).toLocaleString()}`;
        });
        answer =
          "📍 Lokasi Anak Terbaru:\n\n" +
          locTexts.join("\n\n") +
          "\n\n~ KiddyGoo";
      }
    } else if (/panggilan|telepon|call/i.test(q)) {
      if (!callLogs.length)
        answer = "Tidak ada log panggilan terbaru. ~ KiddyGoo";
      else {
        const recentCalls = callLogs
          .slice(0, 5)
          .map(
            (l) =>
              `📞 ${new Date(l.timestamp).toLocaleString()} | ${l.type} | ${
                l.phone_number
              } | ${l.duration}s`
          );
        answer =
          "📞 Log Panggilan Terbaru:\n\n" +
          recentCalls.join("\n") +
          "\n\n~ KiddyGoo";
      }
    } else if (
      /analisis media|analisa media|cek media|analyze media/i.test(q)
    ) {
      const mediaResults: string[] = [];
      for (const child of children) {
        const childMessages = messages
          .filter((m) => m.child_id === child.id)
          .slice(0, 5);
        const medias = childMessages.filter(
          (m) =>
            (m.file_url && (m.file_type || "").startsWith("image")) ||
            m.file_type?.startsWith("audio") ||
            m.file_type?.startsWith("video")
        );
        if (!medias.length) continue;
        const analyses = await Promise.all(
          medias.map(async (m) => {
            const time = new Date(m.created_at).toLocaleString();
            const analysis = await analyzeMediaSafe(m.file_url, m.file_type);
            return `[${time}]\nJenis : ${m.file_type}\nNama  : ${
              m.file_name || "-"
            }\nLink  : ${m.file_url}\n\n📊 Hasil Analisis:\n${
              analysis || "Gagal analisis."
            }`;
          })
        );
        mediaResults.push(`👶 Anak: ${child.name}\n\n${analyses.join("\n\n")}`);
      }
      answer = mediaResults.length
        ? "🔎 Hasil Analisis Media Terbaru:\n\n" +
          mediaResults.join("\n\n---\n\n") +
          "\n\n~ KiddyGoo"
        : "Tidak ada media terbaru dari anak untuk dianalisis. ~ KiddyGoo";
    }

    if (!answer) {
      // build context
      const contextList = children.map((child) => {
        const childLogs = callLogs.filter((l) => l.child_id === child.id) || [];
        const childMessages =
          messages.filter((m) => m.child_id === child.id) || [];
        const childLocation = locations.find(
          (loc) => loc.child_id === child.id
        );
        const childZones =
          safeZones.filter((z) => z.child_id === child.id) || [];
        let safeZoneStatus = "📍 Lokasi anak belum terdeteksi.";
        if (childLocation && childZones.length) {
          const zone = childZones.find((z) =>
            isInSafeZone(
              childLocation.latitude,
              childLocation.longitude,
              z.latitude,
              z.longitude,
              z.radius
            )
          );
          safeZoneStatus = zone
            ? `✅ Anak berada di dalam safe zone: ${zone.name}`
            : "⚠️ Anak berada di luar semua safe zone!";
        }
        const callContext = childLogs.length
          ? childLogs
              .slice(0, 5)
              .map(
                (l) =>
                  `📞 ${new Date(l.timestamp).toLocaleString()} | ${l.type} | ${
                    l.phone_number
                  } | ${l.duration}s`
              )
              .join("\n")
          : "Tidak ada panggilan.";
        const chatContext = childMessages.length
          ? childMessages
              .slice(0, 5)
              .map(
                (m) =>
                  `💬 ${new Date(m.created_at).toLocaleString()} | ${
                    m.file_type || "teks"
                  } | ${m.message || m.file_url}`
              )
              .join("\n")
          : "Tidak ada pesan.";
        return `👶 Anak: ${child.name}\n\n${safeZoneStatus}\n\n📞 Log Panggilan Terbaru:\n${callContext}\n\n💬 Pesan & Media Terbaru:\n${chatContext}`;
      });

      answer = await askGemini(contextList.join("\n\n---\n\n"), question);
    }

    // Save log (non-blocking)
    try {
      const admin = getSupabaseAdmin();
      await admin.from("ai_chat_logs").insert({
        user_id: userId,
        question,
        answer,
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error("Failed to save ai_chat_logs", e);
    }

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("API error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
