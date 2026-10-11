<script lang="ts">
	import Alert from './Alert.svelte';
	import type { AlertVariant } from './Alert.types.js';

	let alertRef = $state<HTMLDivElement | null>(null);
	let currentVariant = $state<AlertVariant>('danger');
</script>

<Alert
	bind:ref={alertRef}
	variant={currentVariant}
	classes={{ content: 'custom-content-wrapper' }}
>
	{#snippet icon({ variant })}
		<span data-testid="icon-variant">{variant}</span>
	{/snippet}
	{#snippet title({ variant })}
		<span data-testid="title-variant">{variant}</span>
	{/snippet}
	{#snippet description({ variant })}
		<span data-testid="desc-variant">{variant}</span>
	{/snippet}
	{#snippet children({ variant })}
		<span data-testid="children-variant">{variant}</span>
	{/snippet}
</Alert>

<span data-testid="has-alert-ref">{alertRef ? 'yes' : 'no'}</span>
