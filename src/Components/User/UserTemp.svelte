<script lang="ts">
    import type Organ from '../../Scripts/Organ';
    import type User from '../../Scripts/User';
    import type Post from '../../Scripts/Post';
    import type { _user, _role, _part_sort } from '../../Scripts/Interface';
    import { userForm, admin, user, userCard } from '../../Scripts/Init';
    import Blur from '../BlurScreen.svelte';
    import Form from './UserForm.svelte';
    import Card from './UserCard.svelte';
    import { onMount } from 'svelte';

    export let organ:Organ;

    let users:User[] = organ.get_users();
    let can_add_user:boolean = false;
    let curr_user:User;

    setInterval(async () => {
        await organ.setup_users();
        users = organ.get_users();
    }, 30000);

    function refreshUsers(event:any):void {
        users = organ.get_users();
    }

    function set_user(): void {

        let users:User[] = organ.get_users();

        for(let i = 0; i < users.length; i++) {

            if(users[i].get_email() == $admin.get_email()) {
                user.set(users[i]);
                can_add_user = users[i].get_role().can_add_post();
                break;
            }
        }
    }

    function viewUser(user:User) {

        let posts:Post[] = organ.get_posts();

        let user_posts:Post[] = [];

        for(let i = 0; i < posts.length; i++) {
            if(posts[i].get_user_id() == user.get_id())
                user_posts.push(posts[i]);
        }

        user.set_posts(user_posts);

        curr_user = user;
        userCard.set(true);
    }

    onMount(() => {
        set_user();
    });
</script>

{#if $userForm}
    <Blur/>
    <div id="user-form">
        <Form {organ} on:message={refreshUsers} />
    </div>
{/if}

{#if $userCard}
    <Blur/>
    <div id="user-card">
        <Card {curr_user} />
    </div>
{/if}

<table class="heading">
    <tr>
        <td>
            <h5>Users</h5>
        </td>
        <td>
            {#if can_add_user}
                <button class="btn btn-sm btn-primary" on:click="{() => (userForm.set(true))}">Add User</button>
            {/if}
        </td>
    </tr>
</table>

<hr/>

{#if users.length == 0}
    <p id="no-users">There are no Users for {organ.get_name()}</p>
{:else}
    <div class="user-scroll">
        {#each users as user}
            <button class="btn btn-light user" on:click="{() => (viewUser(user))}">
                {user.get_last_name()}, {user.get_first_name().toLowerCase()}
            </button>
            <hr/>
        {/each}
    </div>
{/if}


<style>
    #user-form, #user-card {
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
    }

    #no-users {
        text-align: center;
    }

    .heading {
        width:100%;
    }

    .btn-sm {
        float:right;
    }

    .user {
        box-shadow: unset;
        width:100%;
        text-align: left;
    }

    .user-scroll {
        width:100%;
        height:100%;
        overflow-y: auto;
    }
</style>