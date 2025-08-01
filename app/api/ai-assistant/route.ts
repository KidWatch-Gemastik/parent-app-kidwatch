import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { Children } from "react";

const textModel = "deepset/roberta-base-squad2";
const audioModel = "openai/whisper-large-v3";
const imageModel = "facebook/detr-resnet-50";

interface CallLog {
    child_id: string;
    timestamp: string;
    phone_number: string;
    type: string;
    duration: number;
}

function isInSafeZone(
    lat: number,
    lng: number,
    zoneLat: number,
    zoneLng: number,
    radius: number
) {
    const R = 6371e3;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(zoneLat - lat);
    const dLng = toRad(zoneLng - lng);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat)) * Math.cos(toRad(zoneLat)) * Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c <= radius;
}

// 🔹 Helper HuggingFace
async function queryHuggingFace(model: string, inputs: string) {
    const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs }),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Model ${model} gagal: ${res.status} - ${errText}`);
    }

    return await res.json();
}

async function queryTextModel(model: string, context: string, question: string) {
    const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: { question, context } }),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Model ${model} gagal: ${res.status} - ${errText}`);
    }

    const result = await res.json();
    const answer = Array.isArray(result) ? result[0]?.answer : result.answer;

    return !answer || answer.trim() === "" || answer === "empty"
        ? "Data tidak tersedia. ~ KiddyGoo"
        : `${answer} ~ KiddyGoo`;
}

