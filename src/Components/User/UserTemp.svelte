<script lang="ts">
    import type Organ from '../../Scripts/Organ';
    import type User from '../../Scripts/User';
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
    let search_user:string = '';

    setInterval(async () => {
        await organ.setup_users();
        users = organ.get_users();
    }, 30000);

    function refreshUsers(event:any):void {
        users = organ.get_users();
    }

    function set_user(): void {
        let curr_user:User = organ.get_users().find(user => user.get_email() == $admin.get_email());
        user.set(curr_user);
        can_add_user = curr_user.get_role().can_add_user();
    }

    function find_user(): void {
        if(search_user.length > 0)
            users = users.filter(user => user.get_first_name().includes(search_user) || user.get_last_name().includes(search_user));
    }

    function viewUser(user:User) {
        user.set_posts(organ.get_posts().filter(post => post.get_user_id() == user.get_id()));
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
        <Card {curr_user} {organ} />
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
<input class="form-control" placeholder="Search User" bind:value="{search_user}" on:keyup="{find_user}"/>
<hr/>

<div class="user-scroll">
    {#each users as user}
        <button class="btn btn-light user" on:click="{() => (viewUser(user))}">
            {user.get_last_name()}, {user.get_first_name().toLowerCase()}
        </button>
        <hr/>
    {/each}
</div>


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

    .form-control {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        width: 100%;
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