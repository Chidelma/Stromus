<script lang="ts">
    import { activeTabValue, server, postForm, eventForm } from '../Scripts/Init';
    import type { _tab } from '../Scripts/Interface';
    import Post from '../Scripts/Post';
    import Event from '../Scripts/Event';

    export let tabs:_tab[] = [];

    let lastTabValue:number = 1;

    $server.on('recv-post', _post => {
        for(let i = 1; i < tabs.length; i++) {
            if(tabs[i].organ.get_id() == _post.organ_id) {
                let new_post:Post = new Post(_post);
                new_post.setup_comments();
                tabs[i].organ.add_post(new_post);
                postForm.set(false);
                break;
            }
        }
    });

    $server.on('recv-event', _event => {
        for(let i = 1; i < tabs.length; i++) {
            if(tabs[i].organ.get_id() == _event.organ_id) {
                tabs[i].organ.add_event(new Event(_event));
                eventForm.set(false);
                break;
            }
        }
    });

    $server.on('recv-invite', _pend => {
        for(let i = 1; i < tabs.length; i++) {
            if(tabs[i].organ.get_id() == _pend.organ_id) {
                tabs[i].organ.add_pend(_pend);
                break;
            }
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
        border-top-color:#dee2e6;
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
        border-bottom: 1px solid #dee2e6;
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
    }
  
    span:hover {
        border-color: #e9ecef #e9ecef #dee2e6;
    }
  
    li.active > span {
        color: #495057;
        background-color: #fff;
        border-color: #dee2e6 #dee2e6 #fff;
    }
</style>