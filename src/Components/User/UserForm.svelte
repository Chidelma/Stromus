<script lang="ts">
    import { dynamo, userForm } from '../../Scripts/Init';
    import type { _user, _role, _part_sort } from '../../Scripts/Interface';
    import type Organ from '../../Scripts/Organ';
    import User from '../../Scripts/User';
    import { v5 as uuidv5 } from 'uuid';
    import Role from '../../Scripts/Role';
    import { createEventDispatcher } from 'svelte';

    export let organ:Organ;

    let loading:boolean = false;

    const dispatch = createEventDispatcher();

    function refreshUsers():void {
        dispatch('message', {
            text: 'refresh!'
        });
    }

    let new_user:_user = {
        organ_id: organ.get_id(),
        email: '',
        id: '',
        first_name: '',
        last_name: '',
        photo: ''
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

    async function userExist(): Promise<boolean> {

        let user_exist:boolean = false;

        let key_value:_part_sort = {
            part_key: 'organ_id',
            part_value: organ.get_id(),
            sort_key: 'id',
            sort_value: new_user.id
        }

        let result:any = await $dynamo.getItem('USERS', key_value);

        if(result != undefined)
            user_exist = true;

        return user_exist;
    }


    async function adminExist(): Promise<boolean> {

        let found:boolean = false;

        let key_value:_part_sort = {
            part_key: 'last_name',
            part_value: new_user.last_name
        }

        let results:any[] = await $dynamo.queryItem('ADMINS', key_value);

        for(let i = 0; i < results.length; i++) {
            if(results[i].first_name == new_user.first_name.toUpperCase() && results[i].email == new_user.email) {
                found = true;
                break;
            }
        }

        return found;
    }

    async function addUser() {

        loading = true;

        new_user.id = uuidv5(new_user.email, organ.get_id());

        new_role.user_id = uuidv5(new_user.email, organ.get_id());

        let user_exist:boolean = await userExist();

        if(!user_exist) {

            let admin_exist:boolean = await adminExist();

            let user_added:boolean = await $dynamo.putItem('USERS', new_user);

            let role_added:boolean = await $dynamo.putItem('ROLES', new_role);

            if(user_added && role_added) {

                let curr_user:User = new User(new_user);

                curr_user.set_role(new Role(new_role));

                organ.add_user(curr_user);

                refreshUsers();

                if(!admin_exist) {


                }
            }

        } else {
            console.log('user already exist in this organization')
        }

        loading = false;

        userForm.set(false);
    }
</script>

<h3>New User</h3>

<hr/>

<input class="form-control left-half" placeholder="First Name" bind:value="{new_user.first_name}" required/>
<input class="form-control right-half" placeholder="Last Name" bind:value="{new_user.last_name}" required/>

<input class="form-control" placeholder="Email" bind:value="{new_user.email}" required/>

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

<button class="btn btn-danger" on:click="{() => (userForm.set(false))}">Cancel</button>
<button class="btn btn-primary" on:click="{addUser}" disabled="{new_user.email.length == 0}">
    {#if !loading}
        Add User
    {:else}
        <i class="fa fa-spinner fa-spin"></i>
    {/if}
</button>

<style>
    .form-control {
        margin-bottom: 20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .btn-danger {
        float:left;
    }

    .btn-primary {
        float:right;
    }

    .form-control {
        margin-bottom:20px;
    }

    .left-half {
        width:48%;
        float:left;
    }

    .right-half {
        width:48%;
        float:right;
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