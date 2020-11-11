<script lang="ts">
    import type { _chatbox, _msg } from '../Scripts/Interface';
    import { activeChatBox, dynamo, chatboxes, server } from '../Scripts/Init';
    import Message from '../Scripts/Message';
    import Messages from './Message.svelte';
    import { createEventDispatcher } from 'svelte';
    import { v5 as uuidv5 } from 'uuid';
    import moment from 'moment';
    import { afterUpdate } from 'svelte';

    export let box:_chatbox;

    let user_msg:string = '';
    let div:HTMLElement;

    const dispatch = createEventDispatcher();

    $server.emit('join-chat', box.chat_id);

    $server.on('recv-msg', async (msg) => {

        user_msg = '';

        let new_message:_msg = {
            id: uuidv5(moment().format(), box.chat_id),
            name: box.user_one.get_first_name() + ' ' + box.user_one.get_last_name(),
            user_id: box.user_one.get_id(),
            message: msg,
            chat_id: box.chat_id,
            photo: box.user_one.get_photo(),
            date: moment().format('YYYY-MM-DD[T]HH:mm:ss')
        }

        box.messages.push(new Message(new_message));
        div.scrollTo(0, div.scrollHeight);
        refresh();
    });

    afterUpdate(() => {
        if(isActive(box.value) && div != undefined)
            div.scrollTo(0, div.scrollHeight);
    });

    function refresh() {
        dispatch('message', {
            text: 'refresh'
        });
    }

    function isActive(value:number):boolean {

        let active:boolean = false;

        let val:number = $activeChatBox.find(num => num == value);

        if(val != undefined)
            active = true

        return active;
    }

    function makeActive() {

        if(!isActive(box.value)) {

            activeChatBox.update(arr => {
                arr.push(box.value);
                return arr;
            });

            refresh();

            div.scrollTo(0, div.scrollHeight);
        }
    }

    function makeInactive() {

        if(isActive(box.value)) {

            activeChatBox.update(arr => {
                arr.splice(arr.indexOf(box.value), 1);
                return arr;
            });

            refresh();
        }
    }

    function closeTab() {

        activeChatBox.update(arr => {
            arr.splice(arr.indexOf(box.value), 1);
            return arr;
        });

        chatboxes.update(arr => {

            let i:number;

            for(i = 0; i < arr.length; i++) {
                if(arr[i].value == box.value) {
                    break;
                }
            }

            arr.splice(i, 1);

            return arr;
        });

        $server.emit('leave-chat', box.chat_id);

        refresh();
    }

    function sendMsg() {

        if(user_msg.length > 0) {

            let new_message:_msg = {
                id: uuidv5(moment().format(), box.chat_id),
                name: box.user_one.get_first_name() + ' ' + box.user_one.get_last_name(),
                user_id: box.user_one.get_id(),
                message: user_msg,
                chat_id: box.chat_id,
                photo: box.user_one.get_photo(),
                date: moment().format('YYYY-MM-DD[T]HH:mm:ss')
            }

            $server.emit('send-msg', new_message);
        }
    }
</script>

{#if isActive(box.value)}
    <div class="box">
        <div class="user">
            <span>
                {box.name}
                {#if box.value > 1}
                    <i class="fa fa-close" on:click="{closeTab}"></i>
                {/if}
                <i class="fa fa-window-minimize" on:click="{makeInactive}"></i>
            </span>
        </div>
        <div id="scrollable" bind:this={div}>
            <Messages messages={box.messages} user={box.user_one} />
        </div>
        <div class="msg">
            <input class="form-control" placeholder="Message {box.name}" bind:value="{user_msg}" on:keydown="{e => e.key === 'Enter' && sendMsg()}"/>
        </div>
    </div>
{:else}
    <div class="minz" on:click="{makeActive}">
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

    #scrollable {
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