import { sign } from "$lib/mazeToken";
import { processPlayerMove } from "$lib/maze/processPlayerMove";
import { notAuthenticated, responseError, responseStatus } from "$lib/response";
import { fetchOriginalMaze } from "$lib/server/maze/fetchMaze";
import { generateDailyMaze } from "$lib/server/maze/generateDailyMaze";
import { fetchUserMaze } from "$lib/user/fetchUserMaze";
import { upsertUserMaze } from "$lib/user/upsertUserMaze";
import { fetchUser } from "$lib/user/fetchUser";
import type { SupabaseClient } from "@supabase/supabase-js";
import { err, ok } from "$lib/result";

export const POST = async ({ request }) => {
    const { id } = await request.json();

    if (!id) {
        return responseError("ID is required", 400);
    }

    const { data: dailyMaze, error } = await generateDailyMaze(id);

    if (error) {
        return responseError("Error inserting daily_maze data", 500, error);
    }

    return responseStatus(201, dailyMaze);
};

export const GET = async ({ fetch, locals: { supabase } }) => {
    const { data: user } = await fetchUser(supabase);

    if (!user) {
        return notAuthenticated;
    }

    const today = new Date().toISOString().slice(0, 10);

    let { data: userRow, error } = await fetchUserMaze(supabase);

    if (error) {
        return responseError("Error fetching user maze data", 500, error);
    }

    let { data: dailyMazeSource } = await fetchOriginalMaze(today);

    if (!dailyMazeSource) {
        const result = await fetch("/api/maze", {
            method: "POST",
            body: JSON.stringify({ id: today }),
        });

        dailyMazeSource = (await result.json()) as SourceMaze;
    }

    if (!userRow) {
        const { data, error } = await updateDailyUserMaze(
            supabase,
            user,
            dailyMazeSource,
            today,
        );

        if (error) {
            return responseError("Error updating daily user maze", 500, error);
        }

        userRow = data;
    }

    const { maze, position, updated_at, moves, prizes } = userRow;

    const { data: token } = sign({
        user: user.id,
        prizes,
        moves,
        maze,
        position,
        updated_at,
    });

    return responseStatus(200, { token });
};

async function updateDailyUserMaze(
    supabase: SupabaseClient,
    user: User,
    sourceMaze: SourceMaze,
    today: string,
) {
    const { maze, position, moves } = sourceMaze;

    const restrictedMaze = maze.map(row => row.map(() => "b"));

    const { data, error: processError } = processPlayerMove(
        restrictedMaze,
        sourceMaze,
        position,
    );

    if (processError) {
        return err({
            message: "Error processing player move",
            error: processError,
        });
    }

    const result = {
        id: user.id,
        updated_at: today,
        prizes: [],
        score: 0,
        maze: data.result,
        position,
        moves,
    };

    const { error } = await upsertUserMaze(supabase, result);

    if (error) {
        return err({
            message: "Error upserting user maze data",
            error,
        });
    }

    return ok(result);
}
