import { sign, type UserPrize } from "$lib/mazeToken";
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

    console.log("aqui1");

    if (!user) {
        return notAuthenticated;
    }

    const today = new Date().toISOString().slice(0, 10);

    let { data: userRow, error } = await fetchUserMaze(supabase);

    console.log("aqui2");

    if (error) {
        return responseError("Error fetching user maze data", 500, error);
    }

    let { data: dailyMazeSource } = await fetchOriginalMaze(today);

    console.log("aqui3");

    if (!dailyMazeSource) {
        const result = await fetch("/api/maze", {
            method: "POST",
            body: JSON.stringify({ id: today }),
        });

        dailyMazeSource = (await result.json()) as SourceMaze;
    }

    console.log("aqui4");

    if (!userRow || userRow.updated_at !== today) {
        const { data, error } = await updateDailyUserMaze(
            supabase,
            user,
            dailyMazeSource,
            today,
        );

        if (error) {
            return responseError("Error up dating daily user maze", 500, error);
        }

        userRow = data;
    }

    const {
        maze,
        score,
        position,
        updated_at,
        moves,
        prizes: acquired,
    } = userRow;

    console.log("aqui5");

    const prizes: UserPrize[] = [
        ...acquired.map(p => [p[0], p[1], true] as UserPrize),
        ...dailyMazeSource.prizes
            .filter(
                p1 =>
                    !acquired.some(p2 => p2[0] === p1[0] && p2[1] === p1[1]) &&
                    maze[p1[0]][p1[1]] !== "b",
            )
            .map(p => [p[0], p[1], false] as UserPrize),
    ];

    const { data: token } = sign({
        user: user.id,
        prizes,
        moves,
        maze,
        position,
        updated_at,
        score,
    });

    console.log("aqui6");

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
