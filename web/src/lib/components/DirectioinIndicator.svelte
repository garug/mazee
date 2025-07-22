<script module lang="ts">
    import {type Direction, TileSize} from "$lib/components/Tile.svelte";

    interface Props {
        connections: Direction[];
        position: [number, number]
    }

    const directions = ["top", "right", "bottom", "left"] as const;

    const tileSize = TileSize / 1.5; // Adjust the proximity of the arrows
</script>

<script lang="ts">
    import TileArrow from "$lib/components/tiles/TileArrow.svelte";

    const {connections, position}: Props = $props();
</script>

<div class="indicator"
     style:left="{position[0] * TileSize}px"
     style:top="{position[1] * TileSize}px"
     style:width="{TileSize}px"
     style:height="{TileSize}px"
>
    {#each directions as connection}
        <div class={["arrow", connections.includes(connection) && "visible", connection]}
             style="{connection}: calc(var(--tile-size) * -1px)"
             style:--tile-size={tileSize}
             style:--float-animation="float-{connection}"
        >
            <TileArrow facing={connection}></TileArrow>
        </div>
    {/each}
</div>

<style>
    .indicator {
        position: absolute;
        display: block;
        transition: 0.2s all ease-in-out;
    }

    @keyframes -global-float-top {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-4px);
        }
    }

    @keyframes -global-float-right {
        0%, 100% {
            transform: translateX(0);
        }
        50% {
            transform: translateX(4px);
        }
    }

    @keyframes -global-float-bottom {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(4px);
        }
    }

    @keyframes -global-float-left {
        0%, 100% {
            transform: translateX(0);
        }
        50% {
            transform: translateX(-4px);
        }
    }

    .arrow {
        display: flex;
        position: absolute;
        z-index: 1;
        animation-duration: 1.2s;
        animation-name: var(--float-animation);
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
        opacity: 0;
        transition: 0.15s all ease-in-out;
    }

    .arrow.visible {
        opacity: 1;
    }
</style>