export async function POST(req: Request) {
    const { userId, question } = await req.json();
    const supabase = createSupabaseServer();
    const q = question?.trim().toLowerCase();

    const { data: children } = await supabase
        .from("children")
        .select("*")
        .eq("parent_id", userId);

    console.log("Children:", children);


    if (!children || children.length === 0) {
        const answer = "Tidak ada data anak. ~ KiddyGoo";
        return NextResponse.json({ answer });
    }


    const childIds = children.map((c) => c.id);

    const [{ data: callLogs }, { data: messages }, { data: locations }, { data: safeZones }] =
        await Promise.all([
            supabase
                .from("call_logs")
                .select("child_id, timestamp, phone_number, type, duration")
                .in("child_id", childIds)
                .order("timestamp", { ascending: false })
                .limit(20),
            supabase
                .from("chat_messages")
                .select("child_id, timestamp, file_type, file_url, message")
                .in("child_id", childIds)
                .order("timestamp", { ascending: false })
                .limit(20),
            supabase
                .from("locations")
                .select("child_id, latitude, longitude, timestamp")
                .in("child_id", childIds)
                .order("timestamp", { ascending: false })
                .limit(childIds.length), // ambil 1 lokasi terakhir per anak
            supabase
                .from("safe_zones")
                .select("child_id, name, latitude, longitude, radius")
                .in("child_id", childIds),
        ]);

    // ✅ Console log semua data
    console.log("Call Logs:", callLogs);
    console.log("Messages:", messages);
    console.log("Locations:", locations);
    console.log("Safe Zones:", safeZones);

    // 4️⃣ Buat jawaban berbasis pertanyaan
    let answer = "";

    // 🔹 Kalau pertanyaan tentang lokasi anak
    if (/lokasi|dimana/i.test(question)) {
        if (!locations || locations.length === 0) {
            answer = "Lokasi anak belum terdeteksi. ~ KiddyGoo";
        } else {
            const locTexts = locations.map((loc) => {
                const child = children.find((c) => c.id === loc.child_id);
                const mapsLink = `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`;
                return `👶 ${child?.name || "Anak"} terakhir di ${mapsLink} pada ${new Date(
                    loc.timestamp
                ).toLocaleString()}`;
            });
            answer = locTexts.join("\n") + " ~ KiddyGoo";
        }
    }

    // 🔹 Kalau pertanyaan tentang panggilan
    else if (/panggilan|telepon|call/i.test(question)) {
        if (!callLogs || callLogs.length === 0) {
            answer = "Tidak ada log panggilan terbaru. ~ KiddyGoo";
        } else {
            const recentCalls = callLogs
                .slice(0, 5)
                .map(
                    (l) =>
                        `${new Date(l.timestamp).toLocaleString()} - ${l.type} - ${l.phone_number} (${l.duration}s)`
                );
            answer = "📞 Log panggilan terbaru:\n" + recentCalls.join("\n") + " ~ KiddyGoo";
        }
    }

    // 🔹 Kalau pertanyaan tentang pesan/media
    else if (/pesan|chat|media/i.test(question)) {
        if (!messages || messages.length === 0) {
            answer = "Tidak ada pesan terbaru dari anak. ~ KiddyGoo";
        } else {
            const recentMsg = messages
                .slice(0, 5)
                .map(
                    (m) =>
                        `${new Date(m.timestamp).toLocaleString()} - ${m.file_type || "teks"}: ${m.message || m.file_url}`
                );

            // 🔹 Analisis media terbaru pakai HuggingFace
            const latestMedia = messages.find(
                (m) => m.file_type === "image" || m.file_type === "audio"
            );

            if (latestMedia) {
                try {
                    const hfResult =
                        latestMedia.file_type === "image"
                            ? await queryHuggingFace(imageModel, latestMedia.file_url)
                            : await queryHuggingFace(audioModel, latestMedia.file_url);

                    console.log("Hasil Analisis Media:", hfResult);
                } catch (err) {
                    console.error("Analisis media gagal:", err);
                }
            }

            answer = "💬 Pesan/media terbaru:\n" + recentMsg.join("\n") + " ~ KiddyGoo";
        }
    }

    // 🔹 Default: gunakan HuggingFace untuk QA
    if (!answer) {
        const contextList: string[] = [];

        for (const child of children) {
            const childLogs = callLogs?.filter((l) => l.child_id === child.id) || [];
            const childMessages = messages?.filter((m) => m.child_id === child.id) || [];
            const childLocation = locations?.find((loc) => loc.child_id === child.id) || null;
            const childZones = safeZones?.filter((z) => z.child_id === child.id) || [];

            let safeZoneStatus = "Lokasi anak belum terdeteksi.";
            if (childLocation && childZones.length) {
                const { latitude, longitude } = childLocation;
                const zone = childZones.find((z) =>
                    isInSafeZone(latitude, longitude, z.latitude, z.longitude, z.radius)
                );
                safeZoneStatus = zone
                    ? `Anak berada di dalam safe zone: ${zone.name}. ✅`
                    : "Anak berada di luar semua safe zone! ⚠️";
            }

            const callContext =
                childLogs
                    .map(
                        (l) =>
                            `${new Date(l.timestamp).toLocaleString()} - ${l.type} - ${l.phone_number} - ${l.duration}s`
                    )
                    .join("\n") || "Tidak ada panggilan";

            const chatContext =
                childMessages
                    .map(
                        (m) =>
                            `${new Date(m.timestamp).toLocaleString()} - ${m.file_type || "teks"}: ${m.message || m.file_url}`
                    )
                    .join("\n") || "Tidak ada pesan";

            contextList.push(`
👶 Anak: ${child.name}
Status Lokasi: ${safeZoneStatus}

📞 Log Panggilan:
${callContext}

💬 Pesan & Media:
${chatContext}
      `);
        }

        const finalContext = contextList.join("\n\n");

        try {
            answer = await queryTextModel(textModel, finalContext, question);
        } catch (err) {
            console.error(err);
            answer = "Halo, Bunda/Papa! Saat ini KiddyGoo belum bisa memproses pertanyaan ini. 😊";
        }
    }

    await supabase.from("ai_chat_logs").insert({
        user_id: userId,
        question: question,
        answer: answer,
    });

    // 🔹 Intent check untuk sapaan & identitas
    if (/^halo$|hai|hello/i.test(q)) {
        const answer = "Halo, saya KiddyGoo! 👋 Saya asisten AI yang siap membantu memantau aktivitas anak Anda. 😊";
        await supabase.from("ai_chat_logs").insert({
            user_id: userId,
            answer,
            question,
        });
        return NextResponse.json({ answer });
    }

    if (/siapa\s?kamu|kamu\s?siapa|apa\s?kamu/i.test(q)) {
        const answer =
            "Saya KiddyGoo 🤖, asisten AI yang membantu orang tua memantau aktivitas, lokasi, dan keamanan anak-anak.";
        await supabase.from("ai_chat_logs").insert({
            user_id: userId,
            answer,
            question,
        });
        return NextResponse.json({ answer });
    }

    return NextResponse.json({ answer });
}
