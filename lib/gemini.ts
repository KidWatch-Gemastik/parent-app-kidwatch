import { GoogleGenerativeAI } from '@google/generative-ai';


const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
    console.warn('GEMINI_API_KEY missing — Gemini calls will fail in runtime');
}


const genAI = new GoogleGenerativeAI(apiKey);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });


export async function askGeminiPrompt(prompt: string) {
    try {
        const result = await geminiModel.generateContent(prompt);
        return result.response?.text()?.trim() ?? null;
    } catch (err) {
        console.error('Gemini error', err);
        return null;
    }
}


export async function analyzeInlineMedia(mimeType: string, base64Data: string, instructions: string) {
    try {
        const result = await geminiModel.generateContent([
            { text: instructions },
            { inlineData: { mimeType, data: base64Data } },
        ]);
        return result.response?.text()?.trim() ?? null;
    } catch (err) {
        console.error('Gemini analyzeInlineMedia error', err);
        return null;
    }
}