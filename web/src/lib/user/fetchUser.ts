import type { SupabaseClient } from "@supabase/supabase-js";
import { ok } from "$lib/result";

export async function fetchUser(
    supabase: SupabaseClient,
): Promise<Result<User | undefined>> {
    const user = (await supabase.auth.getUser()).data.user;

    return ok(user === null ? undefined : user);
}
