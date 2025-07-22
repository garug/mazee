<script lang="ts">
    import Tile, {type Direction} from "$lib/components/Tile.svelte";

    interface Props {
        facing: Direction;
    }

    const {facing = "top"}: Props = $props();
</script>

<Tile position={[23, 20]} {facing}></Tile>
