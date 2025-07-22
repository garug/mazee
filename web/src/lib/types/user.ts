type User = {
    id: string;
}

type UserMaze = {
    id: string;
    maze: Maze;
    position: Coordinates;
    updated_at: string;
    moves: number;
    score: number;
    prizes: Coordinates[];
}