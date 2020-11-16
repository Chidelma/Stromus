<script lang="ts">
    import type Organ from '../../Scripts/Organ';
    import type Event from '../../Scripts/Event';
    import type { _user, _role, _event, _part_sort } from '../../Scripts/Interface';
    import { eventForm, server } from '../../Scripts/Init';
    import type User from '../../Scripts/User';
    import EventCard from './EventCard.svelte';
    import Blur from '../BlurScreen.svelte';
    import Form from './EventForm.svelte';

    export let organ:Organ;
    export let user:User;

    let events:Event[] = organ.get_events();

    let can_add_event:boolean = user.get_role().can_add_event();

    $server.on('recv-event', (event:_event) => {
        if(event.organ_id == organ.get_id()) 
            events = organ.get_events();
    });

    $server.on('rm-event', (data:_part_sort) => {
        if(data.part_value == organ.get_id())
            events = organ.get_events();
    });
</script>

{#if $eventForm}
    <Blur/>
    <div id="event-form">
        <Form {organ} />
    </div>
{/if}

<table class="heading">
    <tr>
        <td>
            <h5>Upcoming Events</h5>
        </td>
        <td>
            {#if can_add_event}
                <button class="btn btn-sm btn-info" on:click="{() => (eventForm.set(true))}">Add Event</button>
            {/if}
        </td>
    </tr>
</table>

<hr/>

{#if events.length == 0}
    <p id="no-events">There are no Events for {organ.get_name()}</p>
{:else}
    <div class="event-scroll">
        {#each events as event}
            <EventCard {event} {user} />
            <hr/>
        {/each}
    </div>
{/if}


<style>
    h5 {
        color:#350d22;
    }

    #event-form {
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
        background-color: slateblue;
    }

    #no-events {
        text-align: center;
    }

    .heading {
        width:100%;
    }

    .btn-sm {
        float:right;
    }

    .event-scroll {
        width:100%;
        height:100%;
        overflow-y: auto;
        color:white;
    }
</style>