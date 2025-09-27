import { askGeminiPrompt } from '@/lib/gemini';


export async function askGemini(context: string, question: string) {
    const prompt = `Context:\n${context}\n\nQuestion:\n${question}`;
    const resp = await askGeminiPrompt(prompt);
    return resp || 'Maaf, saya tidak bisa memproses permintaan ini sekarang.';
}