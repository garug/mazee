<script module lang="ts">
    import Tile, {type Direction} from "$lib/components/Tile.svelte";

    const toFacing = {
        "bottom-left-right": "right",
        "bottom-left-top": "bottom",
        "bottom-right-top": "top",
        "left-right-top": "left",
    } as const;

    type Combinations = keyof typeof toFacing;

    function connectionsToFacing(connections: Direction[]): Direction {
        const key = connections.sort().join('-') as Combinations;
        return toFacing[key] || "top";
    }
</script>

<script lang="ts">
    interface Props {
        connections: Direction[];
    }

    const {connections}: Props = $props();
</script>

<Tile position={[10, 1]} facing={connectionsToFacing(connections)}></Tile>