import { supabaseAdmin } from "$lib/server/supabaseClient";
import { ok, err } from "$lib/result";

export async function generateDailyMaze(id: string): Promise<Result<SourceMaze>> {
    // TODO function to generate a new maze
    const mockDailyMaze: SourceMaze = {
        id,
        position: [2, 2],
        maze: [
            [".", ".", ".", "#", "."],
            ["#", "#", ".", "#", "."],
            [".", ".", ".", ".", "."],
            [".", "#", ".", ".", "."],
            [".", ".", ".", ".", "."],
        ],
        moves: 10,
        prizes: [[0, 0, 1]],
    };

    const { error } = await supabaseAdmin
        .from("daily_maze")
        .upsert(mockDailyMaze);

    if (error) {
        return err({ error });
    }

    return ok(mockDailyMaze);
}
