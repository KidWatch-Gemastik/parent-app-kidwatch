import { getSupabaseAdmin } from "@/lib/supabase-serverles";


export async function getChildrenForParent(parentId: string) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
        .from('children')
        .select('id, name')
        .eq('parent_id', parentId);
    if (error) throw error;
    return data || [];
}


export async function getRecentCallLogs(childIds: string[], limit = 20) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
        .from('call_logs')
        .select('child_id, timestamp, phone_number, type, duration')
        .in('child_id', childIds)
        .order('timestamp', { ascending: false })
        .limit(limit);
    if (error) throw error;
    return data || [];
}


export async function getRecentMessages(childIds: string[], limit = 20) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
        .from('chat_messages')
        .select('child_id, created_at, file_type, file_url, message, file_name')
        .in('child_id', childIds)
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error) throw error;
    return data || [];
}


export async function getLocations(childIds: string[], limit = 20) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
        .from('locations')
        .select('child_id, latitude, longitude, timestamp')
        .in('child_id', childIds)
        .order('timestamp', { ascending: false })
        .limit(limit);
    if (error) throw error;
    return data || [];
}


export async function getSafeZones(childIds: string[]) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('safe_zones').select('child_id, name, latitude, longitude, radius').in('child_id', childIds);
    if (error) throw error;
    return data || [];
}