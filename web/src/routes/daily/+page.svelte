<script lang="ts">
    import { fade } from "svelte/transition";
    import { type Direction, TileSize } from "$lib/components/Tile.svelte";
    import TileDoor from "$lib/components/tiles/TileDoor.svelte";
    import TileEmpty from "$lib/components/tiles/TileEmpty.svelte";
    import TilePath1 from "$lib/components/tiles/TilePath1.svelte";
    import TilePath2 from "$lib/components/tiles/TilePath2.svelte";
    import TilePath3 from "$lib/components/tiles/TilePath3.svelte";
    import TilePath4 from "$lib/components/tiles/TilePath4.svelte";
    import TileLocked from "$lib/components/tiles/TileLocked.svelte";
    import DirectionIndicator from "$lib/components/DirectioinIndicator.svelte";
    import TileBlocked from "$lib/components/tiles/TileBlocked.svelte";
    import TilePrize from "$lib/components/tiles/TilePrize.svelte";
    import type { UserToken } from "$lib/mazeToken";

    function getConnections(
        maze: string[][],
        r: number,
        c: number,
        characters: string[],
    ): Direction[] {
        const connections: Direction[] = [];

        if (characters.includes(maze[r - 1]?.[c])) connections.push("top");
        if (characters.includes(maze[r + 1]?.[c])) connections.push("bottom");
        if (characters.includes(maze[r]?.[c - 1])) connections.push("left");
        if (characters.includes(maze[r]?.[c + 1])) connections.push("right");

        return connections;
    }

    let { data } = $props();

    let token = $state(data.token);

    const { maze, position, moves, prizes, score }: UserToken = $derived(
        JSON.parse(atob(token.split(".")[0])),
    );

    const isGameOver = $derived(moves <= 0);

    // prettier-ignore
    const keyToDirection: Record<string, Direction> = {
        ArrowUp: "top", w: "top", W: "top",
        ArrowDown: "bottom", s: "bottom", S: "bottom",
        ArrowLeft: "left", a: "left", A: "left",
        ArrowRight: "right", d: "right", D: "right",
    };

    async function handleKeydown(e: KeyboardEvent) {
        if (moves <= 0) {
            return;
        }

        const moveTo = keyToDirection[e.key];

        if (!moveTo) return;

        const [x, y] = position;

        if (
            (moveTo === "top" && y === 0) ||
            (moveTo === "bottom" && y === maze.length - 1) ||
            (moveTo === "left" && x === 0) ||
            (moveTo === "right" && x === maze.length - 1)
        )
            return;

        const changeSuccess = await fetch("/api/maze/step", {
            method: "POST",
            body: JSON.stringify({ moveTo, token }),
        });

        if (!changeSuccess.ok) {
            const body = await changeSuccess.json();
            console.error("Failed to change position:", body);
            return;
        }

        const { token: newToken } = await changeSuccess.json();

        token = newToken;
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="tilemap" style:width="{maze.length * TileSize}px">
    {#if isGameOver}
        <h1 class="game-over">Game Over</h1>
    {/if}
    {#if !isGameOver}
        <DirectionIndicator
            {position}
            connections={getConnections(maze, position[1], position[0], [
                ".",
                "a",
            ])}
        />
    {/if}
    {#each maze as rowTiles, rowIndex}
        {#each rowTiles as tile, colIndex (tile + rowIndex + colIndex)}
            <div
                class={["tile"]}
                in:fade={{ duration: 150, delay: 150 }}
                out:fade={{ duration: 150 }}
                style:grid-column="{colIndex + 1} / {colIndex + 2}"
                style:grid-row="{rowIndex + 1} / {rowIndex + 2}"
            >
                {#if prizes.some(prize => prize[1] === rowIndex && prize[0] === colIndex && !prize[2])}
                    <TilePrize />
                {/if}
                {#if tile === "b"}
                    <TileLocked />
                {:else if tile === "#"}
                    <TileBlocked />
                {:else if tile === "."}
                    {@const connections = getConnections(
                        maze,
                        rowIndex,
                        colIndex,
                        [".", "a"],
                    )}
                    {#if connections.length === 0}
                        <TileEmpty />
                    {:else if connections.length === 1}
                        <TilePath1 {connections} />
                    {:else if connections.length === 2}
                        <TilePath2 {connections} />
                    {:else if connections.length === 3}
                        <TilePath3 {connections} />
                    {:else if connections.length === 4}
                        <TilePath4 />
                    {/if}
                {:else}
                    <TileDoor />
                {/if}
            </div>
        {/each}
    {/each}
</div>
<div>
    <p>Available Steps:<br /> {moves}</p>
    <p>Score:<br /> {score}</p>
</div>

<style>
    .tilemap {
        display: grid;
        grid-template-columns: repeat(auto-fit, 32px);
        position: relative;
    }

    .tile {
        display: flex;
        position: relative;
    }

    .game-over {
        position: absolute;
        z-index: 1;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        text-shadow: 0 2px 2px rgba(0, 0, 0, 0.8);
        font-size: 3em;
        line-height: 0.6em;
    }
</style>
