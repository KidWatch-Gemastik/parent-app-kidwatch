export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string
                }
                Insert: {
                    id?: string
                    email: string
                    full_name: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string
                }
            }
        }
        Views: {}
        Functions: {}
        Enums: {}
    }
}
