export function getAdjacentCoordinates([x, y]: Coordinates): Coordinates[] {
    return [
        [x, y - 1], // top
        [x, y + 1], // bottom
        [x - 1, y], // left
        [x + 1, y], // right
    ];
}
