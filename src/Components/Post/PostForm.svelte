<script lang="ts">
    import { postForm, server } from '../../Scripts/Init';
    import type { _organ, _role, _user, _part_sort, _post } from '../../Scripts/Interface';
    import type Organ from '../../Scripts/Organ';
    import type User from '../../Scripts/User';
    import { v5 as uuidv5 } from 'uuid';
    import moment from 'moment';

    export let user:User;
    export let organ:Organ;

    let loading:boolean = false;

    let new_post:_post = {

        id: '',
        user_id: user.get_id(),
        organ_id: organ.get_id(),

        name: user.get_first_name() + ' ' + user.get_last_name(),
        photo: user.get_photo(),
        date: '',
        msg: ''
    }

    function addPost() {

        loading = true;

        new_post.id = uuidv5(moment().format(), organ.get_id());

        new_post.date = moment().format('YYYY-MM-DD[T]HH:mm:ss');

        $server.emit('add-post', new_post);

        loading = false;
    }
</script>

<h3>New Post</h3>
<button class="btn btn-danger btn-sm" on:click="{() => (postForm.set(false))}"><i class="fa fa-close"></i></button>

<textarea id="post-text" class="post-form" rows="5" bind:value="{new_post.msg}" placeholder="{organ.get_name()} Post" required></textarea>

<button class="btn post-btn" on:click="{addPost}" disabled="{new_post.msg.length == 0}">
    {#if !loading}
        Post
    {:else}
        <i class="fa fa-spinner fa-spin"></i>
    {/if}
</button>


<style>
    h3 {
        float:left;
    }

    #post-text {
        background-color: #350d22;
        width: 100%;
        outline: none;
        border:none;
        border-radius:0.4rem;
        color:white;
        margin-top:20px;
    }

    .btn-danger {
        float:right;
        border-radius:50%;
    }

    .post-btn {
        float:right;
        background-color: transparent;
        border-color: #350d22;
        color:#350d22;
        box-shadow: unset;
    }

    .post-btn:hover {
        color:white;
        background-color: #350d22;
    }
</style>