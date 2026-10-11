<script lang="ts">
	import Badge from './Badge.svelte';
	import type { BadgeProps, BadgeVariant } from './Badge.types.js';

	let {
		variant = 'default',
		size = 'md'
	}: {
		variant?: BadgeVariant;
		size?: BadgeProps['size'];
	} = $props();

	let badgeRef = $state<HTMLSpanElement | null>(null);
</script>

<Badge bind:ref={badgeRef} {variant} {size}>
	{#snippet children({ variant: v })}
		<span data-testid="variant-in-child">{v}</span>
	{/snippet}
</Badge>

<span data-testid="has-badge-ref">{badgeRef ? 'yes' : 'no'}</span>
