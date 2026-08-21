<script lang="ts">
	import TextField from '../text-field/TextField.svelte';
	import type { PasswordFieldProps } from './PasswordField.types.js';

	let {
		visible = $bindable(false),
		value = $bindable(''),
		ref = $bindable(null),
		labels,
		disabled = false,
		autocomplete = 'current-password',
		...restProps
	}: PasswordFieldProps = $props();

	// The label names the action and flips with state, so the button deliberately
	// carries no `aria-pressed`. Doing both makes a screen reader announce
	// "Hide password … pressed", where the name and the state contradict.
	const toggleLabel = $derived(
		visible ? (labels?.hide ?? 'Hide password') : (labels?.show ?? 'Show password')
	);
</script>

<TextField
	{...restProps}
	bind:value
	bind:ref
	{disabled}
	{autocomplete}
	type={visible ? 'text' : 'password'}
>
	{#snippet suffix()}
		<button
			type="button"
			{disabled}
			onclick={() => (visible = !visible)}
			aria-label={toggleLabel}
			data-state={visible ? 'visible' : 'hidden'}
			class="flex cursor-pointer appearance-none items-center rounded-md text-foreground-faint transition-colors duration-150 hover:text-foreground-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed"
		>
			{#if visible}
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					aria-hidden="true"
				>
					<path d="M3 3l18 18" />
					<path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
					<path d="M9.4 5.2A9.5 9.5 0 0 1 12 5c5 0 9 4.5 9 7a11 11 0 0 1-2.4 3.5" />
					<path d="M6.3 6.9C3.9 8.4 3 10.7 3 12c0 2.5 4 7 9 7a9.7 9.7 0 0 0 3.5-.7" />
				</svg>
			{:else}
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					aria-hidden="true"
				>
					<path d="M3 12c0-2.5 4-7 9-7s9 4.5 9 7c0 2.5-4 7-9 7s-9-4.5-9-7Z" />
					<circle cx="12" cy="12" r="2.5" />
				</svg>
			{/if}
		</button>
	{/snippet}
</TextField>
