<!-- BindingHarness.spec.svelte -->
<script lang="ts">
	import HoverCard from './HoverCard.svelte';
	import { createRawSnippet } from 'svelte';

	let open = $state(false);

	const content = createRawSnippet(() => ({
		render: () => `<div data-testid="hovercard-content"><a href="/profile">View profile</a></div>`
	}));
</script>

<HoverCard bind:open {content} openDelay={0}>
	<a href="#ada">@ada</a>
</HoverCard>
<output data-testid="outer-open">{open}</output>
