<script module lang="ts">
    import Tile, {type Direction} from "$lib/components/Tile.svelte";

    type Combination = "bottom-left" | "bottom-right" | "bottom-top" | "left-right" | "left-top" | "right-top";

    function connectionsToCombination(connections: Direction[]): Combination {
        return connections.sort().join('-') as Combination;
    }

    function combinationToFacing(combination: Combination): Direction {
        const toFacing: Record<Combination, Direction> = {
            "bottom-left": "right",
            "bottom-right": "top",
            "bottom-top": "bottom",
            "left-right": "left",
            "left-top": "bottom",
            "right-top": "left"
        };
        return toFacing[combination] || "top";
    }
</script>

<script lang="ts">
    import {type Props as TileProps} from "$lib/components/Tile.svelte";

    interface Props {
        connections: Direction[];
    }

    const {connections}: Props = $props();

    const tile: TileProps = $derived.by(() => {
        const combination = connectionsToCombination(connections);

        const isFrontOf = ["bottom-top", "left-right"].includes(combination);

        const facing = combinationToFacing(combination);

        return {
            position: isFrontOf ? [8, 1] : [9, 1],
            facing,
        };
    });
</script>

<Tile {...tile}></Tile>