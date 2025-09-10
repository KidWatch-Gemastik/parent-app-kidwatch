import { NextResponse } from "next/server";

const HF_BACKEND = process.env.HF_BACKEND_URL || "http://localhost:8000";

async function postTextToHF(text: string) {
    const res = await fetch(`${HF_BACKEND}/classify-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) return res.json();

    const textRes = await res.text();
    console.warn("Response bukan JSON:", textRes);
    return { error: "Response bukan JSON", raw: textRes };
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { input } = body;

        if (!input) return NextResponse.json({ error: "Missing input" }, { status: 400 });

        const result = await postTextToHF(input);
        return NextResponse.json({ result });
    } catch (err: any) {
        console.error("HF Text Proxy Error:", err);
        return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
    }
}
