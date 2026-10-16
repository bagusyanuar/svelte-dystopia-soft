<script lang="ts">
	import Collapsible from './Collapsible.svelte';

	let {
		open = $bindable(false),
		disabled = false,
		customIndicator = false
	}: {
		open?: boolean;
		disabled?: boolean;
		customIndicator?: boolean;
	} = $props();

	let collapsibleRef = $state<HTMLDivElement | null>(null);
	let triggerRef = $state<HTMLButtonElement | null>(null);
</script>

{#if customIndicator}
	<Collapsible
		bind:ref={collapsibleRef}
		bind:triggerRef
		bind:open
		{disabled}
		classes={{
			panel: 'custom-panel-class',
			indicator: 'custom-indicator-class'
		}}
	>
		{#snippet trigger({ open: isOpen })}
			<span data-testid="trigger-text">{isOpen ? 'Expanded' : 'Collapsed'}</span>
		{/snippet}
		{#snippet indicator({ open: isOpen })}
			<span data-testid="custom-indicator">{isOpen ? '[-]' : '[+]'}</span>
		{/snippet}
		{#snippet children({ open: isOpen })}
			<span data-testid="content-text">{isOpen ? 'Open Content' : 'Closed Content'}</span>
		{/snippet}
	</Collapsible>
{:else}
	<Collapsible
		bind:ref={collapsibleRef}
		bind:triggerRef
		bind:open
		{disabled}
		classes={{
			panel: 'custom-panel-class',
			indicator: 'custom-indicator-class'
		}}
	>
		{#snippet trigger({ open: isOpen })}
			<span data-testid="trigger-text">{isOpen ? 'Expanded' : 'Collapsed'}</span>
		{/snippet}
		{#snippet children({ open: isOpen })}
			<span data-testid="content-text">{isOpen ? 'Open Content' : 'Closed Content'}</span>
		{/snippet}
	</Collapsible>
{/if}

<span data-testid="has-collapsible-ref">{collapsibleRef ? 'yes' : 'no'}</span>
<span data-testid="has-trigger-ref">{triggerRef ? 'yes' : 'no'}</span>
