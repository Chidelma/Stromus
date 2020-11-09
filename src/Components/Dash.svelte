<script lang="ts">
    import { tabs, chatboxes } from '../Scripts/Init';
    import type { _user, _tab, _chatbox } from '../Scripts/Interface';
    import Profile from './Profile.svelte';
    import Home from './Home.svelte';
    import Tabs from './Tabs.svelte';
    import Chats from './Chats.svelte';

    let home_tab:_tab = {
        label: 'Home',
        value: 1,
        component: Home
    }

    let support_tab:_chatbox = {
        name: 'Support',
        value: 1,
        messages: []
    }

    $tabs.push(home_tab);
    $chatboxes.push(support_tab);
</script>

<Profile/>

<div id="tabs">
    <Tabs tabs={$tabs}/>
</div>

<div id="chats">
    <Chats tabs={$chatboxes}/>
</div>

<style>
    #tabs {
        margin-top:50px;
        height:100%;
    }

    #chats {
        position: fixed;
        right: 0;
        bottom:0;
        z-index: 100;
        padding-right:10px;
        padding-left:10px;
        max-height: 400px;
    }
</style>