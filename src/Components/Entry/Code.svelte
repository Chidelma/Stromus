<script lang="ts">
    import { cognito, dynamo, admin, isAuth } from '../../Scripts/Init';
    import type { _admin } from '../../Scripts/Interface';

    let code:string;

    async function resend() {
        let resent:boolean = await $cognito.resendConfirmationCode($admin);
    }

    async function confirm() {

        let confirmed:boolean = await $cognito.confirmSignUp(code, $admin);

        if(confirmed) {

            let curr_admin:_admin = {

                id: $admin.get_id(),
                email: $admin.get_email(),
                first_name: $admin.get_first_name(),
                last_name: $admin.get_last_name(),
                photo: $admin.get_photo(),
                address: $admin.get_address(),
                city: $admin.get_city(),
                state: $admin.get_state(),
                code: $admin.get_code(),
                country: $admin.get_country(),
                birthday: $admin.get_birthday()
            }

            let added:boolean = await $dynamo.putItem('ADMINS', curr_admin);

            if(added && $cognito.isAuth())
                isAuth.set(true);
        }
    }
</script>

<input class="form-control" placeholder="Verification Code" bind:value="{code}" required/>

<button class="btn btn-primary" on:click="{resend}">Resend</button>
<button class="btn btn-success" on:click="{confirm}">Confirm</button>

<style>
    .form-control {
        margin-bottom:20px;
    }

    .btn {
        width:48%;
        margin-bottom:20px;
    }

    .btn-primary {
        float:left;
    }

    .btn-success {
        float:right
    }
</style>