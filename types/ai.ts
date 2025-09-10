export interface Child {
    id: string;
    name?: string;
    parent_id?: string;
    [k: string]: any;
}

export interface CallLog {
    child_id: string;
    timestamp: string;
    phone_number: string;
    type: string;
    duration: number;
}

export interface ChatMessage {
    child_id: string;
    timestamp: string;
    file_type?: string;
    file_url?: string;
    message?: string;
}

export interface LocationRecord {
    child_id: string;
    latitude: number;
    longitude: number;
    timestamp: string;
}

export interface SafeZone {
    child_id: string;
    name: string;
    latitude: number;
    longitude: number;
    radius: number; // in meters
}
