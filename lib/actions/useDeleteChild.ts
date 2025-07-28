import { supabase } from "../supabase"
export function useDeleteChild() {

    const deleteChild = async (id: string): Promise<{ error: string | null }> => {
        const { error } = await supabase
            .from("children")
            .delete()
            .eq("id", id)

        return { error: error ? error.message : null }
    }

    return { deleteChild }
}
