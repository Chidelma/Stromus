<script lang="ts">
    import type { _chatbox, _msg } from '../Scripts/Interface';
    import { activeChatBox, user, dynamo } from '../Scripts/Init';
    import Message from '../Scripts/Message';
    import Messages from './Message.svelte';
    import { createEventDispatcher } from 'svelte';
    import { v5 as uuidv5 } from 'uuid';
    import moment from 'moment';

    export let box:_chatbox;

    let user_msg:string = '';

    const dispatch = createEventDispatcher();

    function refresh() {
        dispatch('message', {
            text: 'refresh'
        });
    }

    function isActive(value:number):boolean {

        let active:boolean = false;

        let num:number = $activeChatBox.find(num => num == value);

        if(num != undefined)
            active = true

        return active;
    }

    function makeActive(value:number) {

        activeChatBox.update(arr => {
            arr.push(value);
            return arr;
        });

        refresh();
    }

    function makeInactive(value:number) {
        activeChatBox.update(arr => {
            arr.splice(arr.indexOf(value), 1);
            return arr;
        });

        refresh();
    }

    function closeTab(value:number) {

        activeChatBox.update(arr => {
            arr.splice(arr.indexOf(value), 1);
            return arr;
        });

        refresh();
    }

    async function sendMsg():Promise<void> {

        if(user_msg.length > 0) {

            let new_message:_msg = {
                id: uuidv5(moment().format(), box.chat_id),
                name: $user.get_first_name() + ' ' + $user.get_last_name(),
                user_id: $user.get_id(),
                message: user_msg,
                chat_id: box.chat_id,
                photo: $user.get_photo(),
                date: moment().format('YYYY-MM-DD[T]HH:mm:ss')
            }

            let added:boolean = await $dynamo.putItem('MESSAGES', new_message);

            if(added) {
                box.messages.push(new Message(new_message));
                user_msg = '';
                refresh();
            }
        }
    }
</script>

{#if isActive(box.value)}
    <div class="box">
        <div class="user">
            <span>
                {box.name}
                {#if box.value > 1}
                    <i class="fa fa-close" on:click="{() => closeTab(box.value)}"></i>
                {/if}
                <i class="fa fa-window-minimize" on:click="{() => makeInactive(box.value)}"></i>
            </span>
        </div>
        <div class="scrollable">
            <Messages messages={box.messages} />
        </div>
        <div class="msg">
            <input class="form-control" placeholder="Message {box.name}" bind:value="{user_msg}" on:keydown="{e => e.keyCode === 13 && sendMsg()}"/>
        </div>
    </div>
{:else}
    <div class="minz" on:click="{() => makeActive(box.value)}">
        <div class="user">
            <span>
                {box.name}
                {#if box.value > 1}
                    <i class="fa fa-close"></i>
                {/if}
            </span>
        </div>
    </div>
{/if}

<style>
    .minz {
        width:300px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        background-color: #fff;
        float: right;
        margin-left: 20px;
        margin-top:56%;
    }

    .box {
        width:300px;
        height:400px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        background-color: #fff;
        float: right;
        margin-left: 20px;
    }

    .user {
        width: 100%;
        background-color: #303030;
        color: #fff;
        height:10%;
    }

    .form-control {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    i {
        float:right;
        margin-left:5px;
    }

    .msg {
        width:100%;
    }

    .scrollable {
		flex: 1 1 auto;
		border-top: 1px solid #eee;
		margin: 0 0 0.5em 0;
		overflow-y: auto;
        width:100%;
        height:78%;
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
</style>