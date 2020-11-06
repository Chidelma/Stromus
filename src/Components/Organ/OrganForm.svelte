<script lang="ts">
    import { admin, dynamo, organForm } from '../../Scripts/Init';
    import type { _organ, _role, _user, _part_sort } from '../../Scripts/Interface';
    import Organ from '../../Scripts/Organ';
    import Role from '../../Scripts/Role';
    import User from '../../Scripts/User';
    import { v5 as uuidv5 } from 'uuid';

    let new_organ:_organ = {
        id: '',
        admin_id: $admin.get_id(),
        name: '',
        founded: '',
        address: '',
        city: '',
        state: '',
        country: '',
        code: '',
        photo: ''
    }

    let loading:boolean = false;

    async function addOrgan() {

        loading = true;

        new_organ.id = uuidv5(new_organ.name, $admin.get_id());

        let key_value:_part_sort = {
            part_key: 'name',
            part_value: new_organ.name
        }

        let results:any[] = await $dynamo.queryIndex('ORGANS', 'name-index', key_value);

        if(results.length == 0) {

            let organ:Organ = new Organ(new_organ);

            let added:boolean = await $dynamo.putItem('ORGANS', new_organ);

            if(added) {

                let first_user:User = await firstUser(organ.get_id());

                let admin_role:Role = await adminRole(first_user.get_id(), organ.get_id());

                first_user.set_role(admin_role);

                organ.add_user(first_user);

                $admin.add_organ(organ);

                organForm.set(false);
            }
        }

        loading = false;
    }

    async function adminRole(user_id:string, organ_id:string):Promise<Role> {

        let curr_role:_role = {

            user_id,
            organ_id,

            add_post:true,
            edit_post:true,
            delete_post:true,

            add_user:true,
            edit_user:true,
            delete_user:true,

            add_event:true,
            edit_event:true,
            delete_event:true
        }

        let admin_role:Role = new Role(curr_role);

        await $dynamo.putItem('ROLES', curr_role);

        return admin_role;
    }

    async function firstUser(organ_id:string):Promise<User> {

        let curr_user:_user = {
            id: uuidv5($admin.get_email(), organ_id),
            organ_id,

            photo: $admin.get_photo(),
            first_name: $admin.get_first_name(),
            last_name: $admin.get_last_name(),
            email: $admin.get_email()
        }

        let first_user:User = new User(curr_user);

        await $dynamo.putItem('USERS', curr_user);

        return first_user;
    }
</script>

<h3>New Organisation</h3>

<hr/>

<input class="form-control" placeholder="Organisation Name" bind:value="{new_organ.name}" required />

<input class="form-control" type="date" placeholder="birthday" bind:value="{new_organ.founded}" />
<input class="form-control" placeholder="Address" bind:value="{new_organ.address}" />
<input class="form-control left-half" placeholder="City" bind:value="{new_organ.city}"/>
<input class="form-control right-half" placeholder="State/province" bind:value="{new_organ.state}" />
<input class="form-control left-half" placeholder="Country" bind:value="{new_organ.country}" />
<input class="form-control right-half" placeholder="Postal/Zip Code" bind:value="{new_organ.code}" />

<button class="btn btn-danger" on:click="{() => (organForm.set(false))}">Cancel</button>
<button class="btn btn-primary" on:click="{addOrgan}" disabled="{new_organ.name.length == 0}">
    {#if !loading}
        Add
    {:else}
        <i class="fa fa-spinner fa-spin"></i>
    {/if}
</button>

<style>
    h3 {
        text-align: center;
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

    .btn-danger {
        float:left;
    }

    .btn-primary {
        float:right;
    }
</style>