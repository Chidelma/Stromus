<script lang="ts">
    import { admin, server } from '../Scripts/Init';
    import type { _invite } from '../Scripts/Interface';

    let invites:_invite[] = $admin.get_invites();

    $server.on('recv-invite', _invite => {

        admin.update(admin => {
            admin.add_invite(_invite);
            return admin;
        });

        invites = $admin.get_invites();
    });
</script>

<button class="btn btn-light">
    <img id="pro-pic" src="{$admin.get_photo()}" alt="pro-pic"/>
    HI {$admin.get_first_name()}!
    {#if invites.length > 0}
         <i class="fa fa-bell"></i>
    {/if}
</button>

<style>
    .btn {
        position:fixed;
        top:10px;
        right:20px;
    }

    #pro-pic {
        width:20px;
        height:20px;
    }

    .fa-bell {
        color: goldenrod
    }
</style>