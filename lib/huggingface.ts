import { fetchWithTimeout } from "./utils";

const HF_KEY = process.env.HUGGINGFACE_API_KEY;
if (!HF_KEY) {
    // It's fine to throw here during runtime if not provided.
    // In dev you can opt to handle it more gracefully.
    throw new Error("Missing HUGGINGFACE_API_KEY in environment variables");
}

/**
 * Generic inference call
 */
export async function queryHuggingFace(model: string, payload: any, timeout = 20000) {
    const url = `https://api-inference.huggingface.co/models/${model}`;
    const res = await fetchWithTimeout(
        url,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        },
        timeout
    );

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HuggingFace ${model} error ${res.status}: ${text}`);
    }
    return res.json();
}

/**
 * Convenience wrappers for common HF model types:
 */
export async function queryTextModel(model: string, context: string, question: string) {
    // Many HF QA models accept { question, context }
    return queryHuggingFace(model, { inputs: { question, context } });
}

export async function queryImageModel(model: string, imageUrl: string) {
    // If HF expects URL instead of multipart: { inputs: image_url }
    return queryHuggingFace(model, { inputs: imageUrl });
}

export async function queryAudioModel(model: string, audioUrl: string) {
    return queryHuggingFace(model, { inputs: audioUrl });
}
