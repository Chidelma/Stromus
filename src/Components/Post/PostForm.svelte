<script lang="ts">
    import { dynamo, postForm } from '../../Scripts/Init';
    import type { _organ, _role, _user, _part_sort, _post } from '../../Scripts/Interface';
    import type Organ from '../../Scripts/Organ';
    import type User from '../../Scripts/User';
    import { v5 as uuidv5 } from 'uuid';
    import Post from '../../Scripts/Post';
    import moment from 'moment';
    import { createEventDispatcher } from 'svelte';

    export let user:User;
    export let organ:Organ;

    let loading:boolean = false;

    const dispatch = createEventDispatcher();

    function refreshPosts():void {
        dispatch('message', {
            text: 'refresh!'
        });
    }

    let new_post:_post = {

        id: '',
        user_id: user.get_id(),
        organ_id: organ.get_id(),

        name: user.get_first_name() + ' ' + user.get_last_name(),
        photo: user.get_photo(),
        date: '',
        msg: ''
    }

    async function addPost() {

        loading = true;

        new_post.id = uuidv5(moment().format(), organ.get_id());

        new_post.date = moment().format('MMMM Do YYYY, h:mm:ss a');

        let added:boolean = await $dynamo.putItem('POSTS', new_post);

        if(added) {
            organ.add_post(new Post(new_post));
            postForm.set(false);
            refreshPosts();
        }

        loading = false;
    }
</script>

<h3>New Post</h3>

<hr/>

<textarea id="post-text" class="form-control" rows="5" bind:value="{new_post.msg}" required></textarea>

<button class="btn btn-danger" on:click="{() => (postForm.set(false))}">Cancel</button>
<button class="btn btn-primary" on:click="{addPost}" disabled="{new_post.msg.length == 0}">
    {#if !loading}
        Post
    {:else}
        <i class="fa fa-spinner fa-spin"></i>
    {/if}
</button>


<style>
    #post-text {
        width:100%;
        margin-bottom: 20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .btn-danger {
        float:left;
    }

    .btn-primary {
        float:right;
    }
</style>