<script lang="ts">
	import { isAuth } from './Scripts/Init';
	import SignUp from './Components/Entry/SignUp.svelte';
	import Login from './Components/Entry/Login.svelte';
	import Dash from './Components/Dash.svelte';

	let showLogin:boolean = true;
</script>

<div id="body">
{#if !$isAuth}
	{#if showLogin}
		<Login/>
		<p class="switch">Don't have an account? <button class="btn btn-sm" on:click="{() => (showLogin = !showLogin)}">Sign Up</button></p>
	{:else}
		<SignUp/>
		<p class="switch">Already have an account? <button class="btn btn-sm" on:click="{() => (showLogin = !showLogin)}">Login</button></p>
	{/if}
{:else}
	<Dash/>
{/if}
</div>

<style>
	.switch {
		margin-top:20px;
		text-align: center;
	}

	.btn{
		box-shadow: unset;
		color: #350d22;
		border-color: #350d22;
		background-color: transparent;
	}

	.btn:hover {
		color:white;
		background-color: #350d22;
	}

	#body {
		position: fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background-color: slateblue;
	}
</style>