import * as cache from "$lib/cache";
import { supabaseAdmin } from "$lib/server/supabaseClient";
import { ok } from "$lib/result";

type MazeResult = Promise<Result<SourceMaze | undefined>>;

async function fetchDailyMazeFromDatabase(id: string): MazeResult {
    const { data, error } = await supabaseAdmin
        .from("daily_maze")
        .select("*")
        .eq("id", id);

    if (error) {
        console.error({
            error: "Error fetching daily maze data",
            details: error,
        });
        return ok();
    }

    return ok(data?.[0]);
}

export async function fetchOriginalMaze(id: string): MazeResult {
    const cachedMaze = await cache.get<SourceMaze>(id);
    if (cachedMaze) return ok(cachedMaze);

    const fetchedMaze = await fetchDailyMazeFromDatabase(id);
    if (!fetchedMaze.data) return ok();

    await cache.set(id, fetchedMaze.data);

    return fetchedMaze;
}
