<script lang="ts">
    import Tile from "$lib/components/Tile.svelte";
</script>

<div class="breathing">
    <Tile position={[39, 13]} overlap></Tile>
</div>

<style>
    @keyframes prize-indicator {
        0%, 100% {
            transform: translateY(0);
        }
        30% {
            transform: translateY(-8px);
        }
        50% {
            transform: translateY(0);
        }
        65% {
            transform: translateY(-2px);
        }
        75% {
            transform: translateY(0);
        }
    }

    .breathing {
        animation: prize-indicator 1.75s ease infinite;
        z-index: 1;
        transform-origin: center;
    }
</style>
