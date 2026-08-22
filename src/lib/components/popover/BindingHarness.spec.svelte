<!-- BindingHarness.spec.svelte -->
<script lang="ts">
	import Popover from './Popover.svelte';
	import { createRawSnippet } from 'svelte';

	let open = $state(false);

	const trigger = createRawSnippet(() => ({
		render: () => `<span>Open</span>`
	}));
	const content = createRawSnippet(() => ({
		render: () => `<p>Panel content</p>`
	}));
</script>

<Popover bind:open {trigger} children={content} />
<output data-testid="outer-open">{open}</output>
