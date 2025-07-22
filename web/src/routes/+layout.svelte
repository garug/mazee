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

<style>
    .wrapper {
        height: 100dvh;
        width: 100dvw;
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
</style>
