import { supabase } from "../supabase"

export async function registerUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        throw new Error(error.message)
    }

    return data
}
