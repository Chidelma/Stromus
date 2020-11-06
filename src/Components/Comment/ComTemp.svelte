<script lang="ts">
    import type Post from '../../Scripts/Post';
    import Comment from '../../Scripts/Comment';
    import moment from 'moment';
    import { comForm, dynamo } from '../../Scripts/Init';
    import type { _comment, _part_sort } from '../../Scripts/Interface';
    import { v5 as uuidv5 } from 'uuid';
    import type User from '../../Scripts/User';
    import ComCard from './ComCard.svelte';
    import { createEventDispatcher } from 'svelte';

    export let post:Post;
    export let user:User;

    let comments:Comment[] = post.get_comments();

    let loading:boolean = false;

    const dispatch = createEventDispatcher();

    setInterval(async () => {
        await post.setup_comments();
        comments = post.get_comments()
    }, 30000);

    function updatePost():void {
        dispatch('message', {
            post: post
        });
    }

    let new_com:_comment = {

        id: '',
        post_id: post.get_id(),
        user_id: user.get_id(),

        msg: '',
        date: '',
        name: user.get_first_name() + ' ' + user.get_last_name(),
        photo: user.get_photo()
    }

    function get_time_span(date:string): string {
        return moment(date, "MMMM Do YYYY, h:mm:ss a").fromNow();
    }

    async function post_comment():Promise<void> {

        loading = true;

        new_com.id = uuidv5(moment().format(), post.get_id());
        new_com.date = moment().format('MMMM Do YYYY, h:mm:ss a');

        let posted:boolean = await $dynamo.putItem('COMMENTS', new_com);

        if(posted) {
            post.add_comment(new Comment(new_com));
            new_com.msg = '';
            new_com.date = '';
            loading = false;
            comments = post.get_comments();
            updatePost();
        }
    }
</script>

<table cellpadding="5">
    <tr>
        <td class="pic-row" colspan="2">
            <img class="pic" src="{post.get_photo()}" alt="pic" />
            <span class="name">{post.get_name().toLowerCase()}</span>
            <span class="date">{get_time_span(post.get_date())}</span>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <p>{post.get_msg()}</p>
        </td>
    </tr>
</table>

<hr/>
<h5>Comments</h5>
<hr/>

<textarea class="form-control" rows="3" bind:value="{new_com.msg}"></textarea>

<button class="btn btn-danger" on:click="{() => (comForm.set(false))}">Cancel</button>
<button class="btn btn-primary" on:click="{post_comment}" disabled="{new_com.msg.length == 0}">
    {#if !loading}
        Comment
    {:else}
        <i class="fa fa-spinner fa-spin"></i>
    {/if}
</button>


<div class="com-scroll">
    {#each comments as comment}
        <ComCard {comment} />
        <hr/>
    {/each}
</div>

<style>
    table {
        width:100%;
    }

    .pic {
        border-radius: 50%;
        width: 30px;
        height: 30px;
        float:left
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

    .form-control {
        margin-bottom:20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .btn-danger {
        float:left;
    }

    .btn-primary {
        float:right;
    }

    .com-scroll {
        overflow-y: auto;
        width:100%;
        margin-top:100px;
    }
</style>