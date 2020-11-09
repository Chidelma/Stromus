<script lang="ts">
    import type Organ from '../../Scripts/Organ';
    import type User from '../../Scripts/User';
    import type { _post, _part_sort } from '../../Scripts/Interface';
    import { admin, postForm, user, comForm } from '../../Scripts/Init';
    import type Post from '../../Scripts/Post';
    import PostCard from './PostCard.svelte';
    import Blur from '../BlurScreen.svelte';
    import Form from './PostForm.svelte';
    import Temp from '../Comment/ComTemp.svelte';
    import { onMount } from 'svelte';

    export let organ:Organ;

    let posts:Post[] = organ.get_posts();
    let can_add_post:boolean = false;

    let show_post:Post;

    function showComments(event:any) :void {
        show_post = event.detail.post;
        comForm.set(true);
    }

    function refreshPosts(event:any) :void {
        posts = organ.get_posts();
    }

    function updatePost(event:any) :void {
        organ.change_post(event.detail.post);
    }

    setInterval(async () => {
        await organ.setup_posts();
        organ.sort_all();
        posts = organ.get_posts();
    }, 30000);

    function set_user(): void {
        let curr_user:User = organ.get_users().find(user => user.get_email() == $admin.get_email());
        user.set(curr_user);
        can_add_post = curr_user.get_role().can_add_post();
    }

    onMount(() => {
        set_user();
    });
</script>

{#if $postForm}
    <Blur/>
    <div id="post-form">
        <Form user={$user} {organ} on:message={refreshPosts} />
    </div>
{/if}

{#if $comForm}
    <Blur/>
    <div id="com-form">
        <Temp post={show_post} user={$user} on:message={updatePost} />
    </div>
{/if}

<table class="heading">
    <tr>
        <td>
            <h5>Posts</h5>
        </td>
        <td>
            {#if can_add_post}
                <button class="btn btn-sm btn-primary" on:click="{() => (postForm.set(true))}">Add Post</button>
            {/if}
        </td>
    </tr>
</table>

<hr/>

{#if posts.length == 0}
    <p id="no-posts">There are no Posts for {organ.get_name()}</p>
{:else}
    <div class="post-scroll">
        {#each posts as post}
            <PostCard {post} user={$user} on:message={showComments}/>
            <hr/>
        {/each}
    </div>
{/if}

<style>
    #post-form {
        padding:20px;
        position:fixed;
        z-index: 75;
        left:50%;
        top:15%;
        width:500px;
        background-color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius: 0.4rem;
        transform: translate(-50%, 0);
    }

    #com-form {
        padding:20px;
        position:fixed;
        z-index: 75;
        left:50%;
        top:5%;
        width:500px;
        background-color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius: 0.4rem;
        transform: translate(-50%, 0);
        max-height: 90%;
    }

    #no-posts {
        text-align: center;
    }

    .post-scroll {
        width:100%;
        height:100%;
        overflow-y: auto;
    }

    .heading {
        width:100%;
    }

    .btn-sm {
        float:right;
    }
</style>