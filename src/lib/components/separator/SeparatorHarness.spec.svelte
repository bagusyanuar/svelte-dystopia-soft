<script lang="ts">
	import Separator from './Separator.svelte';
	import type { SeparatorProps } from './Separator.types.js';

	let {
		orientation = 'horizontal',
		decorative = true
	}: Pick<SeparatorProps, 'orientation' | 'decorative'> = $props();

	let sepRef = $state<HTMLDivElement | null>(null);
</script>

<Separator bind:ref={sepRef} {orientation} {decorative} data-testid="harness-sep" />

<span data-testid="has-ref">{sepRef ? 'yes' : 'no'}</span>
