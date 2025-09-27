export type Child = {
    id: string
    name: string
    date_of_birth: string
    sex: string
    avatar?: string
    qr_code?: string
    qr_id?: string
    status?: "online" | "offline"
    lastSeen?: string
    location?: string // Added for location page
    safeZoneStatus?: string // Added for location page
    gpsAccuracy?: string // Added for location page
}


export type LocationData = {
    latitude: number
    longitude: number
    timestamp: string
    accuracy: number
}

export type SafeZone = {
    id: string
    child_id: string
    name: string
    latitude: number
    longitude: number
    radius: number // in meters
    created_at: string // ISO string for timestamp
    child_name?: string // To display child's name in UI
}

export type DayOfWeek =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

export type Urgency = "low" | "normal" | "high";
export type Recurrence = "once" | "daily" | "weekly" | "monthly"; 
export type Status = "active" | "inactive" | "cancelled"; 

export interface Scheduling {
    id: string;               // uuid
    child_id: string;         // uuid
    day_of_week: DayOfWeek;   // day_of_week_enum
    start_time: string;       // format 'HH:MM:SS'
    end_time: string;         // format 'HH:MM:SS'
    activity_type: string;    // text
    description?: string | null; // text, nullable
    urgency: Urgency;         // urgency_enum
    recurrence: Recurrence;   // recurrence_enum
    notify_before?: string | null; // interval, misal '00:10:00' untuk 10 menit
    status: Status;           // status_enum
    created_at?: string;      // timestamp
    updated_at?: string;      // timestamp
}
