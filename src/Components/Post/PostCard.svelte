<script lang="ts">
    import type Post from "../../Scripts/Post";
    import Comment from '../../Scripts/Comment';
    import moment from 'moment';
    import type User from '../../Scripts/User';
    import type { _part_sort, _like, _post, _comment } from '../../Scripts/Interface';
    import { dynamo, server, admin } from '../../Scripts/Init';
    import { createEventDispatcher } from 'svelte';

    export let post:Post;
    export let user:User;

    let likes:number = post.get_likes();
    let com_len:number = post.get_comments().length;

    let editing:boolean = false;
    let live_post:string = post.get_msg();

    const dispatch = createEventDispatcher();

    $server.on('recv-comment', (comment:_comment) => {
        if(comment.post_id == post.get_id()) {
            post.add_comment(new Comment(comment));
            com_len = post.get_comments().length;
        }
    });

    $server.on('recv-uplike', (like:_like) => {
        if(like.post_id == post.get_id()) {
            post.increment_likes();
            likes = post.get_likes();
        }
    });

    $server.on('recv-downlike', (like:_part_sort) => {
        if(like.part_value == post.get_id()) {
            post.decrement_likes();
            likes = post.get_likes();
        }
    });

    $server.on('new-post', (new_post:_post) => {
        if(new_post.id == post.get_id() && new_post.msg != live_post) {
            if(editing)
                editing = false;
            else
                post.set_msg(live_post);
        }
    });

    function showComments() {
        dispatch('message', {
            post: post
        });
    }

    function get_time_span(date:string): string {
        return moment(date, 'YYYY-MM-DD[T]HH:mm:ss').fromNow();
    }

    async function likeExist(): Promise<boolean> {

        let liked:boolean = false;

        let key_value:_part_sort = {
            part_key: 'post_id',
            part_value: post.get_id(),
            sort_key: 'user_id',
            sort_value: user.get_id()
        }

        let result:any = await $dynamo.getItem('LIKES', key_value);

        if(result != undefined)
            liked = true;

        return liked;
    }

    async function upDownLike(): Promise<void> {

        let liked:boolean = await likeExist();

        if(!liked) {

            let key_value:_like = {
                post_id: post.get_id(),
                user_id: user.get_id()
            }

            $server.emit('add-like', key_value);

        } else {

            let key_value:_part_sort = {
                part_key: 'post_id',
                part_value: post.get_id(),
                sort_key: 'user_id',
                sort_value: user.get_id()
            }

            $server.emit('remove-like', key_value);
        }
    }

    function formatName(name:string):string {

        let names:string[] = name.split(' ');

        if(names.length > 1) {

            let first_inital:string = names[0][0];
            let rem_first_name:string = names[0].substring(1, names[0].length);
            let last_initial:string = names[1][0];

            return first_inital+rem_first_name.toLowerCase() + ' ' + last_initial + '.';
        } else {
            return name;
        }
    }

    function editPost() {

        if(live_post != post.get_msg() && live_post.length > 0) {

            let key_value:_part_sort = {
                part_key: 'organ_id',
                part_value: post.get_organ_id(),
                sort_key: 'id',
                sort_value: post.get_id()
            }

            $server.emit('edit-post', { key_value, live_post });
        }
    }

    function deletePost() {

        let sure:boolean = confirm('Are you sure you want to delete this post?');

        if(sure) {

            let key_value:_part_sort = {
                part_key: 'organ_id',
                part_value: post.get_organ_id(),
                sort_key: 'id',
                sort_value: post.get_id()
            }

            $server.emit('delete-post', key_value);
        }
    }
</script>

<table cellpadding="5">
    <tr>
        <td class="pic-row" colspan="2">
            <img class="pic" src="{post.get_photo()}" alt="pic" />
            <span class="name">{formatName(post.get_name())}</span>
            <span class="date">{get_time_span(post.get_date())}</span>
        </td>
    </tr>
    <tr>
        <td>
            {#if !editing}
                <p>{post.get_msg()}</p>
            {:else}
                <textarea class="post-edit" bind:value="{live_post}"></textarea>
                <button class="btn btn-sm" on:click="{editPost}">Re-Post</button>
                <button class="btn btn-sm" on:click="{() => (editing = false)}">Cancel</button>
            {/if}
        </td>
    </tr>
    <tr>
        <td>
            {#if user.get_id() == post.get_user_id()}
                {#if user.get_role().can_delete_post()}
                    <button class="btn btn-sm" on:click="{deletePost}">Delete</button>
                {/if}
                
                {#if user.get_role().can_edit_post() && !editing}
                    <button class="btn btn-sm" on:click={() => (editing = true)}>Edit</button>
                {/if}
            {:else if user.get_email() == $admin.get_email()}
                <button class="btn btn-sm" on:click="{deletePost}">Delete</button>
            {/if}

            <button class="btn btn-sm" on:click="{showComments}"><i class="fa fa-comment"></i> {com_len}</button>
            <button class="btn btn-sm" on:click="{upDownLike}"><i class="fa fa-heart"></i> {likes}</button>
            <button class="btn btn-sm"><i class="fa fa-share-alt"></i></button>
        </td>
    </tr>
</table>

<style>
    table {
        width:100%;
        color:#eee;
        background-color: #350d22;
        border-radius: 0.4rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .pic {
        border-radius: 0.4rem;
        width: 30px;
        height: 30px;
        float:left
    }

    .post-edit {
        width:100%;
    }

    .name, .date {
        font-size: smaller;
    }

    .name {
        margin-left: 10px;
    }

    .date {
        float:right;
    }

    .btn, .btn:hover {
        box-shadow: unset;
        margin-left:10px;
        float:right;
        color:white;
        background-color: transparent;
        border-color: #350d22;
    }
</style>