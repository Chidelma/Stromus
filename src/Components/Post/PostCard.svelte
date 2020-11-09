<script lang="ts">
    import type Post from "../../Scripts/Post";
    import moment from 'moment';
    import type User from '../../Scripts/User';
    import type { _part_sort, _like, _post, _comment } from '../../Scripts/Interface';
    import { dynamo } from '../../Scripts/Init';
    import { createEventDispatcher } from 'svelte';

    export let post:Post;
    export let user:User;

    let likes:number = post.get_likes();
    let com_len:number = post.get_comments().length;

    const dispatch = createEventDispatcher();

    setInterval(() => {
        if(post.get_comments().length > com_len)
            com_len = post.get_comments().length;
    }, 1000);

    function showComments() {
        dispatch('message', {
            post: post
        });
    }

    function get_time_span(date:string): string {
        return moment(date, "'YYYY-MM-DD[T]HH:mm:ss'").fromNow();
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

            let incremented:boolean = await $dynamo.putItem('LIKES', key_value);

            if(incremented)
                post.increment_likes();

        } else {

            let key_value:_part_sort = {
                part_key: 'post_id',
                part_value: post.get_id(),
                sort_key: 'user_id',
                sort_value: user.get_id()
            }

            let decremented:boolean = await $dynamo.removeItem('LIKES', key_value);

            if(decremented)
                post.decrement_likes();
        }

        likes = post.get_likes();
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
    <tr>
        <td class="left-btn">
            <button class="btn btn-light btn-sm" on:click="{upDownLike}"><i class="fa fa-heart"></i> {likes}</button>
        </td>
        <td class="right-btn">
            <button class="btn btn-light btn-sm" on:click="{showComments}"><i class="fa fa-comments"></i> {com_len}</button>
        </td>
    </tr>
</table>

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

    .btn {
        box-shadow: unset;
        width:100%;
    }

    .left-btn {
        width:50%;
    }

    .right-btn {
        width:50%;
    }
</style>