<!-- BindingHarness.spec.svelte -->
<script lang="ts">
	import Dialog from './Dialog.svelte';
	import { createRawSnippet } from 'svelte';

	let open = $state(false);

	const trigger = createRawSnippet(() => ({
		render: () => `<span>Open</span>`
	}));
	const title = createRawSnippet(() => ({
		render: () => `<span>Dialog title</span>`
	}));
	const content = createRawSnippet(() => ({
		render: () => `<p>Dialog content</p>`
	}));
</script>

<Dialog bind:open {trigger} {title} children={content} />
<output data-testid="outer-open">{open}</output>
