<script lang="ts">
    import type Organ from '../../Scripts/Organ';
    import type User from '../../Scripts/User';
    import type { _user, _role, _part_sort, _pending, _chatbox, _chat, _msg } from '../../Scripts/Interface';
    import { userForm, userCard, server, admin, online, dynamo, chatboxes, activeChatBox } from '../../Scripts/Init';
    import Blur from '../BlurScreen.svelte';
    import Form from './UserForm.svelte';
    import Card from './UserCard.svelte';
    import Message from '../../Scripts/Message';
    import { v5 as uuidv5 } from 'uuid';

    export let organ:Organ;
    export let user:User;

    function sort_id(curr_user:User): string {
        let joined_id:string = user.get_id() + curr_user.get_id();
        return joined_id.split('').sort().join('');
    }

    $server.emit('go-online', {
        user_id: user.get_id(),
        organ_id: organ.get_id(),
        admin_id: $admin.get_id()
    });

    let users:User[] = organ.get_users();
    let pends:_pending[] = organ.get_pends();

    let view_user:User;

    let can_add_user:boolean = user.get_role().can_add_user();
    let search_user:string = '';

    $server.on('online', (data) => {

        if(data.organ_id == organ.get_id()) {
            $online.add(data.user_id);
            online.set($online);
        }

        $server.emit('go-online', {
            user_id: user.get_id(),
            organ_id: organ.get_id(),
            admin_id: $admin.get_id()
        });
    });

    $server.on('offline', (data) => {

        if(data.organ_id == organ.get_id()) {
            $online.delete(data.user_id);
            online.set($online);
        }

        $server.emit('go-online', {
            user_id: user.get_id(),
            organ_id: organ.get_id(),
            admin_id: $admin.get_id()
        });
    });

    $server.on('recv-invite', (pend:_pending) => {
        if(pend.organ_id == organ.get_id())
            pends = organ.get_pends();
    });

    $server.on('rm-user', (data:_part_sort) => {
        if(data.part_value == organ.get_id()) {
            if($online.has(data.sort_value)) {
                $online.delete(data.sort_value);
                online.set($online);
            }
            users = organ.get_users();
        }
    });

    function find_user(): void {
        if(search_user.length > 0)
            users = users.filter(user => user.get_first_name().includes(search_user) || user.get_last_name().includes(search_user));
        else    
            users = organ.get_users();
    }

    function viewUser(user:User) {
        view_user = user;
        view_user.set_posts(organ.get_posts().filter(post => post.get_user_id() == user.get_id()));
        userCard.set(true);
    }

    function resizeChats() {

        let chatBoxSize:number = 320;
        let totalSize:number = chatBoxSize * $chatboxes.length;

        if((totalSize + chatBoxSize) >= window.innerWidth) {

            let deleted_chat:_chatbox[] = [];

            chatboxes.update(arr => {
                deleted_chat = arr.splice(1, 1);
                return arr;
            });

            activeChatBox.update(arr => {
                arr.splice(arr.indexOf(deleted_chat[1].value), 1);
                return arr;
            });
        }
    }

    function chatBoxExist(curr_user:User):boolean {

        let found:boolean = false;

        if($chatboxes.length > 1) {

            let box:_chatbox = $chatboxes.find(box => box.user_two.get_id() == curr_user.get_id());

            if(box != undefined) {

                activeChatBox.update(arr => {
                    arr.push(box.value);
                    return arr;
                });

                found = true;
            }
        }

        return found;
    }

    async function viewChat(curr_user:User) {

        let chat_id:string = uuidv5(sort_id(curr_user), organ.get_id());

        if(!chatBoxExist(curr_user)) {

            let messages:Message[] = [];

            let chat:_chat = organ.find_chat(chat_id);

            if(chat == undefined) {

                chat = {
                    organ_id: organ.get_id(),
                    chat_id: chat_id
                }

                let added:boolean = await $dynamo.putItem("CHATS", chat);

                if(added)
                    organ.setup_chats();

            } else {

                let key_value:_part_sort = {
                    part_key: 'chat_id',
                    part_value: chat.chat_id
                }

                let msgs:_msg[] = await $dynamo.queryItem('MESSAGES', key_value);

                msgs = msgs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                for(let i = 0; i < msgs.length; i++)
                    messages.push(new Message(msgs[i]));
            }

            resizeChats();

            activeChatBox.update(arr => {
                arr.push($chatboxes.length + 1);
                return arr;
            });

            chatboxes.update(chats => {

                let new_chat:_chatbox = {
                    name: curr_user.get_first_name().toLowerCase() + ' ' + curr_user.get_last_name().toLowerCase(),
                    messages: messages,
                    value: chats.length + 1,
                    chat_id: chat.chat_id,
                    user_one: user,
                    user_two: curr_user
                }

                chats.push(new_chat);
                return chats;
            });
        }
    }

    function formatName(user:User):string {

        let first_inital:string = user.get_first_name()[0];
        let rem_first_name:string = user.get_first_name().substring(1, user.get_first_name().length).toLowerCase();
        let last_initial:string = user.get_last_name()[0];

        return first_inital+rem_first_name + ' ' + last_initial + '.';
    }
</script>

{#if $userForm}
    <Blur/>
    <div id="user-form">
        <Form {organ} />
    </div>
{/if}

{#if $userCard}
    <Blur/>
    <div id="user-card">
        <Card {view_user} {user} {organ} />
    </div>
{/if}

<table class="heading">
    <tr>
        <td>
            <h5>Users</h5>
        </td>
        <td>
            {#if can_add_user}
                <button class="btn btn-info btn-sm" on:click="{() => (userForm.set(true))}">Add User</button>
            {/if}
        </td>
    </tr>
</table>

<hr/>
<input class="user-search" placeholder="Search User" bind:value="{search_user}" on:keyup="{find_user}"/>
<hr/>

<div class="user-scroll">
    {#each users as user}
        <button class="btn user btn-sm" on:click="{() => viewUser(user)}">
            {formatName(user)}
        </button>

        <button class="btn chat btn-sm" on:click="{() => viewChat(user)}">
            {#if $online.has(user.get_id())}
                <i class="fa fa-circle"></i>
            {/if}
             <i class="fa fa-comments-o"></i>
        </button>
    {/each}
    
    {#if pends.length > 0}
        <h5>Pending</h5>
        <hr/>
        {#each pends as pend}
            <button class="btn user btn-sm">
                {pend.email}
            </button>
            <hr/>
        {/each}
    {/if}
</div>


<style>
    #user-form, #user-card {
        padding:20px;
        position:fixed;
        z-index: 75;
        left:50%;
        top:5%;
        width:500px;
        background-color: white;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius: 0.4rem;
        transform: translate(-50%, 0);
        background-color: slateblue;
        color:#350d22;
    }

    h5 {
        color:#350d22;
    }

    .fa-circle {
        font-size: smaller;
        color:green;
    }

    .user-search {
        width: 100%;
        background-color: #350d22;
        outline: none;
        border: none;
        border-radius:0.2rem;
        color:white;
    }

    .heading {
        width:100%;
    }

    .btn-info {
        float:right;
    }

    .user {
        box-shadow: unset;
        width:60%;
        float:left;
    }

    .user, .chat {
        margin-bottom: 10px;
        background-color: transparent;
        border-color: #350d22;
    }

    .user:hover, .chat:hover {
        background-color: #350d22;
        color:white;
    }

    .chat {
        box-shadow: unset;
        width:30%;
        float: right;
    }

    .user-scroll {
        width:100%;
        height:100%;
        overflow-y: auto;
        color:white;
    }
</style>