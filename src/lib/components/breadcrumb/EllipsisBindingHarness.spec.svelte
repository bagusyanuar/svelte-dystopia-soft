<script lang="ts">
	import BreadcrumbEllipsis from './BreadcrumbEllipsis.svelte';
	import { createRawSnippet } from 'svelte';

	let open = $state(false);

	const content = createRawSnippet(() => ({
		render: () => `<a href="/library">Library</a>`
	}));
</script>

<BreadcrumbEllipsis bind:open children={content} />
<output data-testid="outer-open">{open}</output>
