<!-- BindingHarness.spec.svelte -->
<script lang="ts">
	import Tooltip from './Tooltip.svelte';
	import { createRawSnippet } from 'svelte';

	let open = $state(false);

	const content = createRawSnippet(() => ({
		render: () => `<span>Saves your changes</span>`
	}));
</script>

<Tooltip bind:open {content} delayDuration={0}>
	<button type="button">Save</button>
</Tooltip>
<output data-testid="outer-open">{open}</output>
