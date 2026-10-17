<script lang="ts">
	import Toaster from './Toaster.svelte';
	import type { ToastPosition, ToasterClasses } from './Toaster.types.js';

	let {
		position = 'bottom-right',
		classes = undefined,
		useCustomItem = false
	}: {
		position?: ToastPosition;
		classes?: ToasterClasses;
		useCustomItem?: boolean;
	} = $props();

	let toasterRef = $state<HTMLDivElement | null>(null);
</script>

<Toaster
	bind:ref={toasterRef}
	{position}
	{classes}
	data-testid="custom-toaster-root"
>
	{#snippet item({ toast, dismiss })}
		{#if useCustomItem}
			<div data-testid="custom-toast-item" data-custom-id={toast.id}>
				<span>Custom: {toast.title}</span>
				<button type="button" data-testid="custom-dismiss-btn" onclick={() => dismiss(toast.id)}>
					Dismiss Custom
				</button>
			</div>
		{/if}
	{/snippet}
</Toaster>

<span data-testid="has-toaster-ref">{Boolean(toasterRef)}</span>
