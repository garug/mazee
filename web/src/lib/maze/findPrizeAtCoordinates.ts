export function findPrizeAtCoordinates(prizes: Prize[], [x, y]: Coordinates) {
    return prizes.find(([px, py]) => px === x && py === y)?.[2];
}
