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

<hr/>

<input class="form-control event-title" placeholder="Event Title" bind:value="{new_event.title}" required/>

<input type="date" class="form-control event-date" bind:value="{date}" min={getTodayDate()} required/>

<input type="time" class="form-control event-time" bind:value="{time}" required/>

<input class="form-control event-loc" bind:value="{new_event.location}" placeholder="Location" required/>

<textarea class="form-control event-desc" bind:value="{new_event.desc}" rows="4" placeholder="Description" required></textarea>

<button class="btn btn-danger" on:click="{() => (eventForm.set(false))}">Cancel</button>
<button class="btn btn-primary" on:click="{addEvent}" disabled="{new_event.title.length == 0}">
    {#if !loading}
        Add Event
    {:else}
        <i class="fa fa-spinner fa-spin"></i>
    {/if}
</button>

<style>
    .event-title {
        width:100%;
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

    .form-control {
        margin-bottom: 20px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .btn-danger {
        float:left;
    }

    .btn-primary {
        float:right;
    }
</style>