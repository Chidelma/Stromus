<script lang="ts">
    import type Organ from '../../Scripts/Organ';
    import type User from '../../Scripts/User';
    import type { _user, _role, _part_sort, _pending } from '../../Scripts/Interface';
    import { userForm, userCard, server, admin, online } from '../../Scripts/Init';
    import Blur from '../BlurScreen.svelte';
    import Form from './UserForm.svelte';
    import Card from './UserCard.svelte';

    export let organ:Organ;
    export let user:User;

    $server.emit('go-online', {
        user_id: user.get_id(),
        organ_id: organ.get_id()
    });

    let users:User[] = organ.get_users();
    let pends:_pending[] = organ.get_pends();

    let view_user:User;

    let can_add_user:boolean = false;
    let search_user:string = '';

    $server.on('recv-invite', _pend => {
        organ.add_pend(_pend);
        pends = organ.get_pends();
    });

    $server.on('online', (user_id) => {

        $online.add(user_id);

        online.set($online);

        $server.emit('go-online', {
            user_id: user.get_id(),
            organ_id: organ.get_id(),
            admin_id: $admin.get_id()
        });
    });

    $server.on('offline', (user_id) => {

        $online.delete(user_id);

        online.set($online);

        $server.emit('go-online', {
            user_id: user.get_id(),
            organ_id: organ.get_id(),
            admin_id: $admin.get_id()
        });
    });

    function find_user(): void {
        if(search_user.length > 0)
            users = users.filter(user => user.get_first_name().includes(search_user) || user.get_last_name().includes(search_user));
    }

    function viewUser(user:User) {
        view_user = user;
        view_user.set_posts(organ.get_posts().filter(post => post.get_user_id() == user.get_id()));
        userCard.set(true);
    }
</script>

{#if $userForm}
    <Blur/>
    <div id="user-form">
        <Form {organ} />
    </div>
{/if}

{#if $userCard}
    <Blur/>
    <div id="user-card">
        <Card {user} {view_user} {organ} />
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
        <button class="btn btn-light user btn-sm" on:click="{() => (viewUser(user))}">
            {#if $online.has(user.get_id())}
                <i class="fa fa-circle"></i>
            {/if}

             {user.get_last_name()}, {user.get_first_name().toLowerCase()}
        </button>
        <hr/>
    {/each}

    <h5>Pending</h5>
    <hr/>
    {#each pends as pend}
        <button class="btn btn-light user btn-sm">
            {pend.email}
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

    .fa-circle {
        font-size: smaller;
        color:green;
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