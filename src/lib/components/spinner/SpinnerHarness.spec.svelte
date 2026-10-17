<script lang="ts">
	import Spinner from './Spinner.svelte';
	import type { SpinnerClasses, SpinnerProps } from './Spinner.types.js';

	let {
		size = 'md',
		label = undefined,
		classes = undefined,
		customIcon = false
	}: {
		size?: SpinnerProps['size'];
		label?: string;
		classes?: SpinnerClasses;
		customIcon?: boolean;
	} = $props();

	let spanRef = $state<HTMLSpanElement | null>(null);
</script>

{#if customIcon}
	<Spinner bind:ref={spanRef} {size} {label} {classes} data-testid="harness-spinner">
		{#snippet icon({ size: iconSize })}
			<span data-testid="custom-spinner-icon">CUSTOM_SPINNER_{iconSize}</span>
		{/snippet}
	</Spinner>
{:else}
	<Spinner bind:ref={spanRef} {size} {label} {classes} data-testid="harness-spinner" />
{/if}

<span data-testid="has-ref">{spanRef ? 'yes' : 'no'}</span>
