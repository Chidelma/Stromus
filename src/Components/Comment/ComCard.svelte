<script lang="ts">
    import type Comment from '../../Scripts/Comment';
    import moment from 'moment';

    export let comment:Comment;

    function get_time_span(date:string): string {
        return moment(date, 'YYYY-MM-DD[T]HH:mm:ss').fromNow();
    }

    function formatName(name:string):string {

        let names:string[] = name.split(' ');

        if(names.length > 1) {

            let first_inital:string = names[0][0];
            let rem_first_name:string = names[0].substring(1, names[0].length);
            let last_initial:string = names[1][0];

            return first_inital+rem_first_name.toLowerCase() + ' ' + last_initial + '.';
        } else {
            return name;
        }
    }
</script>

<article>
    <span class="name">{formatName(comment.get_name())}</span>
    <span class="date">{get_time_span(comment.get_date())}</span>
    <img src="{comment.get_photo()}" alt="profile"/>
    <span class="my-msg">{comment.get_msg()}</span>
</article>

<style>
    .name, .date {
        width:50%;
        font-size: small;
		display: inline-block;
        background-color: transparent;
    }

    .name {
        float: left;
    }

    .date {
        float: right;
        text-align: right;
    }

    img {
        width:40px;
        height:40px;
        border-radius:0.4rem;
    }

    .my-msg {
		padding: 0.5em 1em;
		display: inline-block;
		border-radius: 0.4em;
        background-color: #eee;
        color:black;
	}

    article {
		margin: 0.5em 0;
        padding:5px;
	}
</style>