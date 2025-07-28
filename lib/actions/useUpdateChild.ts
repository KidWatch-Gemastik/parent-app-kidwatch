import { Child } from "@/types"
import { supabase } from "../supabase";

export function useUpdateChild() {
    const updateChild = async (child: Child): Promise<{ data: Child | null; error: string | null }> => {
        const { data, error } = await supabase
            .from("children")
            .update({
                name: child.name,
                date_of_birth: child.date_of_birth,
                sex: child.sex,
            })
            .eq("id", child.id)
            .select()
            .single()

        if (error) return { data: null, error: error.message }
        return { data, error: null }
    }

    return { updateChild }
}
