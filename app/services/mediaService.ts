import axios from 'axios';
import { analyzeInlineMedia } from '@/lib/gemini';


// Only allow certain storage hostnames to prevent SSRF.
const ALLOWED_HOSTNAMES = [process.env.SUPABASE_STORAGE_HOSTNAME || 'ltarjljnzwrogwwdvtob.supabase.co'];


function isAllowedUrl(url: string) {
    try {
        const u = new URL(url);
        return ALLOWED_HOSTNAMES.includes(u.hostname);
    } catch (e) {
        return false;
    }
}


export async function analyzeMediaSafe(fileUrl: string, fileType: string) {
    if (!isAllowedUrl(fileUrl)) {
        console.warn('Blocked media URL (SSRF protection):', fileUrl);
        return null;
    }


    try {
        const resp = await axios.get(fileUrl, { responseType: 'arraybuffer', timeout: 30_000 });
        const base64 = Buffer.from(resp.data).toString('base64');
        let mime = 'application/octet-stream';
        if (fileType.startsWith('image')) mime = 'image/png';
        else if (fileType.startsWith('video')) mime = 'video/webm';
        else if (fileType.startsWith('audio')) mime = 'audio/webm';


        const instructions = `Analisis singkat: cek unsur berbahaya, kekerasan, pelecehan, porno, dan karakter yang mengancam. Jawab ringkas dalam bahasa Indonesia.`;
        const text = await analyzeInlineMedia(mime, base64, instructions);
        return text;
    } catch (err) {
        console.error('analyzeMediaSafe error', err);
        return null;
    }
}