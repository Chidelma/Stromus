<script lang="ts">
    import { activeTabValue, server, postForm, eventForm, userCard } from '../Scripts/Init';
    import type { _tab, _post, _event, _pending, _part_sort, _role } from '../Scripts/Interface';
    import Post from '../Scripts/Post';
    import Event from '../Scripts/Event';
    import Role from '../Scripts/Role';

    export let tabs:_tab[] = [];

    let lastTabValue:number = 1;

    $server.on('recv-post', (post:_post) => {

        let idx:number = tabs.findIndex(tab => tab.organ != undefined && tab.organ.get_id() == post.organ_id);

        if(idx > 0) {
            let new_post:Post = new Post(post);
            new_post.setup_comments();
            tabs[idx].organ.add_post(new_post);
            postForm.set(false);
        }
    });

    $server.on('recv-event', (event:_event) => {

        let idx:number = tabs.findIndex(tab => tab.organ != undefined && tab.organ.get_id() == event.organ_id);

        if(idx > 0) {
            tabs[idx].organ.add_event(new Event(event));
            eventForm.set(false);
        }
    });

    $server.on('recv-invite', (pend:_pending) => {

        let idx:number = tabs.findIndex(tab => tab.organ != undefined && tab.organ.get_id() == pend.organ_id);

        if(idx > 0)
            tabs[idx].organ.add_pend(pend);
    });

    $server.on('rm-post', (data:_part_sort) => {

        let idx:number = tabs.findIndex(tab => tab.organ != undefined && tab.organ.get_id() == data.part_value);

        if(idx > 0)
            tabs[idx].organ.remove_post(data.sort_value);
    });

    $server.on('rm-event', (data:_part_sort) => {

        let idx:number = tabs.findIndex(tab => tab.organ != undefined && tab.organ.get_id() == data.part_value);

        if(idx > 0)
            tabs[idx].organ.remove_event(data.sort_value);
    });

    $server.on('rm-user', (data:_part_sort) => {

        let idx:number = tabs.findIndex(tab => tab.organ != undefined && tab.organ.get_id() == data.part_value);

        if(idx > 0)
            tabs[idx].organ.remove_user(data.sort_value);
    });

    $server.on('new-post', (new_post:_post) => {

        let idx:number = tabs.findIndex(tab => tab.organ != undefined && tab.organ.get_id() == new_post.organ_id);
        
        if(idx > 0) {
            let post_idx:number = tabs[idx].organ.get_posts().findIndex(post => post.get_id() == new_post.id);

            if(post_idx > -1)
                tabs[idx].organ.get_posts()[post_idx].set_msg(new_post.msg);
        }
    });

    $server.on('new-event', (new_event:_event) => {

        let idx:number = tabs.findIndex(tab => tab.organ != undefined && tab.organ.get_id() == new_event.organ_id);

        if(idx > 0) {
            let evt_idx:number = tabs[idx].organ.get_events().findIndex(event => event.get_id() == new_event.id);

            if(evt_idx > -1)
                tabs[idx].organ.get_events()[evt_idx].set_event(new_event);
        }
    });

    $server.emit('new-role', (new_role:_role) => {
        
        let idx:number = tabs.findIndex(tab => tab.organ != undefined && tab.organ.get_id() == new_role.organ_id);

        if(idx > 0) {
            let usr_idx:number = tabs[idx].organ.get_users().findIndex(user => user.get_id() == new_role.user_id);

            if(usr_idx > -1)
                tabs[idx].organ.get_users()[usr_idx].set_role(new Role(new_role));
        }
    });

    function handleClick(tabValue:number) {
        lastTabValue = $activeTabValue;
        activeTabValue.set(tabValue)
    }

    function closeTab(tab:_tab) {

        if($activeTabValue == tab.value) {

            for(let i = 0; i < tabs.length; i++) {
                if(tabs[i].value == tab.value) {
                    handleClick(tab.value - 1);
                    tabs.splice(i, 1);
                    break;
                }
            }
        } else {

            for(let i = 0; i < tabs.length; i++) {
                if(tabs[i].value == tab.value) {
                    handleClick(lastTabValue);
                    tabs.splice(i, 1);
                    break;
                }
            }
        }
    }
</script>
  
<ul>
    {#each tabs as tab}
        <li class={$activeTabValue === tab.value ? 'active' : ''}>
            <span on:click={() => handleClick(tab.value)}>{tab.label} 
                {#if tab.value > 1}
                    <i class="fa fa-close" on:click="{(() => (closeTab(tab)))}"></i>
                {/if}
            </span>
        </li>
    {/each}
</ul>

{#each tabs as tab}
    {#if $activeTabValue == tab.value}
        <div class="box">
            <svelte:component this={tab.component} organ={tab.organ}/>
        </div>
    {/if}
{/each}

<style>
    .box {
        margin-bottom: 10px;
        padding: 20px;
        border-radius: 0 0 .5rem .5rem;
        border-top: 0;
        height:100%;
    }

    ul {
        display: flex;
        flex-wrap: wrap;
        padding-left: 0;
        margin-bottom: 0;
        list-style: none;
        border-bottom: 1px solid #350d22;
    }

    li {
        margin-bottom: -1px;
    }
  
    span {
        border: 1px solid transparent;
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
        display: block;
        padding: 0.5rem 1rem;
        cursor: pointer;
        color:#350d22;
    }
  
    span:hover {
        border-color: #350d22;
    }
  
    li.active > span {
        color: #fff;
        background-color: #350d22;
    }
</style>