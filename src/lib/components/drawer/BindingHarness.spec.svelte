<!-- BindingHarness.spec.svelte -->
<script lang="ts">
	import Drawer from './Drawer.svelte';
	import { createRawSnippet } from 'svelte';

	let open = $state(false);

	const trigger = createRawSnippet(() => ({
		render: () => `<span>Open</span>`
	}));
	const title = createRawSnippet(() => ({
		render: () => `<span>Drawer title</span>`
	}));
	const content = createRawSnippet(() => ({
		render: () => `<p>Drawer content</p>`
	}));
</script>

<Drawer bind:open {trigger} {title} children={content} />
<output data-testid="outer-open">{open}</output>
