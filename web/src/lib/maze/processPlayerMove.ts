import { findPrizeAtCoordinates } from "$lib/maze/findPrizeAtCoordinates";
import { getAdjacentCoordinates } from "$lib/maze/getAdjacentCoordinates";
import { ok } from "$lib/result";

type PlayerMoveResult = {
    result: Maze;
    revealed: Coordinates[];
    prize: number | undefined;
};

export function processPlayerMove(
    maze: Maze,
    source: SourceMaze,
    coordinates: Coordinates,
): Result<PlayerMoveResult> {
    const result = maze.map(r => [...r]);

    const originalMaze = source.maze;

    const positionsToReveal = [
        coordinates,
        ...getAdjacentCoordinates(coordinates),
    ].filter(([x, y]) => {
        const originalValue = originalMaze[y]?.[x];
        return originalValue && originalValue !== result[y][x];
    });

    for (const [x, y] of positionsToReveal) {
        result[y][x] = originalMaze[y][x];
    }

    return ok({
        result,
        revealed: positionsToReveal,
        prize: findPrizeAtCoordinates(source.prizes, coordinates),
    });
}
