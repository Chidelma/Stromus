<script lang="ts">
    import type User from '../../Scripts/User';
    import type Organ from '../../Scripts/Organ';
    import Role from '../../Scripts/Role';
    import PostCard from '../Post/PostCard.svelte';
    import { userCard, server } from '../../Scripts/Init';
    import type Post from '../../Scripts/Post';
    import type { _chat, _msg, _part_sort, _chatbox, _role } from '../../Scripts/Interface';

    export let view_user:User;
    export let user:User;
    export let organ:Organ;

    let user_role:Role = view_user.get_role();

    let edit_role:_role = {
        add_post: user_role.can_add_post(),
        edit_post: user_role.can_edit_post(),
        delete_post: user_role.can_delete_post(),

        add_event: user_role.can_add_event(),
        edit_event: user_role.can_edit_event(),
        delete_event: user_role.can_delete_event(),

        add_user: user_role.can_add_user(),
        edit_user: user_role.can_edit_user(),
        delete_user: user_role.can_delete_user(),

        organ_id: user_role.get_organ_id(),
        user_id: user_role.get_user_id()
    }

    let posts:Post[] = view_user.get_posts();

    let editing:boolean = false;

    $server.emit('new-role', (new_role:_role) => {
        if(new_role.user_id == edit_role.user_id) {
            view_user.set_role(new Role(new_role));
            editing = false;
        }
    });

    function formatName(user:User):string {

        let first_inital:string = user.get_first_name()[0];
        let rem_first_name:string = user.get_first_name().substring(1, user.get_first_name().length).toLowerCase();
        let last_initial:string = user.get_last_name()[0];

        return first_inital+rem_first_name + ' ' + last_initial + '.';
    }

    function deleteUser() {

        let sure:boolean = confirm('Are you sure you want to delete user?');

        if(sure) {

            let key_value:_part_sort = {
                part_key: 'organ_id',
                part_value: organ.get_id(),
                sort_key: 'id',
                sort_value: view_user.get_id()
            }

            $server.emit('delete-user', key_value);
        }
    }

    function editUser() {
        $server.emit('edit-role', edit_role);
    }
</script>

<button class="btn btn-danger btn-sm" on:click="{() => (userCard.set(false))}"><i class="fa fa-close"></i></button>

{#if !editing}
    <h4>{formatName(view_user)}'s posts</h4>
{:else}
    <h4>Role</h4>
{/if}

{#if !editing}
    <div id="scroll">
        {#each posts as post}
            <PostCard {post} user={view_user} />
            <hr/>
        {/each}
    </div>
{:else}
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
                <input type="radio" checked={edit_role.add_post === true} on:change="{() => (edit_role.add_post = true)}" />
            </td>
            <td>
                <input type="radio" checked={edit_role.add_post === false} on:change="{() => (edit_role.add_post = false)}" />
            </td>
        </tr>
        <tr>
            <td class="policy">
                Edit Post
            </td>
            <td>
                <input type="radio" checked={edit_role.edit_post === true} on:change="{() => (edit_role.edit_post = true)}" />
            </td>
            <td>
                <input type="radio" checked={edit_role.edit_post === false} on:change="{() => (edit_role.edit_post = false)}" />
            </td>
        </tr>
        <tr>
            <td class="policy">
                Delete Post
            </td>
            <td>
                <input type="radio" checked={edit_role.delete_post === true} on:change="{() => (edit_role.delete_post = true)}" />
            </td>
            <td>
                <input type="radio" checked={edit_role.delete_post === false} on:change="{() => (edit_role.delete_post = false)}" />
            </td>
        </tr>
        <tr>
            <td class="policy">
                Add User
            </td>
            <td>
                <input type="radio" checked={edit_role.add_user === true} on:change="{() => (edit_role.add_user = true)}" />
            </td>
            <td>
                <input type="radio" checked={edit_role.add_user === false} on:change="{() => (edit_role.add_user = false)}" />
            </td>
        </tr>
        <tr>
            <td class="policy">
                Edit User
            </td>
            <td>
                <input type="radio" checked={edit_role.edit_user === true} on:change="{() => (edit_role.edit_user = true)}" />
            </td>
            <td>
                <input type="radio" checked={edit_role.edit_user === false} on:change="{() => (edit_role.edit_user = false)}" />
            </td>
        </tr>
        <tr>
            <td class="policy">
                Delete User
            </td>
            <td>
                <input type="radio" checked={edit_role.delete_user === true} on:change="{() => (edit_role.delete_user = true)}" />
            </td>
            <td>
                <input type="radio" checked={edit_role.delete_user === false} on:change="{() => (edit_role.delete_user = false)}" />
            </td>
        </tr>
        <tr>
            <td class="policy">
                Add Event
            </td>
            <td>
                <input type="radio" checked={edit_role.add_event === true} on:change="{() => (edit_role.add_event = true)}" />
            </td>
            <td>
                <input type="radio" checked={edit_role.add_event === false} on:change="{() => (edit_role.add_event = false)}" />
            </td>
        </tr>
        <tr>
            <td class="policy">
                Edit Event
            </td>
            <td>
                <input type="radio" checked={edit_role.edit_event === true} on:change="{() => (edit_role.edit_event = true)}" />
            </td>
            <td>
                <input type="radio" checked={edit_role.edit_event === false} on:change="{() => (edit_role.edit_event = false)}" />
            </td>
        </tr>
        <tr>
            <td class="policy">
                Delete Event
            </td>
            <td>
                <input type="radio" checked={edit_role.delete_event === true} on:change="{() => (edit_role.delete_event = true)}" />
            </td>
            <td>
                <input type="radio" checked={edit_role.delete_event === false} on:change="{() => (edit_role.delete_event = false)}" />
            </td>
        </tr>
    </table>
{/if}

{#if !editing}
    {#if user.get_id() != view_user.get_id()}
        {#if user.get_role().can_delete_user()}
            <button class="btn btn-sm del-btn" on:click="{deleteUser}">Delete User</button>
        {/if}

        {#if user.get_role().can_edit_user()}
            <button class="btn btn-sm edt-btn" on:click="{() => (editing = true)}">Edit Role</button>
        {/if}
    {/if}
{:else}
    <button class="btn btn-sm del-btn" on:click="{editUser}">Change</button>
    <button class="btn btn-sm edt-btn" on:click="{() => (editing = false)}">Cancel</button>
{/if}

<style>
    h4 {
        float:left;
    }

    table {
        width:100%;
        text-align: center;
    }

    #scroll {
        margin-top:50px;
        max-height: 500px;
        overflow-y: auto;
        width: 100%;
    }

    .policy {
        text-align: left;
    }

    .btn-danger {
        float:right;
        border-radius: 50%;
    }

    .del-btn, .edt-btn {
        margin-top:10px;
        float: right;
        background-color: transparent;
        color:#350d22;
        border-color: #350d22;
        box-shadow:unset;
        margin-left:10px;
    }

    .del-btn:hover, .edt-btn:hover {
        color:white;
        background-color: #350d22;
    }
</style>