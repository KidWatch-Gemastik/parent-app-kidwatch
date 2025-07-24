export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    email: string
                    full_name: string
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
        }
        Views: {}
        Functions: {}
        Enums: {}
    }
}
