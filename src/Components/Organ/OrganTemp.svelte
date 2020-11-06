<script lang="ts">
    import type Organ from '../../Scripts/Organ';
    import USERS from '../User/UserTemp.svelte';
    import POSTS from '../Post//PostTemp.svelte';
    import EVENTS from '../Event/EventTemp.svelte';

    export let organ:Organ;
</script>

<div id="posts">
    <POSTS {organ} />
</div>

<div id="events">
    <EVENTS {organ} />
</div>

<div id="users">
    <USERS {organ} />
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