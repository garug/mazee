<script lang="ts">
    import { invalidate } from "$app/navigation";
    import { onMount } from "svelte";

    let { data, children } = $props();
    let { session, supabase } = $derived(data);

    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
            if (newSession?.expires_at !== session?.expires_at) {
                invalidate("supabase:auth");
            }
        });
        return () => data.subscription.unsubscribe();
    });
</script>

<div class="wrapper">
    {@render children()}
</div>

<style lang="postcss">
    .wrapper {
        height: 100dvh;
        width: 100dvw;
        position: relative;
        justify-content: center;
        align-items: center;
        display: flex;
    }

    :global(body) {
        background-color: #472d3c;
        font-family: "Jersey 25", sans-serif;
        color: #cfc6b8;
        font-size: 20px;
    }

    :global(.button) {
        display: inline-block;
        cursor: pointer;
        background-color: #7A444A;
        color: #cfc6b8;
        text-decoration: none;
        padding: 0.65em 0.5em;
        text-shadow: 2px 2px 0 #472d3c,1px 1px 0 #472d3c;
        font-size: 36px;
        transition: all linear .1s;
        clip-path: polygon(
            8px 0,
            calc(100% - 8px) 0,
            100% 8px,
            100% calc(100% - 8px),
            calc(100% - 8px) 100%,
            8px 100%,
            0 calc(100% - 8px),
            0 8px
        );

        &:hover {
            transform: scale(1.05);
        }
    }
</style>
