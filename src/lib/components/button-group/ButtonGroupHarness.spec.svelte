<script lang="ts">
	import ButtonGroup from './ButtonGroup.svelte';
	import type { ButtonGroupOrientation } from './ButtonGroup.types.js';

	let {
		orientation = 'horizontal'
	}: {
		orientation?: ButtonGroupOrientation;
	} = $props();

	let groupRef = $state<HTMLDivElement | null>(null);
</script>

<ButtonGroup bind:ref={groupRef} {orientation} data-testid="group-root">
	{#snippet children({ orientation: o })}
		<span data-testid="child-orientation">{o}</span>
	{/snippet}
</ButtonGroup>

<span data-testid="has-group-ref">{groupRef ? 'yes' : 'no'}</span>
