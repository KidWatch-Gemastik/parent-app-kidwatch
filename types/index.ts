export type Child = {
    id: string
    name: string
    date_of_birth: string
    sex: string
    avatar?: string
    qr_code?: string
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
    name: string
    latitude: number
    longitude: number
    radius: number // in meters
    type: "home" | "school" | "custom"
}
