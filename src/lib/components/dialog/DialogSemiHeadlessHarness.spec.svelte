<script lang="ts">
	import Dialog from './Dialog.svelte';
	import type { DialogClasses } from './Dialog.types.js';

	let {
		open = $bindable(false),
		class: className,
		classes,
		disabled = false,
		useCustomClose = false
	}: {
		open?: boolean;
		class?: string;
		classes?: DialogClasses;
		disabled?: boolean;
		useCustomClose?: boolean;
	} = $props();

	let rootRef = $state<HTMLButtonElement | null>(null);
	let triggerRef = $state<HTMLButtonElement | null>(null);
	let contentRef = $state<HTMLDivElement | null>(null);
</script>

<div
	data-testid="ref-status"
	data-has-root={rootRef ? 'true' : 'false'}
	data-has-trigger={triggerRef ? 'true' : 'false'}
	data-has-content={contentRef ? 'true' : 'false'}
></div>

{#if useCustomClose}
	<Dialog
		bind:ref={rootRef}
		bind:triggerRef
		bind:contentRef
		bind:open
		class={className}
		{classes}
		{disabled}
	>
		{#snippet trigger({ open: isOpen })}
			<span data-testid="trigger-span" data-is-open={isOpen ? 'true' : 'false'}>
				{isOpen ? 'Close Modal' : 'Open Modal'}
			</span>
		{/snippet}
		{#snippet title({ open: isOpen })}
			<span data-testid="title-span" data-is-open={isOpen ? 'true' : 'false'}>Modal Title</span>
		{/snippet}
		{#snippet description({ open: isOpen })}
			<span data-testid="desc-span" data-is-open={isOpen ? 'true' : 'false'}>Modal Description</span
			>
		{/snippet}
		{#snippet close({ close })}
			<button type="button" data-testid="custom-close-btn" onclick={close}> Custom Dismiss </button>
		{/snippet}
		{#snippet children({ open: isOpen, close })}
			<div data-testid="body-content" data-is-open={isOpen ? 'true' : 'false'}>
				<p>Content inside modal</p>
				<button type="button" data-testid="inner-close-btn" onclick={close}>
					Cancel from inside
				</button>
			</div>
		{/snippet}
	</Dialog>
{:else}
	<Dialog
		bind:ref={rootRef}
		bind:triggerRef
		bind:contentRef
		bind:open
		class={className}
		{classes}
		{disabled}
	>
		{#snippet trigger({ open: isOpen })}
			<span data-testid="trigger-span" data-is-open={isOpen ? 'true' : 'false'}>
				{isOpen ? 'Close Modal' : 'Open Modal'}
			</span>
		{/snippet}
		{#snippet title({ open: isOpen })}
			<span data-testid="title-span" data-is-open={isOpen ? 'true' : 'false'}>Modal Title</span>
		{/snippet}
		{#snippet description({ open: isOpen })}
			<span data-testid="desc-span" data-is-open={isOpen ? 'true' : 'false'}>Modal Description</span
			>
		{/snippet}
		{#snippet children({ open: isOpen, close })}
			<div data-testid="body-content" data-is-open={isOpen ? 'true' : 'false'}>
				<p>Content inside modal</p>
				<button type="button" data-testid="inner-close-btn" onclick={close}>
					Cancel from inside
				</button>
			</div>
		{/snippet}
	</Dialog>
{/if}
