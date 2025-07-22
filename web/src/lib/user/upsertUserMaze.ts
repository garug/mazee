import type { SupabaseClient } from "@supabase/supabase-js";
import { err, ok } from "$lib/result";

export async function upsertUserMaze(
    supabase: SupabaseClient,
    userMaze: UserMaze,
): Promise<Result> {
    const { data, error } = await supabase
        .from("user_maze")
        .upsert(userMaze)
        .select();

    if (error) {
        return err(error);
    } else if (data && data.length === 0) {
        return err({
            message: "No data returned from upsert",
            input: userMaze,
            result: data,
        });
    }

    return ok();
}
