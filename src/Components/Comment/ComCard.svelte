<script lang="ts">
    import type Comment from '../../Scripts/Comment';
    import moment from 'moment';

    export let comment:Comment;

    function get_time_span(date:string): string {
        return moment(date, "MMMM Do YYYY, h:mm:ss a").fromNow();
    }
</script>

<table cellpadding="5">
    <tr>
        <td class="pic-row" colspan="2">
            <img class="pic" src="{comment.get_photo()}" alt="pic" />
            <span class="name">{comment.get_name().toLowerCase()}</span>
            <span class="date">{get_time_span(comment.get_date())}</span>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <p>{comment.get_msg()}</p>
        </td>
    </tr>
</table>

<style>
    table {
        width:100%;
    }

    .pic {
        border-radius: 50%;
        width: 30px;
        height: 30px;
        float:left
    }

    .name, .date {
        font-size: smaller;
    }

    .name {
        margin-left: 10px;
    }

    .date {
        float:right;
    }
</style>