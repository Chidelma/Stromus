<script lang="ts">
    import type Organ from '../../Scripts/Organ';
    import type User from '../../Scripts/User';
    import type { _post, _part_sort } from '../../Scripts/Interface';
    import { postForm, comForm, server } from '../../Scripts/Init';
    import type Post from '../../Scripts/Post';
    import PostCard from './PostCard.svelte';
    import Blur from '../BlurScreen.svelte';
    import Form from './PostForm.svelte';
    import Temp from '../Comment/ComTemp.svelte';

    export let organ:Organ;
    export let user:User;

    let posts:Post[] = organ.get_posts();
    let can_add_post:boolean = user.get_role().can_add_post();

    let show_post:Post;

    $server.on('recv-post', (post:_post) => {
        if(post.organ_id == organ.get_id()) {
            posts = organ.get_posts();
        }
    });

    $server.on('rm-post', (data:_part_sort) => {
        if(data.part_value == organ.get_id()) 
            posts = organ.get_posts();;
    });

    function showComments(event:any) :void {
        show_post = event.detail.post;
        comForm.set(true);
    }
</script>

{#if $postForm}
    <Blur/>
    <div id="post-form">
        <Form {user} {organ} />
    </div>
{/if}

{#if $comForm}
    <Blur/>
    <div id="com-form">
        <Temp post={show_post} {user} />
    </div>
{/if}

<table class="heading">
    <tr>
        <td>
            <h5>Posts</h5>
        </td>
        <td>
            {#if can_add_post}
                <button class="btn btn-sm btn-info" on:click="{() => (postForm.set(true))}">Add Post</button>
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
            <PostCard {post} {user} on:message={showComments}/>
            <hr/>
        {/each}
    </div>
{/if}

<style>
    h5 {
        color:#350d22;
    }

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
        background-color: slateblue;
        color:#350d22;
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
        max-height: 600px;
        background-color: slateblue;
        color:#350d22;
    }

    #no-posts {
        text-align: center;
    }

    .post-scroll {
        width:100%;
        height:100%;
        overflow-y: auto;
        color: white;
    }

    .heading {
        width:100%;
    }

    .btn-sm {
        float:right;
    }
</style>