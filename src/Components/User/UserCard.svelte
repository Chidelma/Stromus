<script lang="ts">
    import type User from '../../Scripts/User';
    import type Organ from '../../Scripts/Organ';
    import Message from '../../Scripts/Message';
    import PostCard from '../Post/PostCard.svelte';
    import { user, userCard, dynamo, chatboxes, activeChatBox } from '../../Scripts/Init';
    import type Post from '../../Scripts/Post';
    import { v5 as uuidv5 } from 'uuid';
    import type { _chat, _msg, _part_sort, _chatbox } from '../../Scripts/Interface';

    export let curr_user:User;
    export let organ:Organ;

    let posts:Post[] = curr_user.get_posts();
    let chat_id:string = uuidv5(sort_id(), organ.get_id());
    let messages:Message[] = [];

    function sort_id(): string {
        let joined_id:string = curr_user.get_id() + $user.get_id();
        return joined_id.split('').sort().join('');
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

    function chatBoxExist():boolean {

        let found:boolean = false;

        let box:_chatbox = $chatboxes.find(box => box.user_id == curr_user.get_id());

        if(box != undefined) {

            activeChatBox.update(arr => {
                arr.push(box.value);
                return arr;
            });

            found = true;
        }

        return found;
    }

    async function viewChat() {

        if(!chatBoxExist()) {

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
                    user_id: $user.get_id()
                }

                chats.push(new_chat);

                return chats;
            });
        }
    }
</script>

<button class="btn btn-danger" on:click="{() => (userCard.set(false))}"><i class="fa fa-close"></i></button>

{#if curr_user.get_id() == $user.get_id()}
    <button class="btn btn-primary" on:click="{viewChat}">Chat</button>
{/if}

<h4>{curr_user.get_first_name().toLowerCase()} {curr_user.get_last_name().toLowerCase()}'s posts</h4>

<hr/>

{#each posts as post}
    <PostCard {post} user={$user} />
    <hr/>
{/each}

<style>
    h4 {
        margin-top:50px;
    }

    .btn-primary {
        float: left;
        
    }

    .btn-danger {
        float:right;
        border-radius: 50%;
    }
</style>