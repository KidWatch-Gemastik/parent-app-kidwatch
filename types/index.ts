export type Child = {
    id: string
    name: string
    date_of_birth: string
    sex: string
    avatar?: string
    qr_code?: string
    status?: "online" | "offline"
    lastSeen?: string
}