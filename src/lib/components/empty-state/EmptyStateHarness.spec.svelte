<script lang="ts">
	import EmptyState from './EmptyState.svelte';
	import type { EmptyStateClasses } from './EmptyState.types.js';

	let {
		class: className,
		classes,
		hasIcon = true,
		hasTitle = true,
		hasDescription = true,
		hasChildren = true
	}: {
		class?: string;
		classes?: EmptyStateClasses;
		hasIcon?: boolean;
		hasTitle?: boolean;
		hasDescription?: boolean;
		hasChildren?: boolean;
	} = $props();

	let rootRef = $state<HTMLDivElement | null>(null);
</script>

<div data-testid="ref-status" data-has-root={rootRef ? 'true' : 'false'}></div>

<EmptyState bind:ref={rootRef} class={className} {classes}>
	{#snippet icon()}
		{#if hasIcon}
			<svg data-testid="test-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
		{/if}
	{/snippet}
	{#snippet title()}
		{#if hasTitle}
			<span>No results found</span>
		{/if}
	{/snippet}
	{#snippet description()}
		{#if hasDescription}
			<span>Try adjusting your filters or search terms.</span>
		{/if}
	{/snippet}
	{#if hasChildren}
		<button type="button" data-testid="cta-btn">Create item</button>
	{/if}
</EmptyState>
