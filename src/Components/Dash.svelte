<script lang="ts">
    import { tabs } from '../Scripts/Init';
    import type { _user, _tab } from '../Scripts/Interface';
    import Profile from './Profile.svelte';
    import Home from './Home.svelte';
    import Tabs from './Tabs.svelte';

    let home_tab:_tab = {
        label: 'Home',
        value: 1,
        component: Home
    }

    $tabs.push(home_tab);
</script>

<Profile/>

<div id="tabs">
    <Tabs tabs={$tabs}/>
</div>

<style>
    #tabs {
        margin-top:50px;
        height:100%;
    }
</style>