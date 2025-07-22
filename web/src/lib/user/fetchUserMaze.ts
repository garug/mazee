import type { SupabaseClient } from "@supabase/supabase-js";
import { err, ok } from "$lib/result";

export async function fetchUserMaze(
    supabase: SupabaseClient,
): Promise<Result<UserMaze | undefined>> {
    let { data, error } = await supabase.from("user_maze").select("*");

    if (error) {
        return err(error);
    }

    return ok(data?.[0]);
}
