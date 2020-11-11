<script lang="ts">
    import type Organ from '../../Scripts/Organ';
    import type User from '../../Scripts/User';
    import USERS from '../User/UserTemp.svelte';
    import POSTS from '../Post//PostTemp.svelte';
    import EVENTS from '../Event/EventTemp.svelte';
    import { admin, server } from '../../Scripts/Init';

    export let organ:Organ;
    let user:User = organ.get_user();

    $server.emit('join-organ', (organ.get_id()) );
</script>

<div id="posts">
    <POSTS {organ} {user} />
</div>

<div id="events">
    <EVENTS {organ} {user} />
</div>

<div id="users">
    <USERS {organ} {user} />
</div>

<style>
    #posts {
        width:40%;
        float:left;
        padding-right:20px;
        border-right: 1px solid #dee2e6;
        padding-bottom: 20px;
        height: 85%;
    }

    #events {
        width:35%;
        float:left;
        border-right: 1px solid #dee2e6;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
        height: 85%;
    }

    #users {
        width:25%;
        float:right;
        padding-left: 20px;
        padding-bottom: 20px;
        height: 85%;
    }
</style>