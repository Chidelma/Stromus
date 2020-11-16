<script lang="ts">
    import { eventForm, server } from '../../Scripts/Init';
    import type { _event } from '../../Scripts/Interface';
    import type Organ from '../../Scripts/Organ';
    import { v5 as uuidv5 } from 'uuid';
    import moment from 'moment';

    export let organ:Organ;

    let loading:boolean = false;

    let date:string = '';
    let time:string = '';

    let new_event:_event = {

        id: '',
        organ_id: organ.get_id(),

        date_time: '',
        title: '',
        desc: '',
        location: ''
    }

    function addEvent() {

        loading = true;

        new_event.id = uuidv5(moment().format(), organ.get_id());

        new_event.date_time = date + 'T' + time + ':00';

        $server.emit('add-event', new_event);

        loading = false;
    }

    function getTodayDate():string {

        return moment().format('YYYY-MM-DD');
    }
</script>

<h3>New Event</h3>

<button class="btn btn-danger btn-sm" on:click="{() => (eventForm.set(false))}"><i class="fa fa-close"></i></button>

<input class="event-form event-title" placeholder="Event Title" bind:value="{new_event.title}" required/>

<input type="date" class="event-form event-date" bind:value="{date}" min={getTodayDate()} required/>

<input type="time" class="event-form event-time" bind:value="{time}" required/>

<input class="event-form event-loc" bind:value="{new_event.location}" placeholder="Location" required/>

<textarea class="event-form event-desc" bind:value="{new_event.desc}" rows="4" placeholder="Description" required></textarea>

<button class="btn btn-event" on:click="{addEvent}" disabled="{new_event.title.length == 0}">
    {#if !loading}
        Add Event
    {:else}
        <i class="fa fa-spinner fa-spin"></i>
    {/if}
</button>

<style>
    h3 {
        float:left;
    }

    .event-title {
        width:100%;
        margin-top:20px;
        margin-bottom: 20px;
    }

    .event-date {
        float:left;
        width:48%;
    }

    .event-time {
        float:right;
        width:48%
    }

    .event-form {
        margin-bottom: 20px;
        width:100%;
        background-color: #eee;
        outline: none;
        border: none;
        border-radius: 0.2rem;
        background-color: #350d22;
        color:white;
    }

    .btn-danger {
        float:right;
        border-radius: 50%;
    }

    .btn-event {
        float:right;
        background-color: transparent;
        border-color: #350d22;
        color:#350d22;
        box-shadow: unset;
    }

    .btn-event:hover {
        color:white;
        background-color: #350d22;
    }
</style>