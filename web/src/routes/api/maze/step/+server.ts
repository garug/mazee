import type { RequestHandler } from "./$types";
import type { Direction } from "$lib/components/Tile.svelte";
import { sign, verify } from "$lib/mazeToken";
import { processPlayerMove } from "$lib/maze/processPlayerMove";
import { fetchOriginalMaze } from "$lib/server/maze/fetchMaze";
import { notAuthenticated, responseError, responseStatus } from "$lib/response";

export const POST: RequestHandler = async ({
    request,
    locals: { supabase },
}) => {
    const { moveTo, token } = await request.json();

    const { data: tokenPayload } = verify(token);

    if (!tokenPayload) {
        return notAuthenticated;
    }

    const { maze, position, updated_at, user, moves, score, prizes } =
        tokenPayload;

    const { data: originalMazeSource } = await fetchOriginalMaze(updated_at);

    if (!originalMazeSource) {
        return responseError("Maze not found", 500);
    }

    const originalMaze = originalMazeSource.maze;

    const nextPosition = getNextPosition(position, moveTo);

    if (isBlockedByWall(originalMaze, nextPosition)) {
        return responseError("Blocked by wall", 422);
    }

    const {
        data: { result: mazeUpdated, revealed, prize },
    } = processPlayerMove(maze, originalMazeSource, nextPosition);

    const newScore = score + (prize || 0);

    const remainingMoves = prize || revealed.length > 0 ? moves - 1 : moves;

    const { data: updatedRows, error } = await supabase
        .from("user_maze")
        .update({
            prizes: (prize ? [...prizes, nextPosition] : prizes).map(p => [
                p[0],
                p[1],
            ]),
            score: newScore,
            maze: mazeUpdated,
            position: nextPosition,
            moves: remainingMoves,
        })
        .eq("moves", moves)
        .eq("position", `{${position[0]},${position[1]}}`)
        .filter("maze", "eq", JSON.stringify(maze))
        .select();

    if (error) {
        return responseError("Failed to update maze", 400);
    } else if (updatedRows.length === 0) {
        return responseError(
            "Failed to update maze due to internal error",
            500,
            { maze, mazeUpdated, position, moves },
        );
    }

    const { data: newToken } = sign({
        user,
        moves: remainingMoves,
        maze: mazeUpdated,
        position: nextPosition,
        updated_at,
        prizes: originalMazeSource.prizes
            .filter(p1 => mazeUpdated[p1[0]][p1[1]] !== "b")
            .map(p => [
                p[0],
                p[1],
                prizes.some(p2 => p2[0] === p[0] && p2[1] === p[1]),
            ]),
        score: newScore,
    });

    return responseStatus(202, {
        token: newToken,
    });
};

function isBlockedByWall(maze: Maze, [x, y]: Coordinates): boolean {
    return maze[y]?.[x] === "#";
}

function getNextPosition(
    coordinates: Coordinates,
    dir: Direction,
): Coordinates {
    const map: Record<Direction, Coordinates> = {
        top: [coordinates[0], coordinates[1] - 1],
        right: [coordinates[0] + 1, coordinates[1]],
        bottom: [coordinates[0], coordinates[1] + 1],
        left: [coordinates[0] - 1, coordinates[1]],
    };

    return map[dir];
}
