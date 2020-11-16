<script lang="ts">
    import { dynamo, admin, cognito, isAuth, server } from '../../Scripts/Init';
    import type { _admin, _organ, _part_sort } from '../../Scripts/Interface';
    import { v5 as uuidv5 } from 'uuid';

    let email:string;
    let password:string;

    let loading:boolean = false;
    
    async function login() {

        loading = true;

        let { logged, last_name } = await $cognito.signIn(email, password);

        if(logged && last_name != '') {

            let key_value:_part_sort = { 
                part_key: 'id', 
                part_value: uuidv5(email, uuidv5.URL),
                sort_key: 'last_name',
                sort_value: last_name
            }

            let admin_result:any = await $dynamo.getItem('ADMINS', key_value);                                   

            let log_user:_admin = {
                id: admin_result.id,
                photo: admin_result.photo,
                first_name: admin_result.first_name,
                last_name: admin_result.last_name,
                email: admin_result.email,
                birthday: admin_result.birthday,
                address: admin_result.address,
                city: admin_result.city,
                state: admin_result.state,
                country: admin_result.country,
                code: admin_result.code
            }

            await $admin.set_admin(log_user);  
            
            $server.emit('set-id', log_user.email);

            isAuth.set(true);
        } else {

            loading = false;

            console.log('Error Signing In');
        }
    }
</script>

<div id="login"> 
    <form>
        <input class="login-form" placeholder="Email" bind:value="{email}" required />
        <input class="login-form" type="password" placeholder="Password" bind:value="{password}" on:keydown="{e => e.key === 'ENter' && login()}" required />

        <button class="btn btn-info" type="submit" on:click="{login}" disabled="{loading}">
            {#if !loading}
                Login
            {:else}
                <i class="fa fa-spinner fa-spin"></i>
            {/if}
        </button>
    </form>
</div>

<style>
    #login {
        width:300px;
        margin: 0 auto;
        margin-top:25%;
        padding:10px;
    }

    .login-form {
        margin-bottom:20px;
        background-color: #350d22;
        color:white;
        width:100%;
        outline: none;
        border: none;
        border-radius: 0.2rem;
    }

    .btn {
        width:50%;
        margin-left:25%;
    }
</style>