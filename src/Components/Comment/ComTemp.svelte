<script lang="ts">
    import type Post from '../../Scripts/Post';
    import type Comment from '../../Scripts/Comment';
    import moment from 'moment';
    import { comForm, server } from '../../Scripts/Init';
    import type { _comment, _part_sort } from '../../Scripts/Interface';
    import { v5 as uuidv5 } from 'uuid';
    import type User from '../../Scripts/User';
    import ComCard from './ComCard.svelte';

    export let post:Post;
    export let user:User;

    let comments:Comment[] = post.get_comments();

    let loading:boolean = false;

    $server.on('recv-comment', (comment:_comment) => {
        if(comment.post_id == post.get_id()) {
            new_com.msg = '';
            new_com.date = '';
            loading = false;
            comments = post.get_comments();
        }
    });

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
        return moment(date, 'YYYY-MM-DD[T]HH:mm:ss').fromNow();
    }

    async function post_comment():Promise<void> {

        loading = true;

        new_com.id = uuidv5(moment().format(), post.get_id());
        new_com.date = moment().format('YYYY-MM-DD[T]HH:mm:ss');

        $server.emit('add-comment', new_com);
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
</script>

<h5>Comments</h5>

<button class="btn btn-danger btn-sm" on:click="{() => (comForm.set(false))}"><i class="fa fa-close"></i></button>

<table cellpadding="5">
    <tr>
        <td class="pic-row" colspan="2">
            <img class="pic" src="{post.get_photo()}" alt="pic" />
            <span class="name">{formatName(post.get_name())}</span>
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

<textarea class="com-post" rows="3" bind:value="{new_com.msg}" placeholder="Comment"></textarea>

<button class="btn btn-com" on:click="{post_comment}" disabled="{new_com.msg.length == 0}">
    {#if !loading}
        Post Comment
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
    h5 {
        float:left;
    }

    table {
        width:100%;
        margin-top:50px;
        background-color: #350d22;
        color:white;
        border-radius: 0.4rem;
        margin-bottom:20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .pic {
        border-radius: 0.4rem;
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

    .com-post {
        margin-bottom:10px;
        width:100%;
        background-color: #eee;
        outline:none;
        border:none;
        border-radius: 0.2rem;
        color:white;
        background-color: #350d22;
    }

    .btn-danger {
        float:right;
        border-radius: 50%;
    }

    .btn-com {
        float:right;
        color:#350d22;
        background-color: transparent;
        border-color: #350d22;
        box-shadow: unset;
    }

    .btn-com:hover {
        background-color: #350d22;
        color:white;
    }

    .com-scroll {
        overflow-y: auto;
        width:100%;
        margin-top:10px;
    }
</style>