<script lang="ts">
    import type { _chatbox } from '../Scripts/Interface';
    import ChatBox from './ChatBox.svelte';

    export let tabs:_chatbox[] = [];

    let refresh = () => (tabs = tabs);
</script>

{#each tabs as tab}
    <ChatBox box={tab} on:message={refresh} />
{/each}