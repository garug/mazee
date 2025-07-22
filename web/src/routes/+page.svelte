<script lang="ts">
    const { data } = $props();

    const { session } = $derived(data);
</script>

<div class="wrapper">
    <h1>Maze</h1>
    {#if !session}
        <p>Enter your email to sign in</p>

        <form class="form" method="POST">
            <input type="email" name="email" placeholder="hello@example.com" />
            <button type="submit">Sign in</button>
        </form>
        {:else}
        <p>Welcome</p>
        <a href="/daily">Play daily maze</a>
    {/if}
</div>

<style>
    .wrapper {
        text-align: center;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
</style>
