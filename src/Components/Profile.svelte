<script lang="ts">
    import { admin, server } from '../Scripts/Init';
    import type { _invite } from '../Scripts/Interface';

    let invites:_invite[] = $admin.get_invites();

    $server.on('recv-invite', (invite:_invite) => {

        if(invite.email == $admin.get_email()) {

            admin.update(admin => {
                admin.add_invite(invite);
                return admin;
            });

            invites = $admin.get_invites();
        }
    });
</script>

<button class="btn btn-info">
    <img id="pro-pic" src="{$admin.get_photo()}" alt="pro-pic"/>
    HI {$admin.get_first_name()}! <span class="badge badge-dark">{invites.length}</span>
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
</style>