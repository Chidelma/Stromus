<script lang="ts">
    import type Event from "../../Scripts/Event";
    import type User from "../../Scripts/User";
    import type { _part_sort, _rsvp, _event } from '../../Scripts/Interface';
    import { dynamo, server } from '../../Scripts/Init';
    import { onMount } from 'svelte';

    export let event:Event;
    export let user:User;

    let attending:boolean = false;
    let editing:boolean = false;

    let live_edit:_event = {
        id: event.get_id(),
        organ_id: event.get_organ_id(),
        title: event.get_title(),
        desc: event.get_desc(),
        location: event.get_location(),
        date_time: event.get_date_time(),
    }

    let time:string = get_time(live_edit.date_time);
    let date:string = get_date(live_edit.date_time);

    onMount(async () => {
        attending = await rsvpExist();
    });

    $server.on('new-event', (new_event:_event) => {
        if(new_event.id == event.get_id())
            event.set_event(new_event);
    });

    async function rsvpExist(): Promise<boolean> {

        let attending:boolean = false;

        let key_value:_part_sort = {
            part_key: 'event_id',
            part_value: event.get_id(),
            sort_key: 'user_id',
            sort_value: user.get_id()
        }

        let result:any = await $dynamo.getItem('RSVP', key_value);

        if(result != undefined)
            attending = true;

        return attending;
    }

    async function RSVP(): Promise<void> {

        if(!attending) {

            let key_value:_rsvp = {
                event_id: event.get_id(),
                user_id: user.get_id()
            }

            let added:boolean = await $dynamo.putItem('RSVP', key_value);

            if(added)
                attending = true

        } else {

            let key_value:_part_sort = {
                part_key: 'event_id',
                part_value: event.get_id(),
                sort_key: 'user_id',
                sort_value: user.get_id()
            }

            let removed:boolean = await $dynamo.removeItem('RSVP', key_value);

            if(removed)
                attending = false;
        }
    }

    function get_date(date_time:string):string {

        let year:number = new Date(date_time).getFullYear();
        let month:number = new Date(date_time).getMonth() + 1;
        let day:number = new Date(date_time).getDate();

        return year + '-' + month + '-' + day;
    }

    function get_ampm(date_time:string):string {

        let hour:number = new Date(date_time).getHours();

        return hour > 11 ? 'pm' : 'am';
    }

    function get_time(date_time:string):string {

        let hour:number = new Date(date_time).getHours();
        let minutes:number = new Date(date_time).getMinutes();

        if(hour > 9)
            return hour + ':' + minutes;
        else
            return '0' + hour + ':' + minutes;
    }

    function deleteEvent() {

        let sure:boolean = confirm('Are you sure you want to delete this event');

        if(sure) {

            let key_value:_part_sort = {
                part_key: 'organ_id',
                part_value: event.get_organ_id(),
                sort_key: 'id',
                sort_value: event.get_id()
            }

            $server.emit('delete-event', key_value);
        }
    }

    function editEvent() {
        live_edit.date_time = date + 'T' + time + ':00';
        $server.emit('edit-event', live_edit);
    }
</script>

<table cellpadding="5">
    <tr>
        <td>
            {#if !editing}
                <span class="title">{event.get_title()}</span>
            {:else}
                <input class="form-control" bind:value="{live_edit.title}" />
            {/if}
        </td>
    </tr>
    <tr>
        <td>
            {#if !editing}
                <span class="date">Date: {get_date(event.get_date_time())}</span>
            {:else}
                <input class="form-control" type="date" bind:value="{date}" />
            {/if}
        </td>
    </tr>
    <tr>
        <td>
            {#if !editing}
                <span class="date">Time: {get_time(event.get_date_time())} {get_ampm(event.get_date_time())}</span>
            {:else}
                <input class="form-control" type="time" bind:value="{time}"/>
            {/if}
        </td>
    </tr>
    <tr>
        <td>
            {#if !editing}
                <span class="loc">Location: {event.get_location()}</span>
            {:else}
                <input class="form-control" bind:value="{live_edit.location}"/>
            {/if}
        </td>
    </tr>
    <tr>
        <td>
            {#if !editing}
                <span class="desc">{event.get_desc()}</span>
            {:else}
                <textarea class="form-control" bind:value="{live_edit.desc}"></textarea>
            {/if}
        </td>
    </tr>
    <tr>
        <td>
            {#if !editing}
                {#if user.get_role().can_delete_event()}
                    <button class="btn btn-sm" on:click="{deleteEvent}">Delete</button>
                {/if}
                
                {#if user.get_role().can_edit_event()}
                    <button class="btn btn-sm" on:click="{() => (editing = true)}">Edit</button>
                {/if}

                <button class="btn btn-sm" on:click="{RSVP}">
                    RSVP
                    {#if attending}
                        <i class="fa fa-check"></i>
                    {/if}
                </button>
                <button class="btn btn-sm"><i class="fa fa-share-alt"></i></button>
            {:else}
                <button class="btn btn-sm" on:click="{editEvent}">Change</button>
                <button class="btn btn-sm" on:click="{() => (editing = false)}">Cancel</button>
            {/if}
        </td>
    </tr>
</table>

<style>
    table {
        width:100%;
        color:#eee;
        background-color: #350d22;
        border-radius: 0.4rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    textarea {
        width:100%;
    }

    input {
        width:100%;
    }

    .title {
        float: left;
    }

    .date, .desc, .loc {
        font-size: smaller;
    }

    .btn {
        box-shadow: unset;
        float:right;
        background-color: transparent;
        color:#eee;
    }

    .btn:hover {
        color:white;
        background-color: transparent;
    }
</style>