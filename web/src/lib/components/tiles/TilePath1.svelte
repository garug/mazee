<script module lang="ts">
    import Tile, {type Direction} from "$lib/components/Tile.svelte";

    const toFacing = {
        "top": "bottom",
        "bottom": "top",
        "left": "right",
        "right": "left",
    } as const;

    function connectionsToFacing(connections: Direction[]): Direction {
        return toFacing[connections[0]] || "top";
    }
</script>

<script lang="ts">
    interface Props {
        connections: Direction[];
    }

    const {connections}: Props = $props();
</script>

<Tile position={[12, 1]} facing={connectionsToFacing(connections)}></Tile>