<script lang="ts">
	import Collapsible from './Collapsible.svelte';
	import { createRawSnippet } from 'svelte';

	let open = $state(false);

	const trigger = createRawSnippet(() => ({
		render: () => `<span>Toggle</span>`
	}));
	const content = createRawSnippet(() => ({
		render: () => `<p>Details go here.</p>`
	}));
</script>

<Collapsible bind:open {trigger} children={content} />
<output data-testid="outer-open">{open}</output>
