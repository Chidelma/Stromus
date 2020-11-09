<script lang="ts">
    import type Message from '../Scripts/Message';
    import { user } from '../Scripts/Init';
    import moment from 'moment';

    export let messages:Message[] = [];

    function get_time_span(date:string): string {
        return moment(date, 'YYYY-MM-DD[T]HH:mm:ss').fromNow();
    }
</script>

{#each messages as message, i}
    {#if i > 0 && message.get_user_id() == messages[i - 1].get_user_id()}
        <article>   
            <div class="blank-img"></div>
            {#if message.get_user_id() == $user.get_id()}
                <span class="my-msg">{message.get_msg()}</span>
            {:else}
                <span class="oda-msg">{message.get_msg()}</span>
            {/if}
        </article>
    {:else}
        <article>   
            <span class="name">{message.get_name().toLowerCase()}</span>
            <span class="date">{get_time_span(message.get_date())}</span>
            <img src="{message.get_photo()}" alt="profile"/>
            {#if message.get_user_id() == $user.get_id()}
                <span class="my-msg">{message.get_msg()}</span>
            {:else}
                <span class="oda-msg">{message.get_msg()}</span>
            {/if}
        </article>
    {/if}
{/each}

<style>
    .name, .date {
        width:50%;
        font-size: x-small;
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

    .blank-img {
        width:40px;
        height:40px;
        float: left;
        margin-right:5px;
    }

    img {
        width:40px;
        height:40px;
        border-radius:0.4rem;
    }

    article {
		margin: 0.5em 0;
        padding:5px;
	}

	.my-msg, .oda-msg {
		padding: 0.5em 1em;
		display: inline-block;
		border-radius: 0.4em;
	}

    .my-msg {
        background-color: #eee;
    }

    .oda-msg {
        background-color: slateblue;
    }
</style>