<script lang="ts">
    import { admin, organForm, tabs, activeTabValue } from '../Scripts/Init';
    import type { _user, _tab } from '../Scripts/Interface';
    import type Organ from '../Scripts/Organ';
    import Form from './Organ/OrganForm.svelte';
    import Blur from './BlurScreen.svelte';
    import OrganTemp from './Organ/OrganTemp.svelte';

    let organs:Organ[] = $admin.get_organs();

    function viewOrgan(organ:Organ) {

        let opened:boolean = false;

        for(let i = 0; i < $tabs.length; i++) {
            if($tabs[i].organ != undefined && $tabs[i].organ.get_id() == organ.get_id()) {
                activeTabValue.set($tabs[i].value);
                opened = true;
                break;
            }
        }

        if(!opened) {
            let organ_tab:_tab = {
                label:organ.get_name(),
                value:$tabs.length + 1,
                component: OrganTemp,
                organ: organ
            }

            tabs.update(tabs => {
                tabs.push(organ_tab);
                return tabs;
            });

            activeTabValue.set(organ_tab.value);
        }
    }
</script>

{#if $organForm}
    <Blur/>
    <div id="organ-form">
        <Form/>
    </div>
{/if}

<table id="heading">
    <tr>
        <td id="title">
            <h5>My Organisations</h5>
        </td>
        <td id="add-organ">
            <button class="btn btn-sm btn-primary" on:click="{() => (organForm.set(true))}">Add Organization</button>
        </td>
    </tr>
</table>

<hr/>

<input class="search-bar" placeholder="Search Organization" />

{#if organs.length == 0}
    <p id="msg">You Don't Have Any Organisations</p>
{:else}
    {#each organs as organ}
        <button class="btn btn-light" on:click="{() => viewOrgan(organ)}">
            {organ.get_name()}
        </button>
    {/each}
{/if}

<style>
    #organ-form {
        padding:20px;
        position:fixed;
        z-index: 75;
        left:50%;
        top:15%;
        width:500px;
        background-color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius: 0.4rem;
        transform: translate(-50%, 0);
    }

    .search-bar {
        margin-bottom: 20px;
        width:100%;
        background-color: #eee;
        border-radius: 0.2rem;
        outline: none;
        border: none;
    }

    #heading {
        width: 100%;
    }

    .btn-light {
        width:200px;
        height:200px;
        float:left;
        margin-right:50px;
        font-size: x-large;
    }

    .btn-sm {
        float:right;
    }

    #msg {
        text-align: center;
    }
</style>