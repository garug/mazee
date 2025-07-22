<script module lang="ts">
    export type Direction = "top" | "bottom" | "left" | "right";

    export const TileColor = {
        BLUE: "#3CACD7",
        GREEN: "#38DA73",
        RED: "#E5482E",
        YELLOW: "#FAB81A",
    } as const;

    const TILE_SIZE = 16;

    const SCALE = 2;

    export const TileSize = TILE_SIZE * SCALE;

    const directionToDeg = {
        top: 0,
        bottom: 180,
        left: 270,
        right: 90,
    };

    export interface Props {
        position: [number, number];
        color?: string;
        facing?: Direction;
        overlap?: boolean;
    }
</script>

<script lang="ts">
    let { position, facing = "top", overlap = false, color }: Props = $props();

    const cssPosition = $derived(
        `-${position[0] * TILE_SIZE}px -${position[1] * TILE_SIZE}px`,
    );
</script>

<div
    class={["tile", facing, overlap && "overlapped"]}
    style:width="{TileSize}px"
    style:height="{TileSize}px"
    style:rotate="{directionToDeg[facing]}deg"
>
    <div
        class="image {color ? 'color' : 'original'}"
        style:transform="scale({SCALE})"
        style:mask-position={color && cssPosition}
        style:background-color={color}
        style:background-position={(!color && cssPosition) || undefined}
    ></div>
</div>

<style>
    .tile {
        display: inline-block;
        overflow: hidden;
    }

    .tile.overlapped {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }

    .image {
        width: 100%;
        height: 100%;
        image-rendering: pixelated;
        transform-origin: top left;
        pointer-events: none;
    }

    .image.color {
        mask-image: url("/colored-transparent_packed.png");
        mask-repeat: no-repeat;
    }

    .image.original {
        background-image: url("/colored-transparent_packed.png");
        background-repeat: no-repeat;
    }
</style>
