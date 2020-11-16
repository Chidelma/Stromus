<script lang="ts">
    import { userForm, server } from '../../Scripts/Init';
    import type { _user, _role, _part_sort, _admin, _invite, _pending } from '../../Scripts/Interface';
    import type Organ from '../../Scripts/Organ';
    import type User from '../../Scripts/User';
    import { v5 as uuidv5 } from 'uuid';

    export let organ:Organ;

    let loading:boolean = false;

    let new_invite:_invite = {
        organ_id: organ.get_id(),
        user_id: '',
        email: ''
    }

    let new_role:_role = {

        user_id: '',
        organ_id: organ.get_id(),

        add_post:true,
        edit_post:true,
        delete_post:true,

        add_user:false,
        edit_user:false,
        delete_user:false,

        add_event:false,
        edit_event:false,
        delete_event:false
    }

    function userExist() {

        let user_exist:boolean = false;

        let user:User = organ.get_users().find(user => user.get_id() == new_invite.user_id);

        if(user != undefined)
            user_exist = true;

        return user_exist;
    }

    function addUser() {

        loading = true;

        new_invite.user_id = uuidv5(new_invite.email, organ.get_id());

        new_role.user_id = uuidv5(new_invite.email, organ.get_id());

        if(!userExist()) {
            $server.emit('send-invite', new_invite, new_role);
        } else {
            console.log('user already exist in this organization')
        }

        loading = false;

        userForm.set(false);
    }
</script>

<h3>New User</h3>
<button class="btn btn-danger btn-sm" on:click="{() => (userForm.set(false))}"><i class="fa fa-close"></i></button>

<input class="user-form" placeholder="Email" bind:value="{new_invite.email}" required/>

<h5>Role</h5>
<hr/>

<table>
    <tr>
        <th class="policy">
            Policy
        </th>
        <th>
            True
        </th>
        <th>
            False
        </th>
    </tr>
    <tr>
        <td class="policy">
            Add Post
        </td>
        <td>
            <input type="radio" checked={new_role.add_post === true} on:change="{() => (new_role.add_post = true)}" />
        </td>
        <td>
            <input type="radio" checked={new_role.add_post === false} on:change="{() => (new_role.add_post = false)}" />
        </td>
    </tr>
    <tr>
        <td class="policy">
            Edit Post
        </td>
        <td>
            <input type="radio" checked={new_role.edit_post === true} on:change="{() => (new_role.edit_post = true)}" />
        </td>
        <td>
            <input type="radio" checked={new_role.edit_post === false} on:change="{() => (new_role.edit_post = false)}" />
        </td>
    </tr>
    <tr>
        <td class="policy">
            Delete Post
        </td>
        <td>
            <input type="radio" checked={new_role.delete_post === true} on:change="{() => (new_role.delete_post = true)}" />
        </td>
        <td>
            <input type="radio" checked={new_role.delete_post === false} on:change="{() => (new_role.delete_post = false)}" />
        </td>
    </tr>
    <tr>
        <td class="policy">
            Add User
        </td>
        <td>
            <input type="radio" checked={new_role.add_user === true} on:change="{() => (new_role.add_user = true)}" />
        </td>
        <td>
            <input type="radio" checked={new_role.add_user === false} on:change="{() => (new_role.add_user = false)}" />
        </td>
    </tr>
    <tr>
        <td class="policy">
            Edit User
        </td>
        <td>
            <input type="radio" checked={new_role.edit_user === true} on:change="{() => (new_role.edit_user = true)}" />
        </td>
        <td>
            <input type="radio" checked={new_role.edit_user === false} on:change="{() => (new_role.edit_user = false)}" />
        </td>
    </tr>
    <tr>
        <td class="policy">
            Delete User
        </td>
        <td>
            <input type="radio" checked={new_role.delete_user === true} on:change="{() => (new_role.delete_user = true)}" />
        </td>
        <td>
            <input type="radio" checked={new_role.delete_user === false} on:change="{() => (new_role.delete_user = false)}" />
        </td>
    </tr>
    <tr>
        <td class="policy">
            Add Event
        </td>
        <td>
            <input type="radio" checked={new_role.add_event === true} on:change="{() => (new_role.add_event = true)}" />
        </td>
        <td>
            <input type="radio" checked={new_role.add_event === false} on:change="{() => (new_role.add_event = false)}" />
        </td>
    </tr>
    <tr>
        <td class="policy">
            Edit Event
        </td>
        <td>
            <input type="radio" checked={new_role.edit_event === true} on:change="{() => (new_role.edit_event = true)}" />
        </td>
        <td>
            <input type="radio" checked={new_role.edit_event === false} on:change="{() => (new_role.edit_event = false)}" />
        </td>
    </tr>
    <tr>
        <td class="policy">
            Delete Event
        </td>
        <td>
            <input type="radio" checked={new_role.delete_event === true} on:change="{() => (new_role.delete_event = true)}" />
        </td>
        <td>
            <input type="radio" checked={new_role.delete_event === false} on:change="{() => (new_role.delete_event = false)}" />
        </td>
    </tr>
</table>

<button class="btn btn-user" on:click="{addUser}" disabled="{new_invite.email.length == 0}">
    {#if !loading}
        Invite User
    {:else}
        <i class="fa fa-spinner fa-spin"></i>
    {/if}
</button>

<style>
    h3 {
        float:left;
    }
    
    .user-form {
        width:100%;
        background-color: #350d22;
        border: none;
        outline:none;
        border-radius: 0.2rem;
        margin-bottom: 20px;
        color:white;
        margin-top:20px;
    }

    .btn-danger {
        float:right;
        border-radius: 50%;
    }

    .btn-user {
        float:right;
        background-color: transparent;
        border-color: #350d22;
        color:#350d22;
        box-shadow: unset;
    }

    .btn-user:hover {
        background-color: #350d22;
        color:white;
    }

    h5 {
        text-align: center;
    }

    .policy {
        text-align: left;
    }

    table {
        width: 100%;
        margin-bottom:20px;
        text-align: center;
    }
</style>