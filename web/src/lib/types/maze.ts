type Maze = string[][];

type Coordinates = [number, number];

type Prize = [number, number, number];

type SourceMaze = {
    id: string;
    maze: Maze;
    moves: number;
    position: Coordinates;
    prizes: Prize[];
};
