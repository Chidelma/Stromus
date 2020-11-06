<script lang="ts">
	import { isAuth } from './Scripts/Init';
	import SignUp from './Components/Entry/SignUp.svelte';
	import Login from './Components/Entry/Login.svelte';
	import Dash from './Components/Dash.svelte';

	let showLogin:boolean = true;
</script>

{#if !$isAuth}
	{#if showLogin}
		<Login/>
		<p class="switch">Don't have an account? <span on:click="{() => (showLogin = !showLogin)}">Sign Up</span></p>
	{:else}
		<SignUp/>
		<p class="switch">Already have an account? <span on:click="{() => (showLogin = !showLogin)}">Login</span></p>
	{/if}
{:else}
	<Dash/>
{/if}

<style>
	.switch {
		margin-top:20px;
		text-align: center;
	}
</style>