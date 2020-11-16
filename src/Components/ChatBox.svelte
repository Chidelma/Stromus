<script lang="ts">
    import type { _chatbox, _msg } from '../Scripts/Interface';
    import { activeChatBox, chatboxes, server } from '../Scripts/Init';
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

    $server.on('recv-msg', async (msg:_msg) => {
        if(msg.chat_id == box.chat_id) {
            user_msg = '';
            box.messages.push(new Message(msg));
            div.scrollTo(0, div.scrollHeight);
            refresh();
        }
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

    function formatName(name:string):string {

        let names:string[] = name.split(' ');

        if(names.length > 1) {

            let first_inital:string = names[0][0].toUpperCase();
            let rem_first_name:string = names[0].substring(1, names[0].length);
            let last_initial:string = names[1][0].toUpperCase();

            return first_inital+rem_first_name + ' ' + last_initial + '.';
        } else {
            return name;
        }
    }
</script>

{#if isActive(box.value)}
    <div class="box">
        <div class="user">
            <span>
                {formatName(box.name)}
                {#if box.value > 1}
                    <i class="fa fa-close" on:click="{closeTab}"></i>
                {/if}
                <i class="fa fa-window-minimize" on:click="{makeInactive}"></i>
            </span>
        </div>
        <div id="scrollable" bind:this={div}>
            <Messages messages={box.messages} user={box.user_one} />
        </div>
        <div class="input-group msg">
            <div class="input-group-prepend">
                <button class="btn" type="file"><i class="fa fa-paperclip"></i></button>
            </div>
            <input class="msg-box" placeholder="Message {formatName(box.name)}" bind:value="{user_msg}" on:keydown="{e => e.key === 'Enter' && sendMsg()}"/>
            <div class="input-group-append">
                <button class="btn" on:click="{sendMsg}"><i class="fa fa-send"></i></button>
            </div>
        </div>
    </div>
{:else}
    <div class="minz" on:click="{makeActive}">
        <div class="user">
            <span>
                {formatName(box.name)}
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
        float: right;
        margin-left: 20px;
        margin-top:56%;
    }

    .box {
        width:300px;
        height:400px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        float: right;
        margin-left: 20px;
        outline:none;
        border:none;
        background-color: #fff;
    }

    .user {
        width: 100%;
        height:10%;
        background-color: #350d22;
        color:white;
    }

    .msg-box {
        outline: none;
        border: none;
        background-color: #350d22;
        color:white;
        width:70.4%;
    }

    .btn, .btn:hover {
        background-color: #350d22;
        color:white;
        box-shadow: unset;
        border-radius: 0px;
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
        height:79%;
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