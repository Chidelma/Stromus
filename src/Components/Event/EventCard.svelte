<script lang="ts">
    import type Event from "../../Scripts/Event";
    import type User from "../../Scripts/User";
    import type { _part_sort, _rsvp } from '../../Scripts/Interface';
    import { dynamo } from '../../Scripts/Init';
    import { onMount } from 'svelte';

    export let event:Event;
    export let user:User;

    let attending:boolean = false;

    onMount(async () => {
        attending = await rsvpExist();
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

    function get_time(date_time:string):string {

        let hour:number = new Date(date_time).getHours();
        let minutes:number = new Date(date_time).getMinutes();

        let a:string = hour > 11 ? 'pm' : 'am';

        return hour + ':' + minutes + ' ' + a;
    }
</script>

<table cellpadding="5">
    <tr>
        <td>
            <span class="title">{event.get_title()}</span>
        </td>
    </tr>
    <tr>
        <td>
            <span class="date">Date: {get_date(event.get_date_time())} Time: {get_time(event.get_date_time())}</span>
        </td>
    </tr>
    <tr>
        <td>
            <span class="loc">Location: {event.get_location()}</span>
        </td>
    </tr>
    <tr>
        <td>
            <span class="desc">{event.get_desc()}</span>
        </td>
    </tr>
    <tr>
        <td>
            <button class="btn btn-light btn-sm" on:click="{RSVP}">
                RSVP
                {#if attending}
                    <i class="fa fa-check"></i>
                {/if}
            </button>
        </td>
    </tr>
</table>

<style>
    table {
        width:100%;
    }

    .title {
        float: left;
    }

    .date, .desc, .loc {
        font-size: smaller;
    }

    .btn {
        width:100%;
        box-shadow: unset;
    }
</style>