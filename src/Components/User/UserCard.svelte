<script lang="ts">
    import type User from '../../Scripts/User';
    import PostCard from '../Post/PostCard.svelte';
    import { user, userCard } from '../../Scripts/Init';
    import type Post from '../../Scripts/Post';

    export let curr_user:User;

    let posts:Post[] = curr_user.get_posts();
</script>

<button class="btn btn-danger" on:click="{() => (userCard.set(false))}">Close</button>

{#each posts as post}
    <PostCard {post} user={$user} />
    <hr/>
{/each}

<style>
    .btn {
        float:right;
    }
</style